import express from "express";
import roomRoutes from "./room";
import blendRoutes from "./blend";
import userRoutes from "./user";
import validate from "@/middlewares/validate";
import { header, param } from "express-validator";

const router = express.Router();

const needHeader = header('X-Letterboxd-User').isString().notEmpty();

router.use("/room", needHeader, validate, roomRoutes);
router.use("/blend", needHeader, validate, blendRoutes);
router.use("/user", userRoutes);

export default router;
