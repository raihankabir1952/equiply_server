import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },

        equipmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Equipment",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate favorites
favoriteSchema.index(
    { userId: 1, equipmentId: 1 },
    { unique: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;