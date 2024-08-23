




import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import User from './models/user.js'; 

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const PORT = 3000;


mongoose.connect('mongodb+srv://amanp114:UUr2tBfuGeTjHJxC@cluster0.tjlmotu.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// In-memory storage for connected users (for simplicity)
let connectedUsers = {};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  // Handle user login and save the user to connectedUsers
  socket.on('user_login', async (userId) => {
    const user = await User.findById(userId);
    if (user) {
      connectedUsers[userId] = socket.id; // Map userId to socket.id
      console.log(`${user.username} is online`);
      io.emit('user_online', { userId, username: user.username }); // Notify all users that this user is online
    }
  });

  // Handle incoming messages
  socket.on('message', ({ senderId, receiverId, message }) => {
    console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
    const receiverSocketId = connectedUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('message', {
        senderId,
        message,
      });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const userId = Object.keys(connectedUsers).find(key => connectedUsers[key] === socket.id);
    if (userId) {
      delete connectedUsers[userId];
      io.emit('user_offline', userId);
      console.log('A user disconnected', socket.id);
    }
  });
});

// API endpoint to fetch all logged-in users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
