import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyOwner from "../middleware/verifyOwner.js";
import { createEquipment } from "../controllers/equipment.controller.js";

const router = express.Router();

router.post("/", verifyToken, verifyOwner, createEquipment);

export default router;