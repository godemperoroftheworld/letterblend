import express from "express";
import roomRoutes from "./room";
import blendRoutes from "./blend";
import userRoutes from "./user";
import posterRoutes from "./poster";
import validate from "@/middlewares/validate";
import {header} from "express-validator";

const router = express.Router();


router.use("/room", header('X-Letterboxd-User').isString().notEmpty(), validate, roomRoutes);
router.use("/blend", blendRoutes);
router.use("/poster", posterRoutes)
router.use("/user", userRoutes);

export default router;
