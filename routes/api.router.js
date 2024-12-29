//Patrón de arquitectura APIGATEWAY
//Enrutador de todos los endpoints
import express from "express";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import taskRoutes from "./taskRoutes.js";
const router = express.Router();

router.use("/api", authRoutes);
router.use("/api", userRoutes);
router.use("/api", taskRoutes);
export default router;
