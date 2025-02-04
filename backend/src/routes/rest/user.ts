import express from "express";
import { param } from "express-validator";
import validate from "@/middlewares/validate";
import userHandlers from "@/handlers/user";

const router = express.Router();

router.get(
  "/:name/",
  param("name").exists(),
  validate,
  userHandlers.getUserHandler,
);
router.get(
  "/:name/exists",
  param("name").exists(),
  validate,
  userHandlers.checkUserHandler,
);

export default router;
