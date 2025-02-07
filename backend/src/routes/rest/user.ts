import express from "express";
import { body, param } from "express-validator";
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
  "/:name/avatar",
  param("name").exists(),
  validate,
  userHandlers.getAvatarHandler,
);
router.get(
  "/:name/exists",
  param("name").exists(),
  validate,
  userHandlers.checkUserHandler,
);
router.post(
  "/friends",
  body("names").isArray({ min: 1, max: 5 }),
  validate,
  userHandlers.getFriendsHandler,
);

export default router;
