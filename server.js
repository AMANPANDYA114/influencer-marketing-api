import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import postRoutes from "./routes/post.js";
import userRoutes from "./routes/user.js";


import http from 'http'; 
import { Server as SocketIOServer } from 'socket.io';



const server = http.createServer(); 
const io = new SocketIOServer(server);


io.on('connection', (socket) => {
  console.log('A user connected');

  
  socket.emit('message', 'Hello fromsx the server');

  
  socket.on('message', (msg) => {
    console.log('Message received:', msg);
  });

  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
dotenv.config();
const app = express();
const port = 8080;


app.use(express.json());

app.use(cookieParser());
app.use('/api/user', userRoutes);



app.use('/api/userpost',postRoutes);

mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
 
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});