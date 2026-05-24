import { jwtVerify } from "jose";

const getAuthSecret = (purpose = "api") => {
  const secret =
    purpose === "auth-sync"
      ? process.env.NEXTAUTH_SECRET
      : process.env.API_AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw Object.assign(new Error("Auth secret is not configured"), {
      statusCode: 500,
    });
  }

  return new TextEncoder().encode(secret);
};

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { payload } = await jwtVerify(token, getAuthSecret(), {
      issuer: "learning-progress-tracker",
      audience: "learning-progress-tracker-api",
    });

    if (!payload.user_id || !payload.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    req.user = {
      user_id: payload.user_id,
      email: payload.email,
      name: payload.name,
    };

    next();
  } catch (error) {
    next(
      Object.assign(new Error("Invalid or expired authentication token"), {
        statusCode: 401,
      }),
    );
  }
};

export const requireAuthSync = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { payload } = await jwtVerify(token, getAuthSecret("auth-sync"), {
      issuer: "learning-progress-tracker",
      audience: "learning-progress-tracker-auth-sync",
    });

    if (!payload.email || !payload.name) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    req.authSyncUser = {
      email: payload.email,
      name: payload.name,
      profile_picture: payload.profile_picture || null,
    };

    next();
  } catch (error) {
    next(
      Object.assign(new Error("Invalid or expired authentication token"), {
        statusCode: 401,
      }),
    );
  }
};
