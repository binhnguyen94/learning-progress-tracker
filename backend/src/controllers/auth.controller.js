import { upsertGoogleUser } from "../services/auth.service.js";

export const syncGoogleUserController = async (req, res, next) => {
  try {
    const { email, name, profile_picture } = req.authSyncUser || {};

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "email and name are required",
      });
    }

    const user = await upsertGoogleUser({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      profile_picture: profile_picture || null,
    });

    res.status(200).json({
      success: true,
      data: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error) {
    next(error);
  }
};
