import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { ErrorResponse } from "../utils/errorResponse.js";

/**
 * @desc    Get logged-in user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) throw new ErrorResponse("User not found", 404);

  res.status(200).json(user);
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ErrorResponse("User not found", 404);

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  res.status(200).json({
    id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

/**
 * @desc Delete own account
 * @route DELETE /api/users/delete
 * @access Private
 */
export const deleteMyAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ErrorResponse("User not found", 404);

  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "Your account has been deleted successfully",
  });
});

/**
 * @desc    Update user role (Admin only)
 * @route   PATCH /api/users/:id
 * @access  Private/Admin
 */
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  if (req.user.role !== "admin") {
    throw new ErrorResponse("Not authorized to update roles", 403);
  }

  const allowedRoles = ["user", "admin"];
  if (!allowedRoles.includes(role)) {
    throw new ErrorResponse(
      "Invalid role. Admin can only assign roles 'user' or 'admin'.",
      400
    );
  }

  const user = await User.findById(userId);
  if (!user) throw new ErrorResponse("User not found", 404);

  if (user._id.toString() === req.user._id.toString()) {
    throw new ErrorResponse("You cannot change your own role", 400);
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @desc Admin delete any user by ID
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) throw new ErrorResponse("User not found", 404);

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: `User ${user.username} deleted successfully by admin`,
  });
});

/**
 * @desc    Update user password
 * @route   PUT /api/users/update-password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (currentPassword === newPassword) {
    throw new ErrorResponse(
      "New password cannot be the same as the current password",
      400
    );
  }
  if (!currentPassword || !newPassword)
    throw new ErrorResponse("All fields are required", 400);

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new ErrorResponse("Current password is incorrect", 400);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
