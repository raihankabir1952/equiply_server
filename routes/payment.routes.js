import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyCustomer from "../middleware/verifyCustomer.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", verifyToken, verifyCustomer, createCheckoutSession);

export default router;