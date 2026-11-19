
import { database } from "../config/db.js";
import { ObjectId } from "mongodb";

const equipments = database.collection("equipment");

export const createEquipment = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            rentalType,
            location,
            availableQuantity,
            termsAndConditions,
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            price === null ||
            !category ||
            !image ||
            !rentalType ||
            !location ||
            availableQuantity === undefined ||
            availableQuantity === null ||
            !termsAndConditions
        ) {
            return res.status(400).json({
                message: "Please provide all required fields!",
            });
        }

        const equipment = {
            name,
            description,
            price: Number(price),
            category,
            image,
            rentalType,
            location,
            availableQuantity: Number(availableQuantity),
            termsAndConditions,
            ownerId: req.user.id,
            status: "pending",
            isAvailable: true,
            averageRating: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await equipments.insertOne(equipment);

        return res.status(201).json({
            message: "Equipment added successfully!",
            equipment: {
                ...equipment,
                _id: result.insertedId,
            },
        });
    } catch (error) {
        console.error("Create equipment error:", error);

        return res.status(500).json({
            message: "Failed to add equipment!",
        });
    }
};

export const getMyEquipment = async (req, res) => {
    console.log("Logged-in Owner ID:", req.user.id);
    console.log("Owner ID type:", typeof req.user.id);
    try {
        const result = await equipments.find({
            ownerId: req.user.id,
        }).sort({
            createdAt: -1,
        }).toArray();

        return res.status(200).json({
            message: "My equipment fetched successfully!",
            equipment: result,
        });
    } catch (error) {
        console.error("Get my equipment error:", error);

        return res.status(500).json({
            message: "Failed to fetch equipment!",
        });
    }
};
export const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid equipment ID!",
            });
        }

        const {
            name,
            description,
            price,
            category,
            image,
            rentalType,
            location,
            availableQuantity,
            termsAndConditions,
        } = req.body;

        const result = await equipments.updateOne(
            {
                _id: new ObjectId(id),
                ownerId: req.user.id,
            },
            {
                $set: {
                    name,
                    description,
                    price: Number(price),
                    category,
                    image,
                    rentalType,
                    location,
                    availableQuantity: Number(availableQuantity),
                    termsAndConditions,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Equipment not found!",
            });
        }

        return res.status(200).json({
            message: "Equipment updated successfully!",
        });
    } catch (error) {
        console.error("Update equipment error:", error);

        return res.status(500).json({
            message: "Failed to update equipment!",
        });
    }
};
export const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid equipment ID!",
            });
        }

        const result = await equipments.deleteOne({
            _id: new ObjectId(id),
            ownerId: req.user.id,
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Equipment not found!",
            });
        }

        return res.status(200).json({
            message: "Equipment deleted successfully!",
        });
    } catch (error) {
        console.error("Delete equipment error:", error);

        return res.status(500).json({
            message: "Failed to delete equipment!",
        });
    }
};
// Get all equipment (Admin)
export const getAllEquipment = async (req, res) => {
    try {
        const result = await equipments.find({})
            .sort({
                createdAt: -1,
            })
            .toArray();

        return res.status(200).json({
            message: "All equipment fetched successfully!",
            equipments: result,
        });
    } catch (error) {
        console.error("Get all equipment error:", error);

        return res.status(500).json({
            message: "Failed to fetch equipment!",
        });
    }
};