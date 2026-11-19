import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

const database = client.db("equiply");

export const connectToMongoDB = async () => {
    try {
        await client.connect();

        await database.collection("favorites").createIndex(
            { userId: 1, equipmentId: 1 },
            { unique: true }
        );

        console.log("MongoDB connected successfully!");
        console.log("Database Name:", database.databaseName);

        return database;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

export { client, database };