import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type RealtimeEventType = 
  | 'CASE_CREATED'
  | 'CASE_UPDATED'
  | 'DOCTOR_RESPONSE_CREATED'
  | 'REFERRAL_UPDATED'
  | 'EMERGENCY_ESCALATED'
  | 'NOTIFICATION_NEW';

export interface RealtimePayload {
  eventId: string;
  type: RealtimeEventType;
  data: any;
  timestamp: string;
  senderDeviceId?: string;
}

export type ConnectionStatusType = 'LIVE' | 'SYNCING' | 'OFFLINE';

class RealtimeService {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<(payload: RealtimePayload) => void>> = new Map();
  private deviceId: string = 'dev-' + Math.random().toString(36).substring(2, 9);
  private supabaseChannel: any = null;
  private socket: WebSocket | null = null;
  private isSocketConnected = false;
  private processedEventIds: Set<string> = new Set();
  private maxEventIdHistory = 200;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 10000;
  private statusListeners: Set<(status: ConnectionStatusType) => void> = new Set();
  public currentStatus: ConnectionStatusType = 'OFFLINE';

  constructor() {
    // 1. Cross-Tab Sync via BroadcastChannel
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('arogyaseva_realtime_sync');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type) {
            this.handleIncomingPayload(event.data);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported in environment');
      }
    }

    // 2. Physical Multi-Computer & Multi-Network WebSocket Connection
    this.connectWebSocketServer();

    // 3. Supabase Cloud Realtime Channel (Works Globally across different Wi-Fi & Mobile Networks)
    if (isSupabaseConfigured) {
      this.subscribeToSupabaseRealtime();
    }
  }

  private connectWebSocketServer() {
    if (typeof window === 'undefined') return;

    try {
      this.updateStatus('SYNCING');
      
      // Compute production or local WebSocket URL
      const envWsUrl = import.meta.env.VITE_WEBSOCKET_URL;
      const isHttps = window.location.protocol === 'https:';
      const defaultHost = window.location.hostname || 'localhost';
      
      const wsUrl = envWsUrl 
        ? envWsUrl 
        : `${isHttps ? 'wss:' : 'ws:'}//${defaultHost}:4000`;

      console.log('🔌 Realtime Engine connecting to:', wsUrl);

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isSocketConnected = true;
        this.reconnectAttempts = 0;
        this.updateStatus('LIVE');
        console.log('✅ Realtime Engine Live & Connected!');
      };

      this.socket.onmessage = (event) => {
        try {
          const payload: RealtimePayload = JSON.parse(event.data);
          if (payload && payload.type) {
            this.handleIncomingPayload(payload);
          }
        } catch (e) {
          // Ignore malformed ping/pong ACK messages
        }
      };

      this.socket.onclose = () => {
        this.isSocketConnected = false;
        this.updateStatus(isSupabaseConfigured ? 'LIVE' : 'OFFLINE');
        
        // Exponential backoff reconnect
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), this.maxReconnectDelay);
        console.warn(`WebSocket disconnected. Reconnecting in ${(delay / 1000).toFixed(1)}s...`);
        setTimeout(() => this.connectWebSocketServer(), delay);
      };

      this.socket.onerror = (err) => {
        console.warn('WebSocket connection attempt error:', err);
      };
    } catch (err) {
      console.warn('Could not establish WebSocket server connection:', err);
      this.updateStatus(isSupabaseConfigured ? 'LIVE' : 'OFFLINE');
    }
  }

  private subscribeToSupabaseRealtime() {
    try {
      this.supabaseChannel = supabase.channel('arogyaseva_global_realtime_channel');
      this.supabaseChannel
        .on('broadcast', { event: 'arogyaseva_event' }, (payload: { payload: RealtimePayload }) => {
          if (payload && payload.payload) {
            this.handleIncomingPayload(payload.payload);
          }
        })
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            console.log('⚡ Supabase Cloud Realtime Channel Subscribed & Live!');
            this.updateStatus('LIVE');
          }
        });
    } catch (err) {
      console.warn('Supabase subscription error:', err);
    }
  }

  private handleIncomingPayload(payload: RealtimePayload) {
    // 1. Ignore events sent by the same device
    if (payload.senderDeviceId === this.deviceId) return;

    // 2. Event Deduplication Check
    if (payload.eventId && this.processedEventIds.has(payload.eventId)) {
      return; // Already executed once
    }

    if (payload.eventId) {
      this.processedEventIds.add(payload.eventId);
      if (this.processedEventIds.size > this.maxEventIdHistory) {
        const oldest = this.processedEventIds.values().next().value;
        if (oldest) this.processedEventIds.delete(oldest);
      }
    }

    console.log('⚡ Realtime Event Processing:', payload.type, payload.eventId);
    this.emit(payload.type, payload);
    this.emit('*', payload);
  }

  public publish(type: RealtimeEventType, data: any) {
    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const payload: RealtimePayload = {
      eventId,
      type,
      data,
      timestamp: new Date().toISOString(),
      senderDeviceId: this.deviceId
    };

    // Mark as processed locally so we don't double process
    this.processedEventIds.add(eventId);

    // Emit to current device local listeners
    this.emit(type, payload);
    this.emit('*', payload);

    // 1. Broadcast across tabs on same machine
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {
        // ignore
      }
    }

    // 2. Broadcast across WebSocket Server
    if (this.socket && this.isSocketConnected) {
      try {
        this.socket.send(JSON.stringify(payload));
      } catch (err) {
        console.warn('Failed to send payload over WebSocket:', err);
      }
    }

    // 3. Broadcast across Supabase Cloud Realtime (Works across different Wi-Fi networks!)
    if (isSupabaseConfigured && this.supabaseChannel) {
      try {
        this.supabaseChannel.send({
          type: 'broadcast',
          event: 'arogyaseva_event',
          payload
        });
      } catch (e) {
        console.warn('Failed to send via Supabase realtime:', e);
      }
    }

    // LocalStorage fallback
    try {
      localStorage.setItem('arogyaseva_latest_cross_device_event', JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }

  public onStatusChange(callback: (status: ConnectionStatusType) => void) {
    this.statusListeners.add(callback);
    callback(this.currentStatus);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  private updateStatus(newStatus: ConnectionStatusType) {
    this.currentStatus = newStatus;
    this.statusListeners.forEach((cb) => cb(newStatus));
  }

  public on(eventType: RealtimeEventType | '*', callback: (payload: RealtimePayload) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    return () => {
      this.off(eventType, callback);
    };
  }

  public off(eventType: RealtimeEventType | '*', callback: (payload: RealtimePayload) => void) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType)!.delete(callback);
    }
  }

  private emit(eventType: string, payload: RealtimePayload) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error('Error in realtime listener callback:', err);
        }
      });
    }
  }
}

export const realtimeService = new RealtimeService();
