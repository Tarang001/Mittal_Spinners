import { Router } from "express";
import * as inquiryController from "../controllers/inquiryController.js";
import { validateBody } from "../middlewares/validate.js";
import { requireFields, validateEmail } from "../utils/validators.js";

const router = Router();

router.post(
  "/",
  validateBody((body) => {
    requireFields(body, ["name", "email", "message"]);
    validateEmail(body.email);
  }),
  inquiryController.create
);

export default router;
