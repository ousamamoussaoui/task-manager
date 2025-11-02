import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

/**
 * @desc   Protect routes - only logged in users
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id)
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ErrorResponse("Token expired, please log in again", 401);
    }
    throw new ErrorResponse("Not authorized, token invalid", 401);
  }
});

/**
 * @desc   Admin-only access
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as admin");
  }
};

export const isLoggedIn = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (token) {
    return res.status(400).json({
      message: "You are already logged in",
    });
  }
  next();
};
