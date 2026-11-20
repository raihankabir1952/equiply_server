
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import { getAdminAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

// Admin Analytics
router.get("/admin", verifyJWT, verifyAdmin, getAdminAnalytics);

export default router;
