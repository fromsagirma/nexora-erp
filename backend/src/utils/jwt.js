
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Load the root .env file.
const envPath = fileURLToPath(
  new URL("../../../.env", import.meta.url)
);

dotenv.config({ path: envPath });

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from the root .env file.");
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";

const JWT_ISSUER = "nexora-erp";
const JWT_AUDIENCE = "nexora-erp-api";

/**
 * Creates an access token for an authenticated employee.
 */
export function generateAccessToken(userId) {
  return jwt.sign(
    {},
    JWT_SECRET,
    {
      algorithm: "HS256",
      subject: userId,
      expiresIn: JWT_EXPIRES_IN,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );
}

/**
 * Verifies an access token and returns its decoded payload.
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}
