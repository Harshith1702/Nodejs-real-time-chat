const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
// Serve main.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});
// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for new user joining
  socket.on('new-user', (username) => {
    socket.username = username;
    // Notify all other users
    socket.broadcast.emit('message', `${username} joined the chat`);
  });

  // Listen for chat messages
  socket.on('chat-message', (msg) => {
    // Send message to all users
    io.emit('message', `${socket.username}: ${msg}`);
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('message', `${socket.username} left the chat`);
    }
  });
});

const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
