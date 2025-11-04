export class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;

    // Ensures proper stack trace (especially useful in async functions)
    Error.captureStackTrace(this, this.constructor);
  }
}
