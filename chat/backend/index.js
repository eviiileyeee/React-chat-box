const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = 3001;

const {Server} = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin
  }
});


// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_room', ({ user, room }) => {
    socket.join(room);
    console.log(`${user} joined room: ${room}`);
  });

  socket.on('send_message', ({ room, user, message }) => {
    const d = {user:user , message : message}
    socket.to(room).emit('receive_message', d);
    console.log(`Message from ${user} in room ${room}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
