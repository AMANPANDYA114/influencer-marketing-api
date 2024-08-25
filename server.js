import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import postRoutes from './routes/post.js';
import userRoutes from './routes/user.js';


dotenv.config();


const app = express();


app.use(cors({
  origin: ['192.168.0.103:8081', 'http://192.168.0.103:8081'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(cookieParser());
app.use('/api/user', userRoutes);
app.use('/api/userpost', postRoutes);


const server = http.createServer(app);

mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

 
    const port = 8080;
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });

  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
