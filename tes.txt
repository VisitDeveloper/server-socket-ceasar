
// /////////////////////////////////////

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// ساخت اپلیکیشن Express
const app = express();

// ایجاد یک سرور HTTP
const server = http.createServer(app);

// پیاده‌سازی Socket.IO روی سرور
const io = new Server(server, {
  cors: {
    origin: "*", // اجازه به هر منبعی برای اتصال (در حالت توسعه)
    methods: ["GET", "POST"]
  }
});

const caesarEncrypt = (text, shift) => {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt();
        const base = char >= 'a' ? 97 : 65; // Determine base (ASCII code for 'a' or 'A')
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char; // Return non-alphabetic characters unchanged
    }).join('');
  };

// مدیریت درخواست HTTP ساده
app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

// مدیریت اتصالات WebSocket
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // دریافت پیام از کلاینت
  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);
    // const encryptedMessage = caesarEncrypt(message, shift);
    // ارسال پیام به همه کلاینت‌ها
    io.emit('receiveMessage', message);
  });

  // مدیریت قطع اتصال
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// راه‌اندازی سرور روی پورت 3000
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
