
import dotenv from "dotenv";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "node:url";

// 1. Load environment variables from the project root.
const envPath = fileURLToPath(new URL("../../.env", import.meta.url));
dotenv.config({ path: envPath });

// 2. Verify the database configuration.
if (!process.env.DATABASE_URL_APP) {
  throw new Error("DATABASE_URL_APP is missing from the root .env file.");
}

// 3. Connect Prisma using the restricted application database account.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL_APP,
});

const prisma = new PrismaClient({ adapter });

// 4. Create a terminal interface for collecting administrator details.
const rl = createInterface({ input: stdin, output: stdout });

async function main() {
  console.log("\n=== Nexora ERP: Initial Administrator Setup ===\n");

  // 5. Ask for administrator information.
  const fullName = (await rl.question("Full name: ")).trim();
  const email = (await rl.question("Email: ")).trim().toLowerCase();
  const password = await rl.question("Password: ");

  // 6. Validate basic input.
  if (!fullName || fullName.length > 150) {
    throw new Error("Full name is required and must not exceed 150 characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    throw new Error("Please provide a valid email address.");
  }

  if (password.length < 12 || password.length > 72) {
    throw new Error("Password must contain between 12 and 72 characters.");
  }

  // 7. Ensure an initial administrator does not already exist.
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: { name: "Admin" },
    },
  });

  if (existingAdmin) {
    throw new Error(
      "An administrator already exists. Initial bootstrap is not allowed again."
    );
  }

  // 8. Check whether the email is already used.
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("This email address is already registered.");
  }

  // 9. Find the Admin role created by the seed script.
  const adminRole = await prisma.role.findUnique({
    where: { name: "Admin" },
  });

  if (!adminRole) {
    throw new Error("Admin role not found. Run the database seed first.");
  }

  // 10. Hash the password before storing it.
  const passwordHash = await bcrypt.hash(password, 12);

  // 11. Create the administrator account.
  const admin = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      roleId: adminRole.id,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      isActive: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });

  console.log("\nAdministrator created successfully!");
  console.log({
    id: admin.id,
    fullName: admin.fullName,
    email: admin.email,
    role: admin.role.name,
    isActive: admin.isActive,
  });
}

main()
  .catch((error) => {
    console.error("\nAdministrator setup failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
