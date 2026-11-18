import express from "express";
import verifyToken from "../middleware/verifyToken.js";

import {
    addFavorite,
    getMyFavorites,
    removeFavorite,
} from "../controllers/favorite.controller.js";

const router = express.Router();

router.post("/", verifyToken, addFavorite);
router.get("/", verifyToken, getMyFavorites);
router.delete("/:equipmentId", verifyToken, removeFavorite);

export default router;