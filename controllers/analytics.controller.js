
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


// Get Owner Analytics
export const getOwnerAnalytics = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Total Listed Equipment
        const totalEquipment = await equipments.countDocuments({
            ownerId,
        });

        // Completed Rentals
        const completedResult = await rentals.aggregate([
            {
                $lookup: {
                    from: "equipment",
                    localField: "equipmentId",
                    foreignField: "_id",
                    as: "equipment",
                },
            },
            {
                $unwind: "$equipment",
            },
            {
                $match: {
                    "equipment.ownerId": ownerId,
                    status: "completed",
                },
            },
            {
                $count: "total",
            },
        ]).toArray();

        const completedRentals = completedResult[0]?.total || 0;

        // Total Earnings from Successful Payments
        const earningsResult = await payments.aggregate([
            {
                $match: {
                    status: "paid",
                },
            },
            {
                $lookup: {
                    from: "rentals",
                    localField: "rentalId",
                    foreignField: "_id",
                    as: "rental",
                },
            },
            {
                $unwind: "$rental",
            },
            {
                $lookup: {
                    from: "equipment",
                    localField: "rental.equipmentId",
                    foreignField: "_id",
                    as: "equipment",
                },
            },
            {
                $unwind: "$equipment",
            },
            {
                $match: {
                    "equipment.ownerId": ownerId,
                },
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: {
                        $sum: "$amount",
                    },
                },
            },
        ]).toArray();

        const totalEarnings = earningsResult[0]?.totalEarnings || 0;

        // Monthly Earnings (Last 6 Months)
        const currentDate = new Date();

        const sixMonthsAgo = new Date(
            Date.UTC(
                currentDate.getFullYear(),
                currentDate.getMonth() - 5,
                1
            )
        );

        const monthlyEarnings = await payments.aggregate([
            {
                $match: {
                    status: "paid",
                    paidAt: {
                        $gte: sixMonthsAgo,
                    },
                },
            },
            {
                $lookup: {
                    from: "rentals",
                    localField: "rentalId",
                    foreignField: "_id",
                    as: "rental",
                },
            },
            {
                $unwind: "$rental",
            },
            {
                $lookup: {
                    from: "equipment",
                    localField: "rental.equipmentId",
                    foreignField: "_id",
                    as: "equipment",
                },
            },
            {
                $unwind: "$equipment",
            },
            {
                $match: {
                    "equipment.ownerId": ownerId,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$paidAt",
                            timezone: "Asia/Dhaka",
                        },
                    },
                    totalEarnings: {
                        $sum: "$amount",
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
            message: "Owner analytics fetched successfully!",
            analytics: {
                totalEquipment,
                completedRentals,
                totalEarnings,
                monthlyEarnings,
            },
        });

    } catch (error) {
        console.error("Owner analytics error:", error);

        return res.status(500).json({
            message: "Failed to fetch owner analytics!",
        });
    }
};

