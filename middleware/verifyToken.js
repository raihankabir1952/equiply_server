
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

const verifyToken = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        message: "Unauthorized! Please login first.",
      });
    }

    req.user = session.user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(500).json({
      message: "Authentication failed!",
    });
  }
};

export default verifyToken;
