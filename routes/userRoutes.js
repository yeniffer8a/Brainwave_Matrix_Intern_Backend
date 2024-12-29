import express from "express";
import dotenv from "dotenv";
import userController from "../controllers/userController.js";
import userValidator from "../middlewares/userValidator.js";
import { expressjwt } from "express-jwt";

dotenv.config();
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "contraseniaSecreta!";

router.post("/users", userValidator.create, userController.createUser);

router.get(
  "/users",
  expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }),
  userController.onlyOneUser
);

router.delete(
  "/users",
  expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }),
  userController.deleteUser
);

router.patch(
  "/users",
  expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }),
  userController.updateUser
);

export default router;
