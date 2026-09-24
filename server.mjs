import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || '*';

// Create HTTP server with security headers
const server = createServer((req, res) => {
  // Production Security Headers
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Safe status response (No internal server traces or environment secrets exposed)
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'ONLINE',
        service: 'ArogyaSeva Realtime Medical Event Relay',
        connectedClients: wss ? wss.clients.size : 0,
        timestamp: new Date().toISOString()
      })
    );
    return;
  }

  // Safe 404 response
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

const wss = new WebSocketServer({ server });

// Heartbeat ping interval (30s) to keep cloud proxy/balancer connections alive
const pingInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log('[WS] Terminating inactive client connection');
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(pingInterval);
});

wss.on('connection', (ws, req) => {
  ws.isAlive = true;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`[WS CONNECT] New client connected from ${clientIp}. Total active clients: ${wss.clients.size}`);

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  // Send connection acknowledgement
  ws.send(
    JSON.stringify({
      type: 'CONNECTED_ACK',
      message: 'Connected to ArogyaSeva Cloud Medical Relay Engine',
      clientCount: wss.clients.size,
      timestamp: new Date().toISOString()
    })
  );

  ws.on('message', (data) => {
    try {
      const messageString = data.toString();
      // Payload size check (Max 1MB)
      if (messageString.length > 1024 * 1024) {
        console.warn('[WS WARN] Rejected oversized message payload');
        return;
      }

      const parsed = JSON.parse(messageString);

      // Validate event schema
      if (!parsed || typeof parsed !== 'object' || !parsed.type) {
        console.warn('[WS WARN] Invalid message format received');
        return;
      }

      console.log(`[WS BROADCAST] Event: ${parsed.type} | Sender: ${parsed.senderDeviceId || 'Unknown'}`);

      // Broadcast payload to all open clients across different devices and networks
      const relayMessage = JSON.stringify({
        ...parsed,
        relayedAt: new Date().toISOString()
      });

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(relayMessage);
        }
      });
    } catch (err) {
      console.error('[WS ERROR] Failed to process incoming message');
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`[WS DISCONNECT] Client disconnected (${code}). Active clients: ${wss.clients.size}`);
  });

  ws.on('error', (err) => {
    console.error('[WS ERROR]', err.message);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  AROGYASEVA CLOUD REALTIME MEDICAL RELAY ACTIVE     `);
  console.log(`  Listening on 0.0.0.0:${PORT}`);
  console.log(`  CORS Allowed Origin: ${ALLOWED_ORIGIN}`);
  console.log(`====================================================`);
});
