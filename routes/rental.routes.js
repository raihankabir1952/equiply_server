import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import verifyCustomer from "../middleware/verifyCustomer.js";
import verifyOwner from "../middleware/verifyOwner.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

import {
    createRental,
    getMyRentals,
    getRentalDetails,
    cancelRental,
    getOwnerRentals,
    updateRentalStatus,
    getAllRentals,
} from "../controllers/rental.controller.js";

const router = express.Router();

router.post("/", verifyJWT, verifyCustomer, createRental);
router.get("/", verifyJWT, verifyCustomer, getMyRentals);
router.get("/owner-rentals", verifyJWT, verifyOwner, getOwnerRentals);
router.get("/admin", verifyJWT, verifyAdmin, getAllRentals);
router.get("/:id", verifyJWT, verifyCustomer, getRentalDetails);
router.patch("/:id/cancel", verifyJWT, verifyCustomer, cancelRental);
router.patch("/:id/status", verifyJWT, verifyOwner, updateRentalStatus);


export default router;