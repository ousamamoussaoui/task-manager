import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.set("strictQuery", false);

// HTTP & WebSocket Server Setup
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
});


export { io };

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to MongoDB");

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔻 MongoDB connection closed. Server shutting down.");
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();
