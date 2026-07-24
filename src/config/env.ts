import dotenv from 'dotenv';

dotenv.config();

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: string | number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  SALT_ROUNDS: number;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  RAZORPAY_API_KEY?: string;
  RAZORPAY_API_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
  STRIPE_API_KEY?: string;
  STRIPE_API_SECRET?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_SECRET?: string;
  PAYPAL_WEBHOOK_SECRET?: string;
  CASHFREE_API_KEY?: string;
  CASHFREE_API_SECRET?: string;
  CASHFREE_WEBHOOK_SECRET?: string;
  PHONEPE_API_KEY?: string;
  PHONEPE_API_SECRET?: string;
  PHONEPE_WEBHOOK_SECRET?: string;
  PAYTM_API_KEY?: string;
  PAYTM_API_SECRET?: string;
  PAYTM_WEBHOOK_SECRET?: string;
  LOG_LEVEL: string;
  CORS_ORIGIN?: string;
}

const required = [
  'NODE_ENV',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'REFRESH_TOKEN_SECRET',
  'REFRESH_TOKEN_EXPIRES_IN',
  'SALT_ROUNDS'
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// PORT can be a normal numeric string (local/dev/most hosts) OR a named pipe
// path like \\.\pipe\xxxxxxxx-xxxx-... (IIS/iisnode on Windows/Plesk).
// Number("\\.\pipe\...") is NaN, so we only coerce to a number when it's
// actually numeric; otherwise we pass the raw string straight to
// http.Server.listen(), which accepts both a port number and a pipe path.
function resolvePort(): string | number {
  const raw = process.env.PORT;
  if (!raw) return 4000;
  const asNumber = Number(raw);
  return isNaN(asNumber) ? raw : asNumber;
}

const config: EnvConfig = {
  NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
  PORT: resolvePort(),
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
  RAZORPAY_API_SECRET: process.env.RAZORPAY_API_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  STRIPE_API_KEY: process.env.STRIPE_API_KEY,
  STRIPE_API_SECRET: process.env.STRIPE_API_SECRET,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_SECRET: process.env.PAYPAL_SECRET,
  PAYPAL_WEBHOOK_SECRET: process.env.PAYPAL_WEBHOOK_SECRET,
  CASHFREE_API_KEY: process.env.CASHFREE_API_KEY,
  CASHFREE_API_SECRET: process.env.CASHFREE_API_SECRET,
  CASHFREE_WEBHOOK_SECRET: process.env.CASHFREE_WEBHOOK_SECRET,
  PHONEPE_API_KEY: process.env.PHONEPE_API_KEY,
  PHONEPE_API_SECRET: process.env.PHONEPE_API_SECRET,
  PHONEPE_WEBHOOK_SECRET: process.env.PHONEPE_WEBHOOK_SECRET,
  PAYTM_API_KEY: process.env.PAYTM_API_KEY,
  PAYTM_API_SECRET: process.env.PAYTM_API_SECRET,
  PAYTM_WEBHOOK_SECRET: process.env.PAYTM_WEBHOOK_SECRET,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  CORS_ORIGIN: process.env.CORS_ORIGIN
};

export default config;