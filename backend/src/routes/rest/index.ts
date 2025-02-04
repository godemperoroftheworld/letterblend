import express from "express";
import roomRoutes from "./room";
import blendRoutes from "./blend";
import userRoutes from "./user";
import validate from "@/middlewares/validate";
import { header, param } from "express-validator";

const router = express.Router();

router.use(header("X-Letterboxd-User").isString().notEmpty(), validate);
router.use("/room", roomRoutes);
router.use("/blend", blendRoutes);
router.use("/user", userRoutes);

export default router;
