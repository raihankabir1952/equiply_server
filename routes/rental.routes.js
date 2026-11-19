import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyCustomer from "../middleware/verifyCustomer.js";
import verifyOwner from "../middleware/verifyOwner.js";

import {
    getMyRentals,
    getRentalDetails,
    cancelRental,
    getOwnerRentals,
    updateRentalStatus
} from "../controllers/rental.controller.js";

const router = express.Router();

router.get("/", verifyToken, verifyCustomer, getMyRentals);
router.get("/owner-rentals", verifyToken, verifyOwner, getOwnerRentals);
router.get("/:id", verifyToken, verifyCustomer, getRentalDetails);
router.patch("/:id/cancel", verifyToken, verifyCustomer, cancelRental);
router.patch("/:id/status", verifyToken, verifyOwner, updateRentalStatus);


export default router;