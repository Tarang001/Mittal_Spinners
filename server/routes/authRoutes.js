import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { authRequired, requireRole } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validate.js";
import { requireFields } from "../utils/validators.js";

const router = Router();

router.post("/register", validateBody((body) => requireFields(body, ["email", "password"])), authController.register);
router.post("/login", validateBody((body) => requireFields(body, ["email", "password"])), authController.login);
router.post(
  "/supervisors",
  authRequired,
  requireRole("ADMIN"),
  validateBody((body) => requireFields(body, ["name", "email", "password"])),
  authController.createSupervisor
);

export default router;
