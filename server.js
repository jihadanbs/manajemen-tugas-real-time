const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Fallback jika env tidak diset
const server = http.createServer(app);
const io = socketIo(server);

// Koneksi ke MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Cek jika port sudah digunakan
server.listen(PORT, (err) => {
  if (err) {
    console.error(`Port ${PORT} is already in use. Please choose a different port.`);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});
