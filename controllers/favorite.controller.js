import Favorite from "../models/Favorite.js";
import Equipment from "../models/Equipment.js";

export const addFavorite = async (req, res) => {
    try {
        const { equipmentId } = req.body;

        if (!equipmentId) {
            return res.status(400).json({
                message: "Equipment ID is required!",
            });
        }

        const equipment = await Equipment.findById(equipmentId);

        if (!equipment || equipment.status !== "approved") {
            return res.status(404).json({
                message: "Equipment not found!",
            });
        }

        const favorite = await Favorite.create({
            userId: req.user.id,
            equipmentId,
        });

        return res.status(201).json({
            message: "Added to favorites successfully!",
            favorite,
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
        const favorites = await Favorite.find({
            userId: req.user.id,
        })
            .populate("equipmentId")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Favorites fetched successfully!",
            favorites,
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

        const favorite = await Favorite.findOneAndDelete({
            userId: req.user.id,
            equipmentId,
        });

        if (!favorite) {
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