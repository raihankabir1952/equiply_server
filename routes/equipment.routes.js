import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyOwner from "../middleware/verifyOwner.js";
import { createEquipment, getMyEquipment, updateEquipment, deleteEquipment } from "../controllers/equipment.controller.js";

const router = express.Router();

router.post("/", verifyToken, verifyOwner, createEquipment);
router.get("/my-equipment",verifyToken ,verifyOwner, getMyEquipment);
router.patch("/:id", verifyToken, verifyOwner, updateEquipment);
router.delete("/:id", verifyToken, verifyOwner, deleteEquipment);

export default router;