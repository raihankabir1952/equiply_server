import Equipment from "../models/Equipment.js";

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

        const equipment = await Equipment.create({
            name,
            description,
            price,
            category,
            image,
            rentalType,
            location,
            availableQuantity,
            termsAndConditions,
            ownerId: req.user.id,
        });

        return res.status(201).json({
            message: "Equipment added successfully!",
            equipment,
        });
    } catch (error) {
        console.error("Create equipment error:", error);

        return res.status(500).json({
            message: "Failed to add equipment!",
        });
    }
};