import { logger } from "../utils/logger.js";

export function requestLogger(req, _res, next) {
  logger.apiHit(req.method, req.originalUrl);
  next();
}
