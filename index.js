
import "dotenv/config";

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();
const port = process.env.PORT || 5000;

// CORS Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Better Auth Handler
app.all("/api/auth/*splat", toNodeHandler(auth));

// Body Parser
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Equiply Server is running!");
});

// Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
