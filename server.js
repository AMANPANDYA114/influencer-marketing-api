import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const port = 8080;


app.use(express.json());

app.use(cookieParser());
app.use('/api/user', userRoutes);

app.use('/api/userpost',postRoutes);
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



