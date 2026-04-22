import { normalizePrismaError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { sendError } from "../utils/response.js";

export function errorHandler(error, _req, res, _next) {
  logger.error(error);

  if (error?.statusCode) {
    return sendError(res, error.message || "Request failed.", error.statusCode);
  }

  const prismaError = normalizePrismaError(error);
  if (prismaError) {
    return sendError(res, prismaError.message, prismaError.status);
  }

  return sendError(res, error?.message || "Unexpected server error.", 500);
}
