import express from "express";
import roomRoutes from "./room";
import blendRoutes from "./blend";
import userRoutes from "./user";
import posterRoutes from "./poster";

const router = express.Router();


router.use("/room", roomRoutes);
router.use("/blend", blendRoutes);
router.use("/poster", posterRoutes)
router.use("/user", userRoutes);

export default router;
