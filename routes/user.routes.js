import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import {
    getMe,
    updateMe,
    getAllUsers,
    updateUserRole,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", verifyJWT, getMe);
router.patch("/me", verifyJWT, updateMe);

router.get("/", verifyJWT, verifyAdmin, getAllUsers);
router.patch("/:id/role", verifyJWT, verifyAdmin, updateUserRole);

export default router;