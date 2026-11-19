import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyCustomer from "../middleware/verifyCustomer.js";

import {
    getMyRentals,
    getRentalDetails,
    cancelRental
} from "../controllers/rental.controller.js";

const router = express.Router();

router.get("/", verifyToken, verifyCustomer, getMyRentals);

router.get("/:id", verifyToken, verifyCustomer, getRentalDetails);

router.patch("/:id/cancel", verifyToken, verifyCustomer, cancelRental);

export default router;