// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import userRoutes from "./routes/user.js";
// import postRoutes from "./routes/post.js";
// import cookieParser from "cookie-parser";

// dotenv.config();
// const app = express();
// const port = 8080;


// app.use(express.json());

// app.use(cookieParser());
// app.use('/api/user', userRoutes);



// app.use('/api/userpost',postRoutes);
// // Connect to MongoDB using Mongoose
// mongoose.connect(process.env.MONGO_DB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("Connected to MongoDB");
//   // Start the server after successful database connection
//   app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
//   });
// }).catch((err) => {
//   console.error("Error connecting to MongoDB:", err);
// });



// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import userRoutes from "./routes/user.js";
// import postRoutes from "./routes/post.js";
// import cookieParser from "cookie-parser";

// dotenv.config();
// const app = express();
// const port = 8000;

// const TIMEOUT = 10 * 60 * 1000; // 10 minutes

// server.setTimeout(TIMEOUT);
// // Use CORS to allow all methods and origins, especially for localhost:3000
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// app.use(express.json());
// app.use(cookieParser());

// // Define routes
// app.use('/api/user', userRoutes);
// app.use('/api/userpost', postRoutes);

// // Connect to MongoDB using Mongoose
// mongoose.connect(process.env.MONGO_DB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("Connected to MongoDB");
//   // Start the server after successful database connection
//   app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
//   });
// }).catch((err) => {
//   console.error("Error connecting to MongoDB:", err);
// });






import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import cookieParser from "cookie-parser";
import http from "http";

dotenv.config();
const app = express();
const port = 8000;

// Create the HTTP server
const server = http.createServer(app);

const TIMEOUT = 10 * 60 * 1000; // 10 minutes
server.setTimeout(TIMEOUT);

// Use CORS to allow all methods and origins, especially for localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Define routes
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
