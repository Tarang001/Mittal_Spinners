import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/errors.js";

function signToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function ensureDefaultAdminUser() {
  const email = "admin@mittelspinners.com";
  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", name: "Admin" },
    create: { name: "Admin", email, password: hashed, role: "ADMIN" },
  });
}

export async function registerUser({ name, email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedName = String(name || normalizedEmail.split("@")[0] || "User").trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) throw new AppError("User already exists.", 409);

  const hashed = await bcrypt.hash(String(password), 10);
  const user = await prisma.user.create({
    data: { name: normalizedName, email: normalizedEmail, password: hashed, role: "SUPERVISOR" },
  });

  return {
    token: signToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) throw new AppError("Invalid credentials.", 401);

  const ok = await bcrypt.compare(String(password), user.password);
  if (!ok) throw new AppError("Invalid credentials.", 401);

  return {
    token: signToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function createSupervisor({ name, email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) throw new AppError("User already exists.", 409);

  const hashed = await bcrypt.hash(String(password), 10);
  const supervisor = await prisma.user.create({
    data: { name: String(name).trim(), email: normalizedEmail, password: hashed, role: "SUPERVISOR" },
  });

  return { id: supervisor.id, name: supervisor.name, email: supervisor.email, role: supervisor.role };
}
