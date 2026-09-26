const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 8 * 1024 * 1024 // 8MB, images ke liye
});

app.use(express.static(path.join(__dirname, 'public')));

// room = password string. roomUsers: { password: { socketId: username } }
const roomUsers = {};

io.on('connection', (socket) => {
  let currentRoom = null;
  let currentName = null;

  socket.on('join', ({ room, username }) => {
    if (!room || !username) return;
    currentRoom = room;
    currentName = username;

    socket.join(room);
    if (!roomUsers[room]) roomUsers[room] = {};
    roomUsers[room][socket.id] = username;

    socket.emit('joined', { room });
    io.to(room).emit('system', `${username} ने रूम जॉइन किया`);
    io.to(room).emit('userList', Object.values(roomUsers[room]));
  });

  socket.on('chatMessage', (msg) => {
    if (!currentRoom || !currentName) return;
    io.to(currentRoom).emit('chatMessage', {
      username: currentName,
      text: msg,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });
  });

  socket.on('imageMessage', (imageData) => {
    if (!currentRoom || !currentName) return;
    io.to(currentRoom).emit('imageMessage', {
      username: currentName,
      image: imageData,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });
  });

  socket.on('changeName', (newName) => {
    if (!currentRoom || !newName) return;
    const oldName = currentName;
    currentName = newName;
    roomUsers[currentRoom][socket.id] = newName;
    io.to(currentRoom).emit('system', `${oldName} ने अपना नाम बदलकर ${newName} रख लिया`);
    io.to(currentRoom).emit('userList', Object.values(roomUsers[currentRoom]));
  });

  socket.on('leaveRoom', () => {
    leave();
  });

  socket.on('disconnect', () => {
    leave();
  });

  function leave() {
    if (currentRoom && roomUsers[currentRoom]) {
      delete roomUsers[currentRoom][socket.id];
      io.to(currentRoom).emit('system', `${currentName} रूम से चला गया`);
      io.to(currentRoom).emit('userList', Object.values(roomUsers[currentRoom]));
      socket.leave(currentRoom);
      if (Object.keys(roomUsers[currentRoom]).length === 0) {
        delete roomUsers[currentRoom];
      }
    }
    currentRoom = null;
    currentName = null;
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

