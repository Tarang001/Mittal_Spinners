import { prisma } from "../config/prisma.js";
import { validateOrderStatus } from "../utils/validators.js";

export async function createOrder({ customerName, product, quantity, userEmail }) {
  const referenceId = `ORD-${Date.now()}`;

  const order = await prisma.order.create({
    data: {
      referenceId,
      customerName: String(customerName).trim(),
      product: String(product).trim(),
      quantity: Number(quantity),
      status: "PENDING",
    },
  });

  await prisma.orderLog.create({
    data: { orderId: order.id, status: order.status, updatedBy: userEmail },
  });

  return order;
}

export async function listOrders() {
  return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getOrderByReference(referenceId) {
  return prisma.order.findUnique({ where: { referenceId } });
}

export async function updateOrderStatus(referenceId, status, userEmail) {
  const normalizedStatus = validateOrderStatus(status);

  const order = await prisma.order.update({
    where: { referenceId },
    data: { status: normalizedStatus },
  });

  await prisma.orderLog.create({
    data: { orderId: order.id, status: order.status, updatedBy: userEmail },
  });

  return order;
}
