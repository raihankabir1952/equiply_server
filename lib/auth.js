
import { betterAuth } from "better-auth/minimal";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db("equiply");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

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

  // Trusted Origins
  trustedOrigins: [
    process.env.CLIENT_URL,
  ],
});
