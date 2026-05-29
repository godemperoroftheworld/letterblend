import express from "express";
import { param } from "express-validator";
import validate from "@/middlewares/validate";
import {getPosterHandler } from "@/handlers/poster";

const router = express.Router();

router.get("/:id", param("id").isNumeric(), validate, getPosterHandler)

export default router;
