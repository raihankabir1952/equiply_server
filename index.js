import "dotenv/config";

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import uploadRoutes from "./routes/upload.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectDB from "./config/db.js";

const app = express();
const port = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Better Auth
app.all("/api/auth/*splat", toNodeHandler(auth));

// Body Parser
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Equiply Server is running!");
});

await connectDB();
// Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});