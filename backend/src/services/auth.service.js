
import { prisma } from "../config/database.js";
import { comparePassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";

/**
 * Authenticates an employee using email and password.
 */
export async function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    include: {
      role: true,
    },
  });

  if (!user || !user.isActive) {
    throw createAuthenticationError();
  }

  const passwordMatches = await comparePassword(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw createAuthenticationError();
  }

  // Generate a JWT only after successful authentication.
  const accessToken = generateAccessToken(user.id);

  // Never expose the password hash.
  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
    },
    accessToken,
  };
}

function createAuthenticationError() {
  const error = new Error("Invalid email or password.");
  error.status = 401;
  return error;
}
