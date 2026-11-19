import { ObjectId } from "mongodb";
import { database } from "../config/db.js";
import stripe from "../config/stripe.js";

const rentals = database.collection("rentals");

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

            // payment_method_types: ["card"],

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

            success_url: `${process.env.CLIENT_URL}/dashboard/customer/rentals?payment=success&session_id={CHECKOUT_SESSION_ID}`,

            cancel_url: `${process.env.CLIENT_URL}/dashboard/customer/rentals?payment=cancelled`,
        });

        await rentals.updateOne(
            { _id: rental._id },
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
                const rentalId = checkoutSession.metadata.rentalId;

                if (ObjectId.isValid(rentalId)) {
                    await rentals.updateOne(
                        {
                            _id: new ObjectId(rentalId),
                            stripeSessionId: checkoutSession.id,
                            paymentStatus: "unpaid",
                            status: "pending",
                        },
                        {
                            $set: {
                                paymentStatus: "paid",
                                status: "confirmed",
                                paymentIntentId: checkoutSession.payment_intent,
                                updatedAt: new Date(),
                            },
                        }
                    );
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