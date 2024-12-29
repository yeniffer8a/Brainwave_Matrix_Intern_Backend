import express from "express";
import dotenv from "dotenv";
import taskController from "../controllers/taskController.js";
import taskValidator from "../middlewares/taskValidator.js";
import { expressjwt } from "express-jwt";

dotenv.config();
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

router.post(
  "/tasks",
  expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }),
  taskValidator.create,
  taskController.createTask
);

router.get(
  "/tasks",
  expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }),
  taskController.listTasks
);

router.get(
  "/tasks/:id",
  expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }),
  taskController.getOneTask
);

router.patch(
  "/tasks/:id",
  expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }),
  taskValidator.update,
  taskController.updateTask
);

router.delete(
  "/tasks/:id",
  expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }),
  taskController.deleteOneTask
);
export default router;
