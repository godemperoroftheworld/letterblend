import express from "express";
import roomRoutes from "./room";
import blendRoutes from "./blend";
import userRoutes from "./user";
import posterRoutes from "./poster";
import validate from "@/middlewares/validate";
import {header} from "express-validator";
import logger from "jet-logger";

const router = express.Router();


router.use((req, _res, next) => {
  logger.info(req.method + ': ' + req.url);
  next();
})
router.use("/room", header('X-Letterboxd-User').isString().notEmpty(), validate, roomRoutes);
router.use("/blend", blendRoutes);
router.use("/poster", posterRoutes)
router.use("/user", userRoutes);

export default router;
