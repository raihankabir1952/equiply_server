import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyCustomer from "../middleware/verifyCustomer.js";

import {
    addFavorite,
    getMyFavorites,
    removeFavorite,
} from "../controllers/favorite.controller.js";

const router = express.Router();

router.post("/", verifyToken, verifyCustomer,addFavorite);
router.get("/", verifyToken, verifyCustomer, getMyFavorites);
router.delete("/:equipmentId", verifyToken, verifyCustomer, removeFavorite);

export default router;