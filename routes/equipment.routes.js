
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
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
router.post("/", verifyJWT, verifyOwner, createEquipment);
router.get("/my-equipment", verifyJWT, verifyOwner, getMyEquipment);
router.patch("/:id", verifyJWT, verifyOwner, updateEquipment);
router.delete("/:id", verifyJWT, verifyOwner, deleteEquipment);

// Admin routes
router.get("/", verifyJWT, verifyAdmin, getAllEquipment);
router.patch("/:id/status", verifyJWT, verifyAdmin, updateEquipmentStatus);
router.delete("/:id/admin", verifyJWT, verifyAdmin, adminDeleteEquipment);
router.patch("/:id/admin", verifyJWT, verifyAdmin, adminUpdateEquipment);

// Public route
router.get("/public", getPublicEquipment);

// Authenticated users
router.get("/:id", verifyJWT, getEquipmentDetails);

export default router;
