
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "equiply",
        });

        console.log("MongoDB connected successfully!");
        console.log("Database Name:", mongoose.connection.name);
        console.log("Database Host:", mongoose.connection.host);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;
