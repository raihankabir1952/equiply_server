import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const getMe = (req, res) => {
  return res.status(200).json({
    message: "User profile fetched successfully!",
    user: req.user,
  });
};

//update user profile
export const updateMe = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name && !image) {
      return res.status(400).json({
        message: "Please provide name or image!",
      });
    }

    const updatedUser = await auth.api.updateUser({
      body: {
        name,
        image,
      },
      headers: fromNodeHeaders(req.headers),
    });

    return res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return res.status(500).json({
      message: "Profile update failed!",
    });
  }
};
