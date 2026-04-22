import { Router } from "express";
import * as workerController from "../controllers/workerController.js";
import { authRequired, requireRole } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validate.js";
import { requireFields, validateWorkerRole } from "../utils/validators.js";
import { AppError } from "../utils/errors.js";

const router = Router();

router.get("/", authRequired, workerController.list);
router.post(
  "/",
  authRequired,
  requireRole("ADMIN"),
  validateBody((body) => {
    requireFields(body, ["name", "role"]);
    validateWorkerRole(body.role);
    if (!body.phone && !body.workerCode) {
      throw new AppError("phone is required.", 400);
    }
  }),
  workerController.create
);
router.put(
  "/:id",
  authRequired,
  requireRole("ADMIN"),
  validateBody((body) => {
    if (body.role !== undefined) validateWorkerRole(body.role);
  }),
  workerController.update
);
router.delete("/:id", authRequired, requireRole("ADMIN"), workerController.remove);

export default router;
