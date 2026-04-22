import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/errors.js";

export async function listInventory() {
  return prisma.inventoryItem.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createInventoryItem({ name, sku, quantity, userEmail }) {
  const normalizedName = String(name).trim();
  const qty = Number(quantity || 0);
  const generatedSku =
    String(sku || "").trim() ||
    `${normalizedName.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}-${Date.now()}`;

  const created = await prisma.inventoryItem.create({
    data: { name: normalizedName, sku: generatedSku, quantity: qty },
  });

  await prisma.inventoryLog.create({
    data: { itemId: created.id, change: qty, type: "CREATE", updatedBy: userEmail },
  });

  return created;
}

export async function updateInventoryItem(id, { name, sku, quantity, user }) {
  const existing = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!existing) throw new AppError("Item not found.", 404);

  if (user?.role === "SUPERVISOR") {
    if (name !== undefined || sku !== undefined || quantity === undefined) {
      throw new AppError("Access denied. Supervisors can only increase quantity.", 403);
    }
    const nextQty = Number(quantity);
    const quantityChange = nextQty - existing.quantity;
    if (Number.isNaN(nextQty) || quantityChange <= 0) {
      throw new AppError("Access denied. Supervisors can only increase quantity.", 403);
    }
  }

  const updated = await prisma.inventoryItem.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: String(name).trim() } : {}),
      ...(sku !== undefined ? { sku: String(sku).trim() } : {}),
      ...(quantity !== undefined ? { quantity: Number(quantity) } : {}),
    },
  });

  await prisma.inventoryLog.create({
    data: {
      itemId: updated.id,
      change: updated.quantity - existing.quantity,
      type: "UPDATE",
      updatedBy: String(user?.email || "system"),
    },
  });

  return updated;
}

export async function deleteInventoryItem(id) {
  await prisma.inventoryItem.delete({ where: { id } });
  return true;
}

export async function listInventoryLogs(itemId) {
  return prisma.inventoryLog.findMany({ where: { itemId }, orderBy: { createdAt: "desc" } });
}
