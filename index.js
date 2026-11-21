import "dotenv/config";

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import uploadRoutes from "./routes/upload.routes.js";
import userRoutes from "./routes/user.routes.js";
import { connectToMongoDB } from "./config/db.js";
import equipmentRoutes from "./routes/equipment.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import rentalRoutes from "./routes/rental.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { handleStripeWebhook } from "./controllers/payment.controller.js";
import verifyToken from "./middleware/verifyToken.js"
import analyticsRoutes from "./routes/analytics.routes.js";
import { completeExpiredRentals } from "./controllers/cron.controller.js";

const app = express();
//const port = process.env.PORT || 5000;  COFD

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Better Auth
app.all("/auth/*splat", toNodeHandler(auth));

app.post(
  "/payments/webhook",
  express.raw({
    type: "application/json"
  }),
  handleStripeWebhook
);

// Body Parser
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/favorites", favoriteRoutes);
app.use('/rentals', rentalRoutes);
app.use("/payments", paymentRoutes);
app.use("/analytics", analyticsRoutes);

app.get("/cron-test", (req, res) => {
  res.status(200).json({
    message: "Cron route is working!",
  });
});
app.get("/cron/complete-rentals", completeExpiredRentals);

// Test Route
app.get("/", (req, res) => {
  res.send("Equiply Server is running!");
});
// Test JWT 
app.get("/jwt-test", verifyToken, (req, res) => {
  res.status(200).json({
    message: "JWT authentication successful!",
    user: req.user,
  });
});

await connectToMongoDB();

// Server 
//comment out for deployment
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

//extra line for deployment
export default app;