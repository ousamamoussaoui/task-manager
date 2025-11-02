import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { isLoggedIn, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",isLoggedIn, register);
router.post("/login",isLoggedIn, login);
router.post("/logout", protect, logout);


export default router;
