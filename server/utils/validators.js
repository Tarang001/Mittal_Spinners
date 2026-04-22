import { AppError } from "./errors.js";
import { PRODUCT_OPTIONS, WORKER_ROLES, ORDER_STATUSES } from "../config/constants.js";

export function requireFields(payload, fields) {
  for (const field of fields) {
    if (payload?.[field] === undefined || payload?.[field] === null || payload?.[field] === "") {
      throw new AppError(`${field} is required.`, 400);
    }
  }
}

export function validateProduct(product) {
  if (!PRODUCT_OPTIONS.has(String(product).trim())) {
    throw new AppError("Invalid product selection.", 400);
  }
}

export function validateWorkerRole(role) {
  const normalizedRole = String(role).trim().toUpperCase();
  if (!WORKER_ROLES.has(normalizedRole)) {
    throw new AppError("Role must be SPINNER, OPERATOR or SUPERVISOR.", 400);
  }
  return normalizedRole;
}

export function validateOrderStatus(status) {
  const normalizedStatus = String(status).trim().toUpperCase();
  if (!ORDER_STATUSES.has(normalizedStatus)) {
    throw new AppError("Invalid order status.", 400);
  }
  return normalizedStatus;
}

export function validateEmail(email) {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
  if (!ok) {
    throw new AppError("Please provide a valid email.", 400);
  }
}
