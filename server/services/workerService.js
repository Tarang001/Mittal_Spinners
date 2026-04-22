import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/errors.js";

const mapWorker = (worker) => ({
  id: worker.id,
  name: worker.name,
  role: worker.role,
  phone: worker.workerCode,
  workerCode: worker.workerCode,
  email: worker.email,
  joiningDate: worker.joiningDate,
});

export async function listWorkers() {
  const workers = await prisma.worker.findMany({ orderBy: { createdAt: "desc" } });
  return workers.map(mapWorker);
}

export async function createWorker({ name, role, phone, workerCode, email, password, joiningDate }) {
  const normalizedRole = String(role || "SPINNER").trim().toUpperCase();
  const code = String(workerCode || phone || "").trim() || `WK-${Date.now()}`;
  const normalizedEmail = email ? String(email).trim().toLowerCase() : null;

  if (normalizedRole === "SUPERVISOR") {
    if (!normalizedEmail || !password || String(password).length < 6) {
      throw new AppError("Supervisor requires email and password (min 6).", 400);
    }
  }

  const worker = await prisma.$transaction(async (tx) => {
    if (normalizedRole === "SUPERVISOR" && normalizedEmail) {
      const existingUser = await tx.user.findUnique({ where: { email: normalizedEmail } });
      if (existingUser) throw new AppError("Supervisor account already exists.", 409);

      const hashed = await bcrypt.hash(String(password), 10);
      await tx.user.create({
        data: { name: String(name).trim(), email: normalizedEmail, password: hashed, role: "SUPERVISOR" },
      });
    }

    return tx.worker.create({
      data: {
        name: String(name).trim(),
        role: normalizedRole,
        workerCode: code,
        email: normalizedEmail,
        joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      },
    });
  });

  return mapWorker(worker);
}

export async function updateWorker(id, { name, role, phone, workerCode, email, joiningDate }) {
  const code = workerCode || phone;
  const normalizedRole = role ? String(role).trim().toUpperCase() : null;

  const worker = await prisma.worker.update({
    where: { id },
    data: {
      ...(name ? { name: String(name).trim() } : {}),
      ...(normalizedRole ? { role: normalizedRole } : {}),
      ...(code ? { workerCode: String(code).trim() } : {}),
      ...(email !== undefined ? { email: email ? String(email).trim().toLowerCase() : null } : {}),
      ...(joiningDate ? { joiningDate: new Date(joiningDate) } : {}),
    },
  });

  return mapWorker(worker);
}

export async function deleteWorker(id) {
  await prisma.worker.delete({ where: { id } });
  return true;
}
