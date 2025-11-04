# Task Manager API

**A RESTful Node.js/Express API with JWT authentication, role-based access control, and real-time task management capabilities.**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [WebSocket Real-time Events](#websocket-real-time-events)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Architecture & Design Choices](#architecture--design-choices)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This Task Manager API is a complete backend solution for managing users and tasks with advanced features including:

- **JWT-based authentication** with HttpOnly cookies and Bearer token support
- **Role-based access control** (Admin/User) with granular permissions
- **Complete CRUD operations** for users and tasks
- **Real-time updates** via WebSocket (Socket.io) for task events
- **Advanced filtering, sorting, and pagination** for task queries
- **Team collaboration** with task assignment and team member management
- **Comprehensive error handling** with meaningful HTTP status codes

Built to demonstrate proficiency in Node.js, Express, MongoDB, and modern API design patterns.

---

## Features

### 🔐 Authentication & Authorization
- User registration with email validation
- Secure login with JWT token generation
- Password hashing using bcrypt (salt rounds: 10)
- HttpOnly cookie support for enhanced security
- Bearer token authentication via Authorization header
- Role-based access control (Admin/User)
- Password update functionality with current password verification
- Automatic logout with cookie clearing

### 👥 User Management
- **User Profile Operations:**
  - Get current user profile
  - Update profile information (username, email)
  - Delete own account
  - Update password with validation

- **Admin Operations:**
  - List all users (Admin only)
  - Update user roles (Admin only)
  - Delete any user by ID (Admin only)

### ✅ Task Management
- **CRUD Operations:**
  - Create tasks with title, description, priority, due date
  - Read tasks with advanced filtering and pagination
  - Update tasks (owner, team members, or admin)
  - Delete tasks (owner, team members, or admin)

- **Advanced Features:**
  - Filter by priority (low, medium, high)
  - Filter by completion status
  - Search tasks by title (case-insensitive)
  - Sort by: newest, oldest, priority, due date
  - Pagination support (page, limit)
  - Team assignment (multiple team members per task)
  - Ownership verification before modifications

### ⚡ Real-time Capabilities
- WebSocket integration via Socket.io
- Real-time task creation notifications
- Real-time task update notifications
- Real-time task deletion notifications
- Automatic connection management

---

## Technology Stack

### Core Framework
- **Node.js** (v18+)
- **Express.js** (v5.1.0) - Web application framework

### Database
- **MongoDB** - NoSQL database
- **Mongoose** (v8.19.2) - ODM for MongoDB

### Authentication & Security
- **jsonwebtoken** (v9.0.2) - JWT token generation and verification
- **bcrypt** (v6.0.0) - Password hashing
- **cookie-parser** (v1.4.7) - Cookie parsing middleware
- **helmet** (v8.1.0) - Security headers middleware
- **cors** (v2.8.5) - Cross-Origin Resource Sharing

### Real-time Communication
- **socket.io** (v4.8.1) - WebSocket library for real-time events

### Development Tools
- **nodemon** (v3.1.10) - Development server with auto-reload
- **express-async-handler** (v1.2.0) - Async error handling wrapper
- **dotenv** (v17.2.3) - Environment variable management

---

## Prerequisites

Before installing and running this project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas connection string)
- **Git** (for cloning the repository)

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager-api
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies listed in `package.json`.

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/task-manager
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

**Important Security Notes:**
- Generate a strong `JWT_SECRET` using a random string generator (minimum 32 characters)
- Never commit the `.env` file to version control
- Use different secrets for development and production environments
- For production, use environment variables provided by your hosting platform

---

## Running the Application

### Development Mode

```bash
npm run dev
```

This starts the server with **nodemon**, which automatically restarts the server when code changes are detected.

### Production Mode

```bash
npm start
```

This starts the server using Node.js directly.

### Server Output

Upon successful startup, you should see:

```
Successfully connected to MongoDB
Server running on port 5000
```

