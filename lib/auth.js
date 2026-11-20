
import { betterAuth } from "better-auth/minimal";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
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

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
      },
    }),
  ],

  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/auth",

  trustedOrigins: [
    process.env.CLIENT_URL,
  ],
});
