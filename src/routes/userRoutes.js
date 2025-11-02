import express from "express";
import {
  getProfile,
  updateProfile,
  getUsers,
  deleteMyAccount,
  deleteUserByAdmin,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// user routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/delete", protect, deleteMyAccount);


// Admin routes
router.get("/", protect, isAdmin, getUsers);
router.delete("/:id", protect, isAdmin, deleteUserByAdmin);

export default router;
