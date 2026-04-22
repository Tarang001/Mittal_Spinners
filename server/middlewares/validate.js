import { sendError } from "../utils/response.js";

export function validateBody(validator) {
  return (req, res, next) => {
    try {
      validator(req.body || {});
      return next();
    } catch (error) {
      return sendError(res, error.message || "Invalid request body.", error.statusCode || 400);
    }
  };
}
