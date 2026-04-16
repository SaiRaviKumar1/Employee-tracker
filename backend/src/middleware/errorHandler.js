import { ApiError } from '../utils/ApiError.js';

export function errorHandler(error, _request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  let statusCode = error instanceof ApiError ? error.statusCode : 500;
  let message = error.message || 'Something went wrong.';
  let details = error instanceof ApiError ? error.details : [];

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed.';
    details = Object.values(error.errors).map((validationError) => validationError.message);
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'An employee with that email already exists.';
    details = ['Email addresses must be unique.'];
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'The requested resource identifier is invalid.';
    details = [];
  }

  if (error.message === 'Origin not allowed by CORS') {
    statusCode = 403;
    message = error.message;
    details = [];
  }

  response.status(statusCode).json({
    message,
    details,
    ...(statusCode === 500 && process.env.NODE_ENV !== 'production'
      ? { stack: error.stack }
      : {}),
  });
}
