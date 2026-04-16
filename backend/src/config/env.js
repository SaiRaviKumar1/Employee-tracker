import dotenv from 'dotenv';

dotenv.config();

function toNumber(value, fallbackValue) {
  if (value === undefined) {
    return fallbackValue;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallbackValue : parsed;
}

// 🔥 Modified: No strict env requirement
function getRequiredEnv(name) {
  return process.env[name] || "dummy";
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toNumber(process.env.PORT, 5000),

  // 🔥 Modified: No MongoDB crash
  mongoUri: process.env.MONGODB_URI || "dummy",

  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  rateLimitWindowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMaxRequests: toNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 200),
};