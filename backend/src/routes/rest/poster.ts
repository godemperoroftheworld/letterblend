import express from "express";
import {body, param, query} from "express-validator";
import validate from "@/middlewares/validate";
import {getPosterHandler, getSlugPosterHandler} from "@/handlers/poster";

const router = express.Router();

router.get(
  "/slug/:slug",
  param("slug").isString(),
  validate,
  getSlugPosterHandler,
);
router.get("/id/:id", param("id").isNumeric(), validate, getPosterHandler)

export default router;
