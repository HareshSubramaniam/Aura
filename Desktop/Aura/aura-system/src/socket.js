import { io } from 'socket.io-client';

const socket = io('https://railway-up-production-367d.up.railway.app', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

export default socket;
