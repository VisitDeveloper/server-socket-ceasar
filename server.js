const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});




io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('sendMessage', ({ message, shift }) => {
    const encryptedMessage = message;
    io.emit('receiveMessage', encryptedMessage); // Send encrypted message to all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

