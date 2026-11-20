
import { database } from "../config/db.js";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { ObjectId } from "mongodb";

const users = database.collection("user");

// Get current user profile
export const getMe = (req, res) => {
    return res.status(200).json({
        message: "User profile fetched successfully!",
        user: req.user,
    });
};

// Update current user profile

export const updateMe = async (req, res) => {
    try {
        const { name, image, phoneNumber, address } = req.body;

        const updateData = {};

        if (name !== undefined) {
            updateData.name = name.trim();
        }

        if (image !== undefined) {
            updateData.image = image;
        }

        if (phoneNumber !== undefined) {
            updateData.phoneNumber = phoneNumber.trim();
        }

        if (address !== undefined) {
            updateData.address = address.trim();
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Please provide profile information to update!",
            });
        }

        const updatedUser = await auth.api.updateUser({
            body: updateData,
            headers: fromNodeHeaders(req.headers),
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
                $set: { role },
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
