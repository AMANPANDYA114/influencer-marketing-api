import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import the cors package
import userRoutes from "./routes/user.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware with modified options
app.use(cors({
  origin: "http://localhost:3000", // Update with your frontend URL during development
  methods: ["GET", "POST", "PUT", "DELETE"], // Add the HTTP methods you need
  allowedHeaders: ["Content-Type", "Authorization"], // Add headers you want to allow
}));

// Route for user-related operations
app.use(cookieParser());
app.use('/api/user', userRoutes);

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
