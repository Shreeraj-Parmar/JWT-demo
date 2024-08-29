import mongoose from "mongoose";

import express from "express";

import cookieParser from "cookie-parser";

import cors from "cors";

import {
  signup,
  login,
  sendAllMessage,
  getMessage,
  refreshToken,
  logout,
} from "./controllers/auth-controller.js";

import authMiddle from "./middleware/jwt.js";

const app = express();

app.use(cookieParser());

// Middleware
app.use(cors());
app.use(express.json());

// Routes (placeholder)
app.get("/", (req, res) => {
  res.send("Weeby Community API");
});

// Signup route
app.post("/signup", signup);

// Login route
app.post("/login", login);
app.post("/message/get", authMiddle, sendAllMessage);
app.post("/message", authMiddle, getMessage);
app.post("/refresh-token", authMiddle, refreshToken);
app.post("/logout", authMiddle, logout);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/AuthLearn")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
