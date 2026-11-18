import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        rentalType: {
            type: String,
            enum: ["hourly", "daily", "weekly"],
            required: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        availableQuantity: {
            type: Number,
            required: true,
            min: 0,
        },

        termsAndConditions: {
            type: String,
            required: true,
        },

        ownerId: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },

        averageRating: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);

export default Equipment;