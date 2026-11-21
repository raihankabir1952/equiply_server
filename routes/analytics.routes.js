
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyOwner from "../middleware/verifyOwner.js";

import {
    getAdminAnalytics,
    getOwnerAnalytics,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// Admin Analytics
router.get("/admin", verifyToken, verifyAdmin, getAdminAnalytics);

// Owner Analytics
router.get("/owner", verifyToken, verifyOwner, getOwnerAnalytics);

export default router;
