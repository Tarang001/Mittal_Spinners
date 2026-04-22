import * as orderService from "../services/orderService.js";
import { AppError } from "../utils/errors.js";
import { sendSuccess } from "../utils/response.js";

export async function create(req, res, next) {
  try {
    const data = await orderService.createOrder({
      ...(req.body || {}),
      userEmail: String(req.user?.email || "system"),
    });
    return sendSuccess(res, data, 201);
  } catch (error) {
    return next(error);
  }
}

export async function list(req, res, next) {
  try {
    const data = await orderService.listOrders();
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
}

export async function getByReference(req, res, next) {
  try {
    const data = await orderService.getOrderByReference(req.params.referenceId);
    if (!data) throw new AppError("Order not found.", 404);
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const data = await orderService.updateOrderStatus(
      req.params.referenceId,
      req.body?.status,
      String(req.user?.email || "system")
    );
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
}
