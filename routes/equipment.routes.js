
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyOwner from "../middleware/verifyOwner.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

import {
    createEquipment,
    getMyEquipment,
    updateEquipment,
    deleteEquipment,
    getAllEquipment,
    updateEquipmentStatus,
    adminDeleteEquipment,
    getPublicEquipment,
    getEquipmentDetails,
    adminUpdateEquipment,
} from "../controllers/equipment.controller.js";

const router = express.Router();

// Owner routes
router.post("/", verifyToken, verifyOwner, createEquipment);
router.get("/my-equipment", verifyToken, verifyOwner, getMyEquipment);
router.patch("/:id", verifyToken, verifyOwner, updateEquipment);
router.delete("/:id", verifyToken, verifyOwner, deleteEquipment);

// Admin routes
router.get("/", verifyToken, verifyAdmin, getAllEquipment);
router.patch("/:id/status", verifyToken, verifyAdmin, updateEquipmentStatus);
router.delete("/:id/admin", verifyToken, verifyAdmin, adminDeleteEquipment);
router.patch("/:id/admin", verifyToken, verifyAdmin, adminUpdateEquipment);

// Public route
router.get("/public", getPublicEquipment);

// Authenticated users
router.get("/:id", verifyToken, getEquipmentDetails);

export default router;
