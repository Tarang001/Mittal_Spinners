const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length && process.env.NODE_ENV === "production") {
  throw new Error(`Missing env variables: ${missing.join(", ")}`);
} else if (missing.length) {
  console.warn("Missing env variables:", missing);
}

export const env = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  DATABASE_ENABLED: Boolean(process.env.DATABASE_URL),
  JWT_SECRET: process.env.JWT_SECRET || "dev-jwt-secret",
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
};
