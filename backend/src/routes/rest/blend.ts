import express from "express";
import { getBlendHandler } from "@/handlers/blend";
import { body, query } from "express-validator";
import validate from "@/middlewares/validate";

const router = express.Router();

router.post(
  "/",
  body("names").isArray({ min: 1, max: 5 }),
  body("top").default(10).isInt(),
  body("threshold").default(0.6).isFloat({ min: 0, max: 1 }),
  body("data").default(false).isBoolean(),
  validate,
  getBlendHandler,
);

export default router;
