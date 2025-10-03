import rest from "./rest";
import express from "express";

const router = express.Router();

router.use("/api", rest);

export default router;
