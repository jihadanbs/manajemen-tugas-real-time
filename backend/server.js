const express = require("express");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Models
const User = require("./models/User");
const Task = require("./models/Task");

// Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Socket.IO for real-time updates
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("taskUpdated", (task) => {
    socket.broadcast.emit("taskUpdated", task); // Broadcast task update to all other users
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
