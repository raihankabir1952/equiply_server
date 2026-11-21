import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import {
    getMe,
    updateMe,
    getAllUsers,
    updateUserRole,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", verifyToken, getMe);
router.patch("/me", verifyToken, updateMe);

router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.patch("/:id/role", verifyToken, verifyAdmin, updateUserRole);

export default router;