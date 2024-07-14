// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors"; // Import the cors package
// import userRoutes from "./routes/user.js";
// import postRoutes from "./routes/post.js";
// import cookieParser from "cookie-parser";
// dotenv.config();
// const app = express();
// const port = 8080;

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Use CORS middleware with modified options
// app.use(cors({


// }));

// // Route for user-related operations
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







import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import the cors package
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(express.json({ limit: '50mb' })); // Adjust the limit as per your needs

// Use CORS middleware with modified options
app.use(cors({
  origin: '*', // Update with your allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Add allowed headers
  exposedHeaders: ['Content-Type', 'Authorization'], // Expose headers to the client
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Route for user-related operations
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
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});
