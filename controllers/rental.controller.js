import { database, client } from "../config/db.js";
import { ObjectId } from "mongodb";

const rentals = database.collection("rentals");
const equipments = database.collection("equipment")

// Create rental (Customer)
export const createRental = async (req, res) => {
    const session = client.startSession();

    try {
        const {
            equipmentId,
            startDate,
            endDate,
            quantity,
            contactNumber,
            address,
            notes,
        } = req.body;

        if (!ObjectId.isValid(equipmentId)) {
            return res.status(400).json({
                message: "Invalid equipment ID!",
            });
        }

        const rentalStartDate = new Date(startDate);
        const rentalEndDate = new Date(endDate);
        const rentalQuantity = Number(quantity);

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        if (
            isNaN(rentalStartDate.getTime()) ||
            isNaN(rentalEndDate.getTime()) ||
            rentalStartDate < today ||
            rentalEndDate <= rentalStartDate
        ) {
            return res.status(400).json({
                message: "Invalid rental dates!",
            });
        }

        if (!Number.isInteger(rentalQuantity) || rentalQuantity < 1) {
            return res.status(400).json({
                message: "Invalid rental quantity!",
            });
        }

        if (!contactNumber || !address) {
            return res.status(400).json({
                message: "Contact number and address are required!",
            });
        }

        let newRental;

        await session.withTransaction(async () => {
            const equipmentObjectId = new ObjectId(equipmentId);

            const lock = await equipments.updateOne(
                {
                    _id: equipmentObjectId,
                    status: "approved",
                    isAvailable: { $ne: false },
                    ownerId: { $ne: req.user.id },
                },
                {
                    $inc: { bookingVersion: 1 },
                },
                { session }
            );

            if (lock.matchedCount === 0) {
                throw new Error("EQUIPMENT_NOT_AVAILABLE");
            }

            const equipment = await equipments.findOne(
                { _id: equipmentObjectId },
                { session }
            );

            const overlappingRentals = await rentals.find({
                equipmentId: equipmentObjectId,
                status: { $in: ["pending", "confirmed", "active"] },
                startDate: { $lt: rentalEndDate },
                endDate: { $gt: rentalStartDate },
            }, { session }).toArray();

            const bookedQuantity = overlappingRentals.reduce(
                (total, rental) => total + rental.quantity,
                0
            );

            if (bookedQuantity + rentalQuantity > equipment.availableQuantity) {
                throw new Error("INSUFFICIENT_QUANTITY");
            }

            const rentalDays = Math.ceil(
                (rentalEndDate - rentalStartDate) / (1000 * 60 * 60 * 24)
            );

            const totalAmount =
                equipment.price * rentalDays * rentalQuantity;

            newRental = {
                equipmentId: equipmentObjectId,
                customerId: req.user.id,
                startDate: rentalStartDate,
                endDate: rentalEndDate,
                quantity: rentalQuantity,
                contactNumber,
                address,
                notes: notes || "",
                rentalDays,
                totalAmount,
                status: "pending",
                paymentStatus: "unpaid",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await rentals.insertOne(newRental, { session });

            newRental._id = result.insertedId;
        });

        return res.status(201).json({
            message: "Rental created successfully!",
            rental: newRental,
        });
    } catch (error) {
        if (error.message === "EQUIPMENT_NOT_AVAILABLE") {
            return res.status(404).json({
                message: "Equipment is not available for rental!",
            });
        }

        if (error.message === "INSUFFICIENT_QUANTITY") {
            return res.status(400).json({
                message: "Not enough equipment available for these dates!",
            });
        }

        console.error("Create rental error:", error);

        return res.status(500).json({
            message: "Failed to create rental!",
        });
    } finally {
        await session.endSession();
    }
};

export const getMyRentals = async (req, res) => {
    try {
        const result = await rentals.aggregate([
            {
                $match: {
                    customerId: req.user.id,
                },
            },
            {
                $lookup: {
                    from: "equipment",
                    localField: "equipmentId",
                    foreignField: "_id",
                    as: "equipment",
                },
            },
            {
                $unwind: {
                    path: "$equipment",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]).toArray();

        return res.status(200).json({
            message: "My rentals fetched successfully!",
            rentals: result,
        });
    } catch (error) {
        console.error("Get my rentals error:", error);

        return res.status(500).json({
            message: "Failed to fetch rentals!",
        });
    }
};


export const getRentalDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid rental ID!",
            });
        }

        const result = await rentals.aggregate([
            {
                $match: {
                    _id: new ObjectId(id),
                    customerId: req.user.id,
                },
            },
            {
                $lookup: {
                    from: "equipment",
                    localField: "equipmentId",
                    foreignField: "_id",
                    as: "equipment",
                },
            },
            {
                $unwind: {
                    path: "$equipment",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]).toArray();

        if (result.length === 0) {
            return res.status(404).json({
                message: "Rental not found!",
            });
        }

        return res.status(200).json({
            message: "Rental details fetched successfully!",
            rental: result[0],
        });
    } catch (error) {
        console.error("Get rental details error:", error);

        return res.status(500).json({
            message: "Failed to fetch rental details!",
        });
    }
};

export const getOwnerRentals = async (req, res) => {
    try {
        const result = await rentals.aggregate([
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
                    "equipment.ownerId": req.user.id,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]).toArray();

        return res.status(200).json({
            message: "Owner rentals fetched successfully!",
            rentals: result,
        });
    } catch (error) {
        console.error("Get owner rentals error:", error);

        return res.status(500).json({
            message: "Failed to fetch owner rentals!",
        });
    }
};

export const cancelRental = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid rental ID!",
            });
        }

        const result = await rentals.updateOne(
            {
                _id: new ObjectId(id),
                customerId: req.user.id,
                status: "pending",
            },
            {
                $set: {
                    status: "cancelled",
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Rental not found or cannot be cancelled!",
            });
        }

        return res.status(200).json({
            message: "Rental cancelled successfully!",
        });
    } catch (error) {
        console.error("Cancel rental error:", error);

        return res.status(500).json({
            message: "Failed to cancel rental!",
        });
    }
};
export const updateRentalStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "confirmed",
            "active",
            "completed",
            "cancelled",
        ];

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid rental ID!",
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid rental status!",
            });
        }

        const rental = await rentals.findOne({
            _id: new ObjectId(id),
        });

        if (!rental) {
            return res.status(404).json({
                message: "Rental not found!",
            });
        }

        const equipment = await equipments.findOne({
            _id: rental.equipmentId,
            ownerId: req.user.id,
        });

        if (!equipment) {
            return res.status(403).json({
                message: "You cannot update this rental!",
            });
        }

        await rentals.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status,
                    updatedAt: new Date(),
                },
            }
        );

        return res.status(200).json({
            message: "Rental status updated successfully!",
        });
    } catch (error) {
        console.error("Update rental status error:", error);

        return res.status(500).json({
            message: "Failed to update rental status!",
        });
    }
};
// Get all rentals (Admin)
export const getAllRentals = async (req, res) => {
    try {
        const result = await rentals.aggregate([
            {
                $lookup: {
                    from: "equipment",
                    localField: "equipmentId",
                    foreignField: "_id",
                    as: "equipment",
                },
            },
            {
                $unwind: {
                    path: "$equipment",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]).toArray();

        return res.status(200).json({
            message: "All rentals fetched successfully!",
            rentals: result,
        });
    } catch (error) {
        console.error("Get all rentals error:", error);

        return res.status(500).json({
            message: "Failed to fetch rentals!",
        });
    }
};
