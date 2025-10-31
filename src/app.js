import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

// Error handling
app.use(routeNotFound);
app.use(errorHandler);

export default app; 
