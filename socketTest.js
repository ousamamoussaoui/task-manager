import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("task:created", (task) => {
  console.log("Task created:", task.title);
});

socket.on("task:updated", (task) => {
  console.log("Task updated:", task.title);
});

socket.on("task:deleted", (taskId) => {
  console.log("Task deleted:", taskId);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
