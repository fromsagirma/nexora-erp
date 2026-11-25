
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Converts a plain-text password into a bcrypt hash.
 */
export async function hashPassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    throw new Error("Password must contain at least 8 characters.");
  }

  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Checks whether a plain-text password matches a stored hash.
 */
export async function comparePassword(password, passwordHash) {
  if (
    typeof password !== "string" ||
    typeof passwordHash !== "string"
  ) {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}
