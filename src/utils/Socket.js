import { io, Socket } from 'socket.io-client';
import ApiConstants from '../Constants/Api.constants';

let socket = null;

export const connectSocket = authToken => {
  if (socket && socket.connected) {
    return socket;
  }

  // Disconnect any stale socket before creating a new one
  if (socket) {
    socket.disconnect();
  }

  socket = io(ApiConstants.socketUrl, {
    transports: ['websocket'],
    auth: { token: authToken },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    timeout: 10000,
  });

  // Built-in lifecycle listeners (logging / debugging)
  socket.on('connect', () => {
    console.log('[Socket] Connected — id:', socket?.id);
  });

  socket.on('disconnect', reason => {
    console.log('[Socket] Disconnected —', reason);
  });

  socket.on('connect_error', err => {
    console.warn('[Socket] Connection error —', err.message);
  });

  socket.on('reconnect_attempt', attempt => {
    console.log('[Socket] Reconnect attempt #', attempt);
  });

  socket.on('reconnect', () => {
    console.log('[Socket] Reconnected');
  });

  return socket;
};

/** Cleanly disconnects the socket and nullifies the singleton. */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[Socket] Manually disconnected');
  }
}

/**
 * Returns the current socket instance, or null if not yet connected.
 * Use this in screens / services to emit events or attach listeners.
 *
 * @example
 *   const s = getSocket();
 *   s?.emit('joinRoom', { roomId: '123' });
 *   s?.on('newMessage', handler);
 */
export function getSocket() {
  return socket;
}
