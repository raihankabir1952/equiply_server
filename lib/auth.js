
import { betterAuth } from "better-auth/minimal";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client, database } from "../config/db.js";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

export const auth = betterAuth({
  database: mongodbAdapter(database, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: ["customer", "owner", "admin"],
        required: false,
        defaultValue: "customer",
        input: false,
      },

      phoneNumber: {
        type: "string",
        required: false,
        input: true,
      },

      address: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  // Email and Password Authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  // Google Authentication
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  // Base URL
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/auth",

  // Trusted Origins
  trustedOrigins: [
    process.env.CLIENT_URL,
  ],
});
