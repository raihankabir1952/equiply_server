
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyRenter from "../middleware/verifyRenter.js";
import { createCheckoutSession, verifyCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post(
    "/create-checkout-session",
    verifyToken,
    verifyRenter,
    createCheckoutSession
);

router.get(
    "/verify-session/:sessionId",
    verifyToken,
    verifyRenter,
    verifyCheckoutSession
);

export default router;
