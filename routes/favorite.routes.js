
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyRenter from "../middleware/verifyRenter.js";

import {
    addFavorite,
    getMyFavorites,
    removeFavorite,
} from "../controllers/favorite.controller.js";

const router = express.Router();

router.post("/", verifyToken, verifyRenter, addFavorite);
router.get("/", verifyToken, verifyRenter, getMyFavorites);
router.delete("/:equipmentId", verifyToken, verifyRenter, removeFavorite);

export default router;
