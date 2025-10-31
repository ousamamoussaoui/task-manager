import app from "./src/app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/testdb";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB:", err.message));

app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
