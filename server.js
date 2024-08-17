import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import postRoutes from "./routes/post.js";
import userRoutes from "./routes/user.js";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();
const app = express();
const port = 8080;

// Create an HTTP server
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('message', 'Hello from the server');

  socket.on('message', (msg) => {
    console.log('Message received:', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use(express.json());
app.use(cookieParser());
app.use('/api/user', userRoutes);
app.use('/api/userpost', postRoutes);

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");

  // Start the server after successful database connection
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});
