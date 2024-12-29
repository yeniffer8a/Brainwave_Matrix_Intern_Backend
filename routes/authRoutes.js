import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post("/token", userController.login);

export default router;
