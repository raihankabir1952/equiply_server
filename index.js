import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("Equiply Server is running!");
});

// Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});