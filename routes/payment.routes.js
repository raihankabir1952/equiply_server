
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import verifyCustomer from "../middleware/verifyCustomer.js";
import { createCheckoutSession, verifyCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post(
    "/create-checkout-session",
    verifyJWT,
    verifyCustomer,
    createCheckoutSession
);

router.get(
    "/verify-session/:sessionId",
    verifyJWT,
    verifyCustomer,
    verifyCheckoutSession
);

export default router;
