
import { verifyAccessToken } from "../utils/jwt.js";
import { prisma } from "../config/database.js";

/**
 * Protects routes by requiring a valid access token.
 */
export async function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  // 1. Check whether the Authorization header exists.
  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please provide an access token.",
    });
  }

  // 2. Extract the Bearer token.
  const match = authorization.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format. Use Bearer <token>.",
    });
  }

  const token = match[1];

  // 3. Verify the token.
  let decoded;

  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Access token has expired. Please log in again."
          : "Invalid access token. Please log in again.",
    });
  }

  // 4. Ensure the token identifies an employee.
  if (typeof decoded.sub !== "string") {
    return res.status(401).json({
      success: false,
      message: "Invalid access token.",
    });
  }

  // 5. Retrieve the employee and current role from PostgreSQL.
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
      include: {
        role: true,
      },
    });

    // Reject deleted or disabled accounts.
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account is unavailable. Please contact an administrator.",
      });
    }

    // 6. Attach safe employee information to the request.
    req.user = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
    };

    // 7. Allow the request to continue.
    return next();
  } catch (error) {
    return next(error);
  }
}
