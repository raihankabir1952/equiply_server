
import { ObjectId } from "mongodb";
import { database } from "../config/db.js";

const favorites = database.collection("favorites");
const equipments = database.collection("equipments");

export const addFavorite = async (req, res) => {
    try {
        const { equipmentId } = req.body;

        if (!ObjectId.isValid(equipmentId)) {
            return res.status(400).json({
                message: "Valid equipment ID is required!",
            });
        }

        const equipment = await equipments.findOne({
            _id: new ObjectId(equipmentId),
            status: "approved",
        });

        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found!",
            });
        }

        const favorite = {
            userId: req.user.id,
            equipmentId: new ObjectId(equipmentId),
            createdAt: new Date(),
        };

        const result = await favorites.insertOne(favorite);

        return res.status(201).json({
            message: "Added to favorites successfully!",
            favorite: {
                ...favorite,
                _id: result.insertedId,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Already added to favorites!",
            });
        }

        console.error("Add favorite error:", error);

        return res.status(500).json({
            message: "Failed to add favorite!",
        });
    }
};

export const getMyFavorites = async (req, res) => {
    try {
        const result = await favorites.aggregate([
            {
                $match: {
                    userId: req.user.id,
                },
            },
            {
                $lookup: {
                    from: "equipments",
                    localField: "equipmentId",
                    foreignField: "_id",
                    as: "equipment",
                },
            },
            {
                $unwind: "$equipment",
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]).toArray();

        return res.status(200).json({
            message: "Favorites fetched successfully!",
            favorites: result,
        });
    } catch (error) {
        console.error("Get favorites error:", error);

        return res.status(500).json({
            message: "Failed to fetch favorites!",
        });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { equipmentId } = req.params;

        if (!ObjectId.isValid(equipmentId)) {
            return res.status(400).json({
                message: "Valid equipment ID is required!",
            });
        }

        const result = await favorites.deleteOne({
            userId: req.user.id,
            equipmentId: new ObjectId(equipmentId),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Favorite not found!",
            });
        }

        return res.status(200).json({
            message: "Removed from favorites successfully!",
        });
    } catch (error) {
        console.error("Remove favorite error:", error);

        return res.status(500).json({
            message: "Failed to remove favorite!",
        });
    }
};
