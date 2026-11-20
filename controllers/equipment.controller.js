
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
// Update equipment status (Admin)
export const updateEquipmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid equipment ID!",
            });
        }

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid equipment status!",
            });
        }

        const result = await equipments.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    status,
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
            message: `Equipment ${status} successfully!`,
        });
    } catch (error) {
        console.error("Update equipment status error:", error);

        return res.status(500).json({
            message: "Failed to update equipment status!",
        });
    }
};
// Delete equipment (Admin)
export const adminDeleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid equipment ID!",
            });
        }

        const result = await equipments.deleteOne({
            _id: new ObjectId(id),
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
        console.error("Admin delete equipment error:", error);

        return res.status(500).json({
            message: "Failed to delete equipment!",
        });
    }
};
// Get all approved equipment (Public)


export const getPublicEquipment = async (req, res) => {
    try {
        const {
            search,
            category,
            availability,
            minPrice,
            maxPrice,
            sort,
        } = req.query;

        const query = {
            status: "approved",
        };

        // Search by Equipment Name or Category
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    category: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // Category Filter
        if (category) {
            query.category = category;
        }

        // Availability Filter
        if (availability === "available") {
            query.isAvailable = true;
        } else if (availability === "unavailable") {
            query.isAvailable = false;
        }

        // Price Filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};

            if (minPrice !== undefined) {
                query.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                query.price.$lte = Number(maxPrice);
            }
        }

        // Sorting
        let sortOption = { createdAt: -1 };

        if (sort === "price_asc") {
            sortOption = { price: 1 };
        } else if (sort === "price_desc") {
            sortOption = { price: -1 };
        }

        const result = await equipments.find(query)
            .sort(sortOption)
            .toArray();

        return res.status(200).json({
            message: "Equipment fetched successfully!",
            equipments: result,
        });
    } catch (error) {
        console.error("Get public equipment error:", error);

        return res.status(500).json({
            message: "Failed to fetch equipment!",
        });
    }
};

// Get equipment details (Public)
export const getEquipmentDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid equipment ID!",
            });
        }

        const equipment = await equipments.findOne({
            _id: new ObjectId(id),
            status: "approved",
        });

        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found!",
            });
        }

        return res.status(200).json({
            message: "Equipment details fetched successfully!",
            equipment,
        });
    } catch (error) {
        console.error("Get equipment details error:", error);

        return res.status(500).json({
            message: "Failed to fetch equipment details!",
        });
    }
};
//admin update equipment
export const adminUpdateEquipment = async (req, res) => {
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

        if (
            !name ||
            !description ||
            price === undefined ||
            !category ||
            !image ||
            !rentalType ||
            !location ||
            availableQuantity === undefined ||
            !termsAndConditions
        ) {
            return res.status(400).json({
                message: "Please provide all required fields!",
            });
        }

        const result = await equipments.updateOne(
            {
                _id: new ObjectId(id),
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
        console.error("Admin update equipment error:", error);

        return res.status(500).json({
            message: "Failed to update equipment!",
        });
    }
};
