
import { prisma } from "../config/database.js";
import { hashPassword } from "../utils/password.js";

/**
 * Creates a new employee.
 *
 * Only authorized administrators should be able to
 * reach the controller that calls this service.
 */
export async function createEmployee(data) {
  const fullName = data.fullName.trim();
  const email = data.email.trim().toLowerCase();

  // 1. Check whether the email is already registered.
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    const error = new Error("An employee with this email already exists.");
    error.status = 409;
    throw error;
  }

  // 2. Verify that the requested role exists.
  const role = await prisma.role.findUnique({
    where: { name: data.role },
    select: { id: true, name: true },
  });

  if (!role) {
    const error = new Error("The requested role does not exist.");
    error.status = 400;
    throw error;
  }

  // 3. Hash the password before storing it.
  const passwordHash = await hashPassword(data.password);

  // 4. Create the employee.
  try {
    const employee = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        roleId: role.id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    // 5. Return only safe employee information.
    return {
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      isActive: employee.isActive,
      role: employee.role.name,
      createdAt: employee.createdAt,
    };
  } catch (error) {
    // Handle a duplicate email created by a concurrent request.
    if (error.code === "P2002") {
      const conflictError = new Error(
        "An employee with this email already exists."
      );
      conflictError.status = 409;
      throw conflictError;
    }

    throw error;
  }
}
