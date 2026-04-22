import * as inventoryService from "../services/inventoryService.js";
import { sendSuccess } from "../utils/response.js";

export async function list(req, res, next) {
  try {
    const data = await inventoryService.listInventory();
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
}

export async function create(req, res, next) {
  try {
    const data = await inventoryService.createInventoryItem({
      ...(req.body || {}),
      userEmail: String(req.user?.email || "system"),
    });
    return sendSuccess(res, data, 201);
  } catch (error) {
    return next(error);
  }
}

export async function update(req, res, next) {
  try {
    const data = await inventoryService.updateInventoryItem(req.params.id, {
      ...(req.body || {}),
      user: req.user,
    });
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await inventoryService.deleteInventoryItem(req.params.id);
    return sendSuccess(res, true);
  } catch (error) {
    return next(error);
  }
}

export async function logs(req, res, next) {
  try {
    const data = await inventoryService.listInventoryLogs(req.params.itemId);
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
}
