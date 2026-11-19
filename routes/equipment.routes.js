import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyOwner from "../middleware/verifyOwner.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import { createEquipment, getMyEquipment, updateEquipment, deleteEquipment, getAllEquipment, updateEquipmentStatus, adminDeleteEquipment } from "../controllers/equipment.controller.js";

const router = express.Router();

router.post("/", verifyToken, verifyOwner, createEquipment);
router.get("/my-equipment",verifyToken ,verifyOwner, getMyEquipment);
router.patch("/:id", verifyToken, verifyOwner, updateEquipment);
router.delete("/:id", verifyToken, verifyOwner, deleteEquipment);
router.get("/", verifyToken, verifyAdmin, getAllEquipment);
router.patch("/:id/status", verifyToken, verifyAdmin, updateEquipmentStatus);
router.delete("/:id/admin", verifyToken, verifyAdmin, adminDeleteEquipment);

export default router;