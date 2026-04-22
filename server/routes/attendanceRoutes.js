import { Router } from "express";
import * as attendanceController from "../controllers/attendanceController.js";
import { authRequired, requireAnyRole } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validate.js";
import { requireFields } from "../utils/validators.js";
import { AppError } from "../utils/errors.js";

const router = Router();

router.post(
  "/mark",
  authRequired,
  requireAnyRole("SUPERVISOR"),
  validateBody((body) => {
    requireFields(body, ["date", "entries"]);
    if (!Array.isArray(body.entries) || body.entries.length === 0) {
      throw new AppError("entries is required.", 400);
    }
  }),
  attendanceController.mark
);
router.get("/", authRequired, attendanceController.list);
router.get("/export", authRequired, requireAnyRole("SUPERVISOR"), attendanceController.exportWorkbook);

export default router;
