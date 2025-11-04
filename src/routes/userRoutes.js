import express from "express";
import {
  getProfile,
  updateProfile,
  getUsers,
  deleteMyAccount,
  deleteUserByAdmin,
  updatePassword,
  updateUserByAdmin,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// user routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/delete", protect, deleteMyAccount);
router.put("/update-password", protect, updatePassword);


// Admin routes
router.get("/", protect, isAdmin, getUsers);
router.patch("/:id", protect, isAdmin, updateUserByAdmin);
router.delete("/:id", protect, isAdmin, deleteUserByAdmin);

export default router;
