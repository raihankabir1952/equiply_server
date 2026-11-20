import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import upload from "../middleware/upload.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/image", verifyJWT, upload.single("image"), uploadImage);

export default router;