import "dotenv/config";

const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "EMAIL_USER", "EMAIL_PASS"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  PORT: Number(process.env.PORT || 5000),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};
