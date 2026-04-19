import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function validateRegisterPayload(body = {}) {
  const details = [];
  const payload = {
    name: body.name?.trim(),
    email: body.email?.trim().toLowerCase(),
    password: body.password,
  };

  if (!payload.name) details.push('Name is required.');
  if (!payload.email) details.push('Email is required.');
  if (!payload.password) details.push('Password is required.');

  if (payload.email && !/^\S+@\S+\.\S+$/.test(payload.email)) {
    details.push('Please provide a valid email address.');
  }

  if (payload.password && payload.password.length < 6) {
    details.push('Password must be at least 6 characters long.');
  }

  return { payload, details };
}

function validateLoginPayload(body = {}) {
  const details = [];
  const payload = {
    email: body.email?.trim().toLowerCase(),
    password: body.password,
  };

  if (!payload.email) details.push('Email is required.');
  if (!payload.password) details.push('Password is required.');

  if (payload.email && !/^\S+@\S+\.\S+$/.test(payload.email)) {
    details.push('Please provide a valid email address.');
  }

  return { payload, details };
}

async function ensureDatabaseConnection() {
  const { mongoUri } = env;

  if (!mongoUri || mongoUri === 'dummy') {
    throw new ApiError(500, 'MONGODB_URI is not configured for authentication.');
  }

  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  await mongoose.connect(mongoUri);
}

function createToken(userId) {
  const { jwtSecret, jwtExpiresIn } = env;

  if (!jwtSecret) {
    throw new ApiError(500, 'JWT_SECRET is not configured.');
  }

  return jwt.sign({ userId }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
}

export const registerUser = asyncHandler(async (request, response) => {
  await ensureDatabaseConnection();

  const { payload, details } = validateRegisterPayload(request.body);

  if (details.length > 0) {
    throw new ApiError(400, 'Please review the registration details.', details);
  }

  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(409, 'A user with that email already exists.', [
      'Email addresses must be unique.',
    ]);
  }

  const user = await User.create(payload);

  response.status(201).json({
    message: 'Account created successfully. Please sign in.',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const loginUser = asyncHandler(async (request, response) => {
  await ensureDatabaseConnection();

  const { payload, details } = validateLoginPayload(request.body);

  if (details.length > 0) {
    throw new ApiError(400, 'Please review your login details.', details);
  }

  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user || !(await user.comparePassword(payload.password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = createToken(user._id);

  response.status(200).json({
    message: 'Login successful.',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});
