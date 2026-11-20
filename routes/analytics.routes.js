
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyOwner from "../middleware/verifyOwner.js";

import {
    getAdminAnalytics,
    getOwnerAnalytics,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// Admin Analytics
router.get("/admin", verifyJWT, verifyAdmin, getAdminAnalytics);

// Owner Analytics
router.get("/owner", verifyJWT, verifyOwner, getOwnerAnalytics);

export default router;