The API will be available at `http://localhost:5000`

---

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected routes require authentication via one of the following methods:

1. **HttpOnly Cookie** (automatically set on login/register)
2. **Bearer Token** in Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

---

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"  // Optional: defaults to "user"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Note:** Sets HttpOnly `jwt` cookie automatically.

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Note:** Sets HttpOnly `jwt` cookie automatically.

---

#### Logout
```http
POST /api/auth/logout
```

**Authentication:** Required (Protected Route)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note:** Clears the `jwt` cookie.

---

### User Endpoints

#### Get My Profile
```http
GET /api/users/profile
```

**Authentication:** Required (Protected Route)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### Update My Profile
```http
PUT /api/users/profile
Content-Type: application/json

{
  "username": "john_updated",
  "email": "john.new@example.com"
}
```

**Authentication:** Required (Protected Route)

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "john_updated",
  "email": "john.new@example.com",
  "role": "user"
}
```

---

#### Update Password
```http
PUT /api/users/update-password
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Authentication:** Required (Protected Route)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Cases:**
- `400`: Current password incorrect
- `400`: New password same as current password

---

#### Delete My Account
```http
DELETE /api/users/delete
```

**Authentication:** Required (Protected Route)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Your account has been deleted successfully"
}
```

---

#### Get All Users (Admin Only)
```http
GET /api/users
```

**Authentication:** Required (Admin Only)

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "admin_user",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2024-01-14T09:20:00.000Z"
  }
]
```

---

#### Update User Role (Admin Only)
```http
PATCH /api/users/:id
Content-Type: application/json

{
  "role": "admin"
}
```

**Authentication:** Required (Admin Only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User role updated to admin",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

#### Delete User by ID (Admin Only)
```http
DELETE /api/users/:id
```

**Authentication:** Required (Admin Only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User john_doe deleted successfully by admin"
}
```

---

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks?priority=high&completed=false&search=report&sort=newest&page=1&limit=10&userId=507f1f77bcf86cd799439011
```

**Authentication:** Required (Protected Route)

**Query Parameters:**
- `priority` (optional): Filter by priority - `low`, `medium`, `high`
- `completed` (optional): Filter by completion - `true` or `false`
- `search` (optional): Search tasks by title (case-insensitive)
- `sort` (optional): Sort order - `newest`, `oldest`, `priority`, `dueDate`
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)
- `userId` (optional): Filter by user ID (Admin only)

