import { Router } from "express";
import * as inventoryController from "../controllers/inventoryController.js";
import { authRequired, requireAnyRole, requireRole } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validate.js";
import { requireFields, validateProduct } from "../utils/validators.js";

const router = Router();

router.get("/", authRequired, requireAnyRole("SUPERVISOR"), inventoryController.list);
router.post(
  "/",
  authRequired,
  requireAnyRole("SUPERVISOR"),
  validateBody((body) => {
    requireFields(body, ["name", "quantity"]);
    validateProduct(body.name);
  }),
  inventoryController.create
);
router.put(
  "/:id",
  authRequired,
  requireAnyRole("SUPERVISOR"),
  validateBody((body) => {
    if (body.name !== undefined) validateProduct(body.name);
  }),
  inventoryController.update
);
router.delete("/:id", authRequired, requireRole("ADMIN"), inventoryController.remove);
router.get("/logs/:itemId", authRequired, requireAnyRole("SUPERVISOR"), inventoryController.logs);

export default router;
