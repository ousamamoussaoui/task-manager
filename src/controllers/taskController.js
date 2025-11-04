import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { io } from "../../server.js";

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Private (user → own tasks, admin → all tasks)
 */
export const getTasks = asyncHandler(async (req, res) => {
  const { priority, completed, search, sort, page = 1, limit = 10, userId } = req.query;

  let query = {};

  if (req.user.role !== "admin") {
    query.user = req.user._id;
  } else if (userId) {
    query.user = userId;
  }

  if (priority) query.priority = priority;
  if (completed !== undefined) query.completed = completed === "true";
  if (search) query.title = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);

  let sortOption = { createdAt: -1 };
  if (sort === "oldest") sortOption = { createdAt: 1 };
  if (sort === "priority") sortOption = { priority: -1 };
  if (sort === "dueDate") sortOption = { dueDate: 1 };

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate("user", "username email role")
      .populate("team", "username email")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit)),
    Task.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    tasks,
  });
});

/**
 * @desc    Get a specific task by ID
 * @route   GET /api/tasks/:id
 * @access  Private (Owner, Team Member, or Admin)
 */
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("user", "username email")
    .populate("team", "username email");

  if (!task) throw new ErrorResponse("Task not found", 404);

  const isOwner = task.user._id.equals(req.user._id);
  const isTeamMember = task.team.some((memberId) => memberId.equals(req.user._id));
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isTeamMember && !isAdmin)
    throw new ErrorResponse("Not authorized to view this task", 403);

  res.status(200).json({ success: true, data: task });
});

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private (Authenticated users)
 */
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, team } = req.body;
  if (!title) throw new ErrorResponse("Task title is required", 400);

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    user: req.user._id,
    team,
  });

  io.emit("task:created", task);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Private (Owner, Team Member, or Admin)
 */
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ErrorResponse("Task not found", 404);

  const isOwner = task.user.equals(req.user._id);
  const isTeamMember = task.team.some((member) => member.equals(req.user._id));
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isTeamMember && !isAdmin)
    throw new ErrorResponse("Not authorized to update this task", 403);

  // Prevent modification of protected fields
  ["user", "_id", "createdAt", "updatedAt"].forEach((field) => delete req.body[field]);

  Object.assign(task, req.body);
  const updatedTask = await task.save();

  // Emit real-time update event
  io.emit("task:updated", updatedTask);

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask,
  });
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private (Owner, Team Member, or Admin)
 */
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ErrorResponse("Task not found", 404);

  const isOwner = task.user.equals(req.user._id);
  const isTeamMember = task.team.some((member) => member.equals(req.user._id));
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isTeamMember && !isAdmin)
    throw new ErrorResponse("Not authorized to delete this task", 403);

  await task.deleteOne();

  // Emit real-time delete event
  io.emit("task:deleted", req.params.id);

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});
