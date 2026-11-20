
import { database } from "../config/db.js";

const users = database.collection("user");
const equipments = database.collection("equipment");
const rentals = database.collection("rentals");
const payments = database.collection("payments");

// Get Admin Analytics
export const getAdminAnalytics = async (req, res) => {
    try {
        // Total Users
        const totalUsers = await users.countDocuments();

        // Total Equipment
        const totalEquipment = await equipments.countDocuments();

        // Total Bookings
        const totalBookings = await rentals.countDocuments();

        // Pending Equipment Approvals
        const pendingApprovals = await equipments.countDocuments({
            status: "pending",
        });

        // Completed Rentals
        const completedRentals = await rentals.countDocuments({
            status: "completed",
        });

        // Total Revenue from Successful Payments
        const revenueResult = await payments.aggregate([
            {
                $match: {
                    status: "paid",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" },
                },
            },
        ]).toArray();

        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Monthly Booking Statistics (Last 6 Months)
        const currentDate = new Date();

        const sixMonthsAgo = new Date(
            Date.UTC(
                currentDate.getFullYear(),
                currentDate.getMonth() - 5,
                1
            )
        );

        const monthlyBookings = await rentals.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: sixMonthsAgo,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$createdAt",
                            timezone: "Asia/Dhaka",
                        },
                    },
                    totalBookings: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]).toArray();

        return res.status(200).json({
            message: "Admin analytics fetched successfully!",
            analytics: {
                totalUsers,
                totalEquipment,
                totalBookings,
                pendingApprovals,
                completedRentals,
                totalRevenue,
                monthlyBookings,
            },
        });

    } catch (error) {
        console.error("Admin analytics error:", error);

        return res.status(500).json({
            message: "Failed to fetch admin analytics!",
        });
    }
};
