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

// Fallback Public Cloud WSS Relay Endpoint for Cross-Network (Different Wi-Fi / 4G / 5G) Synchronization
const GLOBAL_CLOUD_WSS_RELAY_URL =
  import.meta.env.VITE_WEBSOCKET_URL ||
  'wss://free.piesocket.com/v3/arogyaseva_global_channel_v3.2?api_key=VC44WRWAKwavNzYERLEEvwkyZXufPcqmlqosfJa7';

class RealtimeService {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<(payload: RealtimePayload) => void>> = new Map();
  private deviceId: string = 'dev-' + Math.random().toString(36).substring(2, 9);
  private supabaseChannel: any = null;
  private socket: WebSocket | null = null;
  private cloudRelaySocket: WebSocket | null = null;
  private isSocketConnected = false;
  private isCloudRelayConnected = false;
  private processedEventIds: Set<string> = new Set();
  private maxEventIdHistory = 300;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 10000;
  private statusListeners: Set<(status: ConnectionStatusType) => void> = new Set();
  public currentStatus: ConnectionStatusType = 'LIVE';

  constructor() {
    // 1. Cross-Tab Sync via BroadcastChannel (Same Machine)
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

    // 2. Local LAN WebSocket Connection (Same Wi-Fi Network)
    this.connectLocalWebSocketServer();

    // 3. Global Cloud WSS Relay Connection (Different Wi-Fi / 4G / 5G Networks)
    this.connectGlobalCloudRelay();

    // 4. Supabase Cloud Realtime Channel (Global Cross-Network Infrastructure)
    this.subscribeToSupabaseRealtime();
  }

  private connectLocalWebSocketServer() {
    if (typeof window === 'undefined') return;

    try {
      const isHttps = window.location.protocol === 'https:';
      const defaultHost = window.location.hostname || 'localhost';
      const localWsUrl = `${isHttps ? 'wss:' : 'ws:'}//${defaultHost}:4000`;

      this.socket = new WebSocket(localWsUrl);

      this.socket.onopen = () => {
        this.isSocketConnected = true;
        this.updateStatus('LIVE');
        console.log('✅ Local LAN WebSocket Connected:', localWsUrl);
      };

      this.socket.onmessage = (event) => {
        try {
          const payload: RealtimePayload = JSON.parse(event.data);
          if (payload && payload.type) {
            this.handleIncomingPayload(payload);
          }
        } catch (e) {
          // ignore
        }
      };

      this.socket.onclose = () => {
        this.isSocketConnected = false;
        setTimeout(() => this.connectLocalWebSocketServer(), 8000);
      };

      this.socket.onerror = () => {
        // Silently handle LAN disconnect when on a different Wi-Fi
      };
    } catch (err) {
      // ignore
    }
  }

  private connectGlobalCloudRelay() {
    if (typeof window === 'undefined') return;

    try {
      this.cloudRelaySocket = new WebSocket(GLOBAL_CLOUD_WSS_RELAY_URL);

      this.cloudRelaySocket.onopen = () => {
        this.isCloudRelayConnected = true;
        this.updateStatus('LIVE');
        console.log('⚡ Global Cross-Network Cloud Relay Active!');
      };

      this.cloudRelaySocket.onmessage = (event) => {
        try {
          const payload: RealtimePayload = JSON.parse(event.data);
          if (payload && payload.type) {
            this.handleIncomingPayload(payload);
          }
        } catch (e) {
          // ignore
        }
      };

      this.cloudRelaySocket.onclose = () => {
        this.isCloudRelayConnected = false;
        setTimeout(() => this.connectGlobalCloudRelay(), 5000);
      };

      this.cloudRelaySocket.onerror = () => {
        // ignore
      };
    } catch (err) {
      console.warn('Cloud relay initialization fallback:', err);
    }
  }

  private subscribeToSupabaseRealtime() {
    try {
      this.supabaseChannel = supabase.channel('arogyaseva_global_realtime_channel', {
        config: { broadcast: { self: false } },
      });

      this.supabaseChannel
        .on('broadcast', { event: 'arogyaseva_event' }, (payload: { payload: RealtimePayload }) => {
          if (payload && payload.payload) {
            this.handleIncomingPayload(payload.payload);
          }
        })
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            console.log('🌐 Supabase Cloud Multi-Network Channel Live!');
            this.updateStatus('LIVE');
          }
        });
    } catch (err) {
      console.warn('Supabase global channel subscription warning:', err);
    }
  }

  private handleIncomingPayload(payload: RealtimePayload) {
    // 1. Ignore events sent by the same device instance
    if (payload.senderDeviceId === this.deviceId) return;

    // 2. Event Deduplication Safeguard
    if (payload.eventId && this.processedEventIds.has(payload.eventId)) {
      return;
    }

    if (payload.eventId) {
      this.processedEventIds.add(payload.eventId);
      if (this.processedEventIds.size > this.maxEventIdHistory) {
        const oldest = this.processedEventIds.values().next().value;
        if (oldest) this.processedEventIds.delete(oldest);
      }
    }

    console.log('⚡ Realtime Event Received Across Network:', payload.type, payload.eventId);
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

    // Mark as processed locally
    this.processedEventIds.add(eventId);

    // Emit locally immediately
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

    // 2. Broadcast across Local LAN WebSocket
    if (this.socket && this.isSocketConnected) {
      try {
        this.socket.send(JSON.stringify(payload));
      } catch (err) {
        // ignore
      }
    }

    // 3. Broadcast across Global Cloud WSS Relay (Works on DIFFERENT Wi-Fi & 4G/5G)
    if (this.cloudRelaySocket && this.isCloudRelayConnected) {
      try {
        this.cloudRelaySocket.send(JSON.stringify(payload));
      } catch (err) {
        // ignore
      }
    }

    // 4. Broadcast across Supabase Cloud Channel (Works Globally across different Wi-Fi networks!)
    if (this.supabaseChannel) {
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

    // LocalStorage cross-window fallback
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

