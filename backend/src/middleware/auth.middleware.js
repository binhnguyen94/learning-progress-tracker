import { jwtVerify } from "jose";

const getAuthSecret = () => {
  const secret = process.env.API_AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw Object.assign(new Error("API auth secret is not configured"), {
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

export const requireInternalAuth = (req, res, next) => {
  const expectedSecret = process.env.INTERNAL_AUTH_SECRET;
  const receivedSecret = req.headers["x-internal-auth-secret"];

  if (!expectedSecret) {
    return next(
      Object.assign(new Error("Internal auth secret is not configured"), {
        statusCode: 500,
      }),
    );
  }

  if (!receivedSecret || receivedSecret !== expectedSecret) {
    return res.status(401).json({
      success: false,
      message: "Internal authentication required",
    });
  }

  next();
};
