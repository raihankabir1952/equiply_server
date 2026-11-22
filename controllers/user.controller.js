
import { database } from "../config/db.js";
import { ObjectId } from "mongodb";

const users = database.collection("user");

// Get current user profile
export const getMe = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.user.id)) {
            return res.status(400).json({
                message: "Invalid user ID!",
            });
        }

        const user = await users.findOne({
            _id: new ObjectId(req.user.id),
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found!",
            });
        }

        return res.status(200).json({
            message: "User profile fetched successfully!",
            user,
        });

    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            message: "Failed to fetch user profile!",
        });
    }
};


// Update current user profile
export const updateMe = async (req, res) => {
    try {
        const { name, image, phoneNumber, address } = req.body;

        if (!ObjectId.isValid(req.user.id)) {
            return res.status(400).json({
                message: "Invalid user ID!",
            });
        }

        const updateData = {};

        if (name !== undefined) {
            if (typeof name !== "string") {
                return res.status(400).json({
                    message: "Invalid name!",
                });
            }

            updateData.name = name.trim();
        }

        if (image !== undefined) {
            if (typeof image !== "string") {
                return res.status(400).json({
                    message: "Invalid image URL!",
                });
            }

            updateData.image = image;
        }

        if (phoneNumber !== undefined) {
            if (typeof phoneNumber !== "string") {
                return res.status(400).json({
                    message: "Invalid phone number!",
                });
            }

            updateData.phoneNumber = phoneNumber.trim();
        }

        if (address !== undefined) {
            if (typeof address !== "string") {
                return res.status(400).json({
                    message: "Invalid address!",
                });
            }

            updateData.address = address.trim();
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Please provide profile information to update!",
            });
        }

        const result = await users.updateOne(
            {
                _id: new ObjectId(req.user.id),
            },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "User not found!",
            });
        }

        const updatedUser = await users.findOne({
            _id: new ObjectId(req.user.id),
        });

        return res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Profile update error:", error);

        return res.status(500).json({
            message: "Profile update failed!",
        });
    }
};


// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const result = await users.find(
            {},
            {
                projection: {
                    password: 0,
                },
            }
        ).sort({
            createdAt: -1,
        }).toArray();

        return res.status(200).json({
            message: "All users fetched successfully!",
            users: result,
        });

    } catch (error) {
        console.error("Get all users error:", error);

        return res.status(500).json({
            message: "Failed to fetch users!",
        });
    }
};


// Update user role
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user ID!",
            });
        }

        if (!["customer", "owner", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Invalid user role!",
            });
        }

        if (id === req.user.id) {
            return res.status(400).json({
                message: "You cannot change your own role!",
            });
        }

        const result = await users.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    role,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "User not found!",
            });
        }

        return res.status(200).json({
            message: "User role updated successfully!",
        });

    } catch (error) {
        console.error("Update user role error:", error);

        return res.status(500).json({
            message: "Failed to update user role!",
        });
    }
};
