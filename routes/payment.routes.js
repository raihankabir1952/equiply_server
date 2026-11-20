
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import verifyCustomer from "../middleware/verifyCustomer.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post(
    "/create-checkout-session",
    verifyJWT,
    verifyCustomer,
    createCheckoutSession
);

export default router;
