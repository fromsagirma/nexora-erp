
import { z } from "zod";
import { createEmployee } from "../services/user.service.js";

// Validate employee creation requests.
const createEmployeeSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must contain at least 2 characters.")
    .max(150, "Full name cannot exceed 150 characters."),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(255, "Email cannot exceed 255 characters.")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(12, "Password must contain at least 12 characters.")
    .refine(
      (value) => Buffer.byteLength(value, "utf8") <= 72,
      "Password cannot exceed 72 bytes."
    ),

  role: z.enum(["Admin", "Manager", "Sales", "Warehouse"], {
    error: "Role must be Admin, Manager, Sales, or Warehouse.",
  }),
});

/**
 * POST /api/users
 * Creates a new employee.
 * Accessible only to administrators through the protected route.
 */
export async function createEmployeeController(req, res, next) {
  try {
    // 1. Validate incoming request data.
    const validation = createEmployeeSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee information.",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // 2. Call the service to create the employee.
    const employee = await createEmployee(validation.data);

    // 3. Return the newly created employee.
    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      data: employee,
    });
  } catch (error) {
    return next(error);
  }
}
