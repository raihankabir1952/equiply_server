import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/image", verifyToken, upload.single("image"), uploadImage);

export default router;