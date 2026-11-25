
import { z } from "zod";
import { loginUser } from "../services/auth.service.js";

// Validate login request data.
const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required."),
});

/**
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid login information.",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { email, password } = validation.data;

    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/auth/me
 */
export function getCurrentUser(req, res) {
  return res.status(200).json({
    success: true,
    message: "Authenticated user retrieved successfully.",
    data: {
      user: req.user,
    },
  });
}
