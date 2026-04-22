import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { authRequired, requireRole } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validate.js";
import { requireFields, validateProduct } from "../utils/validators.js";

const router = Router();

router.post(
  "/",
  authRequired,
  requireRole("ADMIN"),
  validateBody((body) => {
    requireFields(body, ["customerName", "product", "quantity"]);
    validateProduct(body.product);
  }),
  orderController.create
);
router.get("/", authRequired, requireRole("ADMIN"), orderController.list);
router.get("/:referenceId", authRequired, requireRole("ADMIN"), orderController.getByReference);
router.put(
  "/:referenceId/status",
  authRequired,
  requireRole("ADMIN"),
  validateBody((body) => requireFields(body, ["status"])),
  orderController.updateStatus
);

export default router;
