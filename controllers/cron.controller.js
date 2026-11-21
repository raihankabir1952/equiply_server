
import { database } from "../config/db.js";

export const completeExpiredRentals = async (req, res) => {
    try {
        const cronSecret = process.env.CRON_SECRET;

        if (!cronSecret) {
            return res.status(500).json({
                message: "Cron secret is not configured!",
            });
        }

        const authHeader = req.headers.authorization;

        if (authHeader !== `Bearer ${cronSecret}`) {
            return res.status(401).json({
                message: "Unauthorized!",
            });
        }

        const rentals = database.collection("rentals");
        const now = new Date();

        const result = await rentals.updateMany(
            {
                status: "active",
                endDate: { $lt: now },
            },
            {
                $set: {
                    status: "completed",
                    updatedAt: now,
                },
            }
        );

        return res.status(200).json({
            message: "Expired rentals updated successfully!",
            updatedCount: result.modifiedCount,
        });

    } catch (error) {
        console.error("Cron job error:", error);

        return res.status(500).json({
            message: "Failed to update expired rentals!",
        });
    }
};
