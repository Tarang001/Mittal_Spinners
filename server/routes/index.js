import { Router } from "express";
import authRoutes from "./authRoutes.js";
import workerRoutes from "./workerRoutes.js";
import attendanceRoutes from "./attendanceRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import orderRoutes from "./orderRoutes.js";
import inquiryRoutes from "./inquiryRoutes.js";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/workers", workerRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/orders", orderRoutes);
router.use("/inquiry", inquiryRoutes);

export default router;
