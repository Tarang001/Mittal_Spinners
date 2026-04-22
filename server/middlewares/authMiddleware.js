import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { sendError } from "../utils/response.js";

export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return sendError(res, "Missing authentication token.", 401);
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET);
    return next();
  } catch {
    return sendError(res, "Invalid or expired token.", 401);
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role === "ADMIN") {
      return next();
    }
    if (req.user?.role !== role) {
      return sendError(res, "Forbidden.", 403);
    }
    return next();
  };
}

export function requireAnyRole(...roles) {
  return (req, res, next) => {
    if (req.user?.role === "ADMIN") {
      return next();
    }
    if (!roles.includes(req.user?.role)) {
      return sendError(res, "Forbidden.", 403);
    }
    return next();
  };
}