**Notes:**
- Regular users see only their own tasks
- Admins see all tasks by default, or filtered by `userId`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "page": 1,
  "pages": 3,
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "title": "Complete project report",
      "description": "Q4 metrics and analysis",
      "completed": false,
      "priority": "high",
      "dueDate": "2024-12-31T00:00:00.000Z",
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com",
        "role": "user"
      },
      "team": [
        {
          "_id": "507f1f77bcf86cd799439012",
          "username": "jane_smith",
          "email": "jane@example.com"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### Get Task by ID
```http
GET /api/tasks/:id
```

**Authentication:** Required (Protected Route)

**Access Control:**
- Task owner
- Team members
- Admin users

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "Complete project report",
    "description": "Q4 metrics and analysis",
    "completed": false,
    "priority": "high",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "team": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "username": "jane_smith",
        "email": "jane@example.com"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project report",
  "description": "Q4 metrics and analysis",
  "priority": "high",
  "dueDate": "2024-12-31",
  "team": ["507f1f77bcf86cd799439012"]
}
```

**Authentication:** Required (Protected Route)

**Required Fields:**
- `title` (string)

**Optional Fields:**
- `description` (string)
- `priority` (string): `low`, `medium`, `high` (default: `medium`)
- `dueDate` (ISO date string)
- `team` (array of user IDs)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "Complete project report",
    "description": "Q4 metrics and analysis",
    "completed": false,
    "priority": "high",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "user": "507f1f77bcf86cd799439011",
    "team": ["507f1f77bcf86cd799439012"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Note:** Emits `task:created` WebSocket event.

---

#### Update Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Complete project report (updated)",
  "completed": true,
  "priority": "medium"
}
```

**Authentication:** Required (Protected Route)

**Access Control:**
- Task owner
- Team members
- Admin users

**Protected Fields (cannot be modified):**
- `user` (task owner)
- `_id`
- `createdAt`
- `updatedAt`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "Complete project report (updated)",
    "description": "Q4 metrics and analysis",
    "completed": true,
    "priority": "medium",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "user": "507f1f77bcf86cd799439011",
    "team": ["507f1f77bcf86cd799439012"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Note:** Emits `task:updated` WebSocket event.

---

#### Delete Task
```http
DELETE /api/tasks/:id
```

**Authentication:** Required (Protected Route)

**Access Control:**
- Task owner
- Team members
- Admin users

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Note:** Emits `task:deleted` WebSocket event with task ID.

---

### HTTP Status Codes

The API uses standard HTTP status codes:

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data or validation error
- `401 Unauthorized` - Authentication required or invalid token
- `403 Forbidden` - Insufficient permissions (e.g., not admin)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

### Postman Collection

A Postman collection is available for testing all endpoints:

1. Import `TaskManagerAPI.postman_collection.json` into Postman
2. Set the `{{baseUrl}}` variable to `http://localhost:5000`
3. Login/Register endpoints automatically set the `jwt` cookie
4. Subsequent requests will include the cookie automatically

---

## WebSocket Real-time Events

The API includes WebSocket support via Socket.io for real-time task updates.

### Connection

Connect to the WebSocket server:

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});
```

### Events Emitted by Server

#### Task Created
```javascript
socket.on("task:created", (task) => {
  console.log("New task created:", task);
  // task object contains full task data
});
```

#### Task Updated
```javascript
socket.on("task:updated", (task) => {
  console.log("Task updated:", task);
  // task object contains updated task data
});
```

#### Task Deleted
```javascript
socket.on("task:deleted", (taskId) => {
  console.log("Task deleted:", taskId);
  // taskId is the deleted task's ID
});
```

### Testing WebSocket

Use the provided test file:

```bash
npm run ws
```

This runs `socketTest.js` which connects and listens to all task events.

---

## Project Structure

```
task-manager-api/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middlewares/          # Custom middleware
│   │   ├── authMiddleware.js  # JWT verification, role checks
│   │   └── errorMiddleware.js # Error handling
│   ├── models/               # Mongoose schemas
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/               # Route definitions
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   └── utils/                # Utility functions
│       ├── errorResponse.js   # Custom error class
│       └── generateToken.js   # JWT token generator
├── server.js                 # Server entry point & Socket.io setup
├── socketTest.js            # WebSocket testing client
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables (not in repo)
└── README.md                # This file
```

### Architecture Pattern

The project follows a **layered architecture**:

1. **Routes Layer** - Define endpoints and apply middleware
2. **Middleware Layer** - Authentication, authorization, error handling
3. **Controller Layer** - Business logic and request processing
4. **Model Layer** - Database schemas and data access
5. **Utility Layer** - Helper functions and shared utilities

---

## Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication with 7-day expiration
- **HttpOnly Cookies**: Prevents XSS attacks by preventing JavaScript access
- **Password Hashing**: bcrypt with salt rounds (10) - one-way hashing
- **Token Verification**: Automatic token validation on protected routes

### Authorization Security
- **Role-Based Access Control**: Admin and User roles with granular permissions
- **Resource Ownership**: Users can only modify their own resources (unless admin)
- **Team Member Authorization**: Team members can access assigned tasks
- **Admin Privileges**: Admins can access all resources

### Application Security
- **Helmet.js**: Sets security HTTP headers (XSS protection, content type sniffing, etc.)
- **CORS**: Configurable Cross-Origin Resource Sharing with credentials support
- **Input Validation**: Mongoose schema validation and manual checks
- **Error Sanitization**: Error messages don't expose sensitive information in production

### Best Practices Implemented
- Environment variables for sensitive data
- No password in API responses
- Protected routes require authentication
- Secure cookie settings (HttpOnly, Secure in production, SameSite)
- No SQL injection risk (MongoDB with Mongoose)

---

## Error Handling

The API implements comprehensive error handling:

### Error Response Format

```json
{
  "success": false,
  "message": "Error message description",
  "stack": "Error stack trace (only in development)"
}
```

### Error Types Handled

1. **Validation Errors** (400)
   - Missing required fields
   - Invalid data types
   - Mongoose schema validation failures

2. **Authentication Errors** (401)
   - Missing or invalid JWT token
   - Expired token
   - User not found

3. **Authorization Errors** (403)
   - Insufficient permissions
   - Not authorized to access resource
   - Not admin for admin-only routes

4. **Not Found Errors** (404)
   - Resource doesn't exist
   - Invalid route
   - Invalid ObjectId format

5. **Duplicate Errors** (400)
   - Email already registered
   - Unique constraint violations

6. **Server Errors** (500)
   - Unexpected errors
   - Database connection issues

### Custom Error Class

The API uses a custom `ErrorResponse` class for consistent error handling:

```javascript
throw new ErrorResponse("User not found", 404);
```

---

## Architecture & Design Choices

### 1. Separation of Concerns
- **Controllers**: Handle request/response logic
- **Routes**: Define API endpoints and middleware chain
- **Models**: Define data structure and validation
- **Middlewares**: Reusable authentication and error handling logic
- **Utils**: Shared helper functions

### 2. Async Error Handling
- Uses `express-async-handler` to automatically catch async errors
- Eliminates need for try-catch blocks in controllers
- Errors automatically passed to error middleware

### 3. Database Design
- **MongoDB**: Chosen for flexibility with nested documents (team arrays)
- **Mongoose ODM**: Provides schema validation, middleware hooks, and type safety
- **References**: User references in tasks for population and validation
- **Indexes**: Automatic indexes on unique fields (email)

### 4. Real-time Implementation
- **Socket.io**: Chosen for WebSocket support with fallback to HTTP long-polling
- **Global Events**: Currently broadcasts to all connected clients
- **Future Enhancement**: Room-based targeting for specific users/teams

### 5. Security Design
- **JWT Strategy**: Stateless authentication suitable for distributed systems
- **Cookie + Bearer Token**: Dual support for web and mobile clients
- **Password Hashing**: Pre-save hook ensures passwords always hashed
- **Role Enum**: Prevents invalid role assignments

### 6. Code Organization
- **ES6 Modules**: Modern import/export syntax
- **Consistent Naming**: camelCase for functions, PascalCase for classes
- **JSDoc Comments**: Documentation in code for all endpoints
- **Environment Configuration**: All configurable values in `.env`

---

## Testing

### Manual Testing

1. **Postman Collection**: Import and test all endpoints
2. **WebSocket Test**: Run `npm run ws` to test real-time events
3. **cURL Commands**: Test endpoints from command line

### Example cURL Commands

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

**Create Task (with cookie):**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Test Task","priority":"high"}'
```

### Future Testing Improvements
- Unit tests with Jest
- Integration tests with Supertest
- WebSocket connection tests
- Load testing with Artillery

---

## Contributing

This is a technical test project. For improvements or contributions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

**Oussama Moussaoui**

Full-stack Node.js Developer

---

## Acknowledgments

- Express.js community for excellent documentation
- MongoDB and Mongoose for robust database solutions
- Socket.io for real-time communication capabilities
- All open-source contributors whose packages made this project possible

---

**Built with ❤️ for the technical test evaluation**
