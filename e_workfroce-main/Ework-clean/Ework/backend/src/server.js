import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';
import { initDatabase } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Initialize persistent SQLite Database (users table, sign_in column)
initDatabase();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'] }
});

app.use(cors());
app.use(express.json());

// Serve static APK downloads directly from the backend as well
const downloadsDist = path.resolve(__dirname, '../../admin_dashboard/dist/downloads');
const downloadsPublic = path.resolve(__dirname, '../../admin_dashboard/public/downloads');
app.use('/downloads', express.static(downloadsDist));
app.use('/downloads', express.static(downloadsPublic));

// Serve built frontend dashboard if dist exists (enabling single-service full-stack deployment)
const dashboardDist = path.resolve(__dirname, '../../admin_dashboard/dist');
if (fs.existsSync(dashboardDist)) {
  app.use(express.static(dashboardDist));
}

// Inject io into every request
app.set('io', io);

// Mount API routes
app.use('/api', apiRouter);

// Fallback: serve React index.html for client-side routing, or API welcome JSON if dist not built
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/downloads') || req.path.startsWith('/socket.io')) {
    return next();
  }
  const indexPath = path.join(dashboardDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({
    name: 'Ework / TaskRoom Backend API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      attendance: '/api/attendance',
      tasks: '/api/tasks',
      shifts: '/api/shifts',
      expenses: '/api/expenses',
      assets: '/api/assets',
      chat: '/api/chat/messages',
      sos: '/api/sos'
    },
    web_dashboard: 'Build admin_dashboard to view web UI here'
  });
});

// WebSocket: Real-time GPS tracking & chat rooms
io.on('connection', (socket) => {
  console.log(`[Socket.io] Connected: ${socket.id}`);

  // Employee live GPS update
  socket.on('update_location', (payload) => {
    // { userId, latitude, longitude, speed, battery }
    io.emit('employee_moved', payload);
  });

  // Join task-specific chat room
  socket.on('join_task_room', (taskId) => {
    socket.join(`task_${taskId}`);
    console.log(`[Socket.io] ${socket.id} joined task room: task_${taskId}`);
  });

  socket.on('send_task_message', (msg) => {
    io.emit('new_message', msg);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Ework Backend API running on http://0.0.0.0:${PORT}`);
  console.log(`📡 WebSocket server active on ws://0.0.0.0:${PORT}`);
});
