// server.js
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const messages = []; // In-memory store for messages

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing messages to new client
  socket.emit('init', messages);

  // Receive and broadcast new messages
  socket.on('message', (msg) => {
    const message = { user: msg.user, text: msg.text, time: new Date() };
    messages.push(message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
