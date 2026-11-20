
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import verifyCustomer from "../middleware/verifyCustomer.js";

import {
    addFavorite,
    getMyFavorites,
    removeFavorite,
} from "../controllers/favorite.controller.js";

const router = express.Router();

router.post("/", verifyJWT, verifyCustomer, addFavorite);
router.get("/", verifyJWT, verifyCustomer, getMyFavorites);
router.delete("/:equipmentId", verifyJWT, verifyCustomer, removeFavorite);

export default router;
