import express from "express";
import { body, header, oneOf, param } from "express-validator";
import validate from "@/middlewares/validate";
import roomHandlers from "@/handlers/room";

const router = express.Router();
const TOKEN_LENGTH = 8;

router.post(
  "/",
  header("X-Letterboxd-User").isString().notEmpty(),
  body("users").isArray({ min: 2, max: 5 }),
  body("top").default(10).isInt({ min: 1, max: 30 }),
  body("threshold").default(0.5).isFloat({ min: 0, max: 1 }),
  body("genre").optional().isArray(),
  body("decade").optional().isString().notEmpty(),
  validate,
  roomHandlers.createRoomHandler,
);
router.get("/count", roomHandlers.getRoomCountHandler);
router.get(
  "/:id",
  param("id").isString().isLength({ min: TOKEN_LENGTH, max: TOKEN_LENGTH }),
  validate,
  roomHandlers.getRoomHandler,
);
router.put(
  "/:id",
  param("id").isString().isLength({ min: TOKEN_LENGTH, max: TOKEN_LENGTH }),
  body("users").isArray({ min: 2, max: 5 }),
  body("top").default(10).isInt({ min: 1, max: 30 }),
  body("threshold").default(0.6).isFloat({ min: 0, max: 1 }),
  body("genre").optional().isArray(),
  body("decade").optional().isString(),
  validate,
  roomHandlers.updateRoomHandler,
);
router.delete(
  "/:id",
  header("X-Letterboxd-User").isString().notEmpty(),
  param("id").isString().isLength({ min: TOKEN_LENGTH, max: TOKEN_LENGTH }),
  validate,
  roomHandlers.deleteRoomHandler,
);

export default router;
