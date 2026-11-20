
import { ObjectId } from "mongodb";
import { database } from "../config/db.js";
import stripe from "../config/stripe.js";

const rentals = database.collection("rentals");
const payments = database.collection("payments");

// Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
    try {
        const { rentalId } = req.body;

        if (!ObjectId.isValid(rentalId)) {
            return res.status(400).json({
                message: "Invalid rental ID!",
            });
        }

        const rental = await rentals.findOne({
            _id: new ObjectId(rentalId),
            customerId: req.user.id,
        });

        if (!rental) {
            return res.status(404).json({
                message: "Rental not found!",
            });
        }

        if (
            rental.status !== "pending" ||
            rental.paymentStatus !== "unpaid"
        ) {
            return res.status(400).json({
                message: "This rental cannot be paid!",
            });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: "Equiply Equipment Rental",
                        },
                        unit_amount: Math.round(rental.totalAmount * 100),
                    },
                    quantity: 1,
                },
            ],

            customer_email: req.user.email,

            metadata: {
                rentalId: rental._id.toString(),
                customerId: req.user.id,
            },

            success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
        });

        await rentals.updateOne(
            {
                _id: rental._id,
                customerId: req.user.id,
                paymentStatus: "unpaid",
                status: "pending",
            },
            {
                $set: {
                    stripeSessionId: session.id,
                    updatedAt: new Date(),
                },
            }
        );

        return res.status(200).json({
            message: "Checkout session created successfully!",
            url: session.url,
        });
    } catch (error) {
        console.error("Create checkout session error:", error);

        return res.status(500).json({
            message: "Failed to create checkout session!",
        });
    }
};

// Handle Stripe Webhook
export const handleStripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Webhook signature error:", error.message);

        return res.status(400).json({
            message: "Invalid webhook signature!",
        });
    }

    try {
        if (event.type === "checkout.session.completed") {
            const checkoutSession = event.data.object;

            if (checkoutSession.payment_status === "paid") {
                const rentalId = checkoutSession.metadata?.rentalId;
                const customerId = checkoutSession.metadata?.customerId;

                if (!ObjectId.isValid(rentalId) || !customerId) {
                    return res.status(400).json({
                        message: "Invalid payment metadata!",
                    });
                }

                const rentalObjectId = new ObjectId(rentalId);
                const paidAt = new Date(event.created * 1000);

                // Check duplicate payment
                const existingPayment = await payments.findOne({
                    stripeSessionId: checkoutSession.id,
                });

                if (!existingPayment) {
                    // Update rental payment status
                    const result = await rentals.updateOne(
                        {
                            _id: rentalObjectId,
                            customerId,
                            stripeSessionId: checkoutSession.id,
                            paymentStatus: "unpaid",
                            status: "pending",
                        },
                        {
                            $set: {
                                paymentStatus: "paid",
                                status: "confirmed",
                                paymentIntentId: checkoutSession.payment_intent,
                                paidAt,
                                updatedAt: new Date(),
                            },
                        }
                    );

                    // Debug logs
                    console.log("Rental update result:", result);
                    console.log("Stripe Session ID:", checkoutSession.id);

                    if (result.modifiedCount === 1) {
                        // Save payment transaction
                        await payments.insertOne({
                            rentalId: rentalObjectId,
                            customerId,
                            amount: checkoutSession.amount_total / 100,
                            currency: checkoutSession.currency,
                            stripeSessionId: checkoutSession.id,
                            paymentIntentId: checkoutSession.payment_intent,
                            status: "paid",
                            paidAt,
                            createdAt: new Date(),
                        });

                        console.log("Payment saved successfully!");
                    } else {
                        console.log("Rental was not updated. Payment record not inserted.");
                    }
                } else {
                    console.log("Duplicate payment event ignored:", checkoutSession.id);
                }
            }
        }

        return res.status(200).json({
            received: true,
        });
    } catch (error) {
        console.error("Webhook processing error:", error);

        return res.status(500).json({
            message: "Webhook processing failed!",
        });
    }
};

// Verify Stripe Checkout Session
export const verifyCheckoutSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                message: "Session ID is required!",
            });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Verify session ownership
        if (
            session.metadata?.customerId !== req.user.id ||
            session.mode !== "payment"
        ) {
            return res.status(403).json({
                message: "Invalid payment session!",
            });
        }

        const rentalId = session.metadata.rentalId;

        if (!ObjectId.isValid(rentalId)) {
            return res.status(400).json({
                message: "Invalid rental ID!",
            });
        }

        // Verify rental ownership and session
        const rental = await rentals.findOne({
            _id: new ObjectId(rentalId),
            customerId: req.user.id,
            stripeSessionId: session.id,
        });

        if (!rental) {
            return res.status(404).json({
                message: "Rental not found!",
            });
        }

        return res.status(200).json({
            message: "Payment status verified!",
            paymentStatus: session.payment_status,
            rentalId,
        });
    } catch (error) {
        console.error("Payment verification error:", error);

        return res.status(500).json({
            message: "Failed to verify payment!",
        });
    }
};
