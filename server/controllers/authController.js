import * as authService from "../services/authService.js";
import { sendSuccess } from "../utils/response.js";

export async function register(req, res, next) {
  try {
    const data = await authService.registerUser(req.body || {});
    return sendSuccess(res, data, 201);
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const data = await authService.loginUser(req.body || {});
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
}

export async function createSupervisor(req, res, next) {
  try {
    const data = await authService.createSupervisor(req.body || {});
    return sendSuccess(res, data, 201);
  } catch (error) {
    return next(error);
  }
}
