
import { database } from "../config/db.js";

const equipments = database.collection("equipments");

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
