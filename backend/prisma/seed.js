
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({ path: "../.env" });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL_APP,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting Nexora ERP database seeding...");

  // 1. Application roles
  const roles = [
    {
      name: "Admin",
      description: "Manages the ERP system and its users.",
    },
    {
      name: "Manager",
      description: "Oversees business operations and reporting.",
    },
    {
      name: "Sales",
      description: "Manages customer and sales operations.",
    },
    {
      name: "Warehouse",
      description: "Manages warehouse and inventory operations.",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }

  console.log("Application roles seeded.");

  // 2. Starter product categories
  const categories = [
    {
      name: "Electronics",
      description: "Electronic equipment and devices.",
    },
    {
      name: "Office Supplies",
      description: "General office materials and supplies.",
    },
    {
      name: "Furniture",
      description: "Office and business furniture.",
    },
    {
      name: "Raw Materials",
      description: "Materials used in production.",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: category,
    });
  }

  console.log("Product categories seeded.");

  // 3. Main warehouse
  await prisma.warehouse.upsert({
    where: { name: "Main Warehouse" },
    update: { location: "Head Office" },
    create: {
      name: "Main Warehouse",
      location: "Head Office",
    },
  });

  console.log("Main warehouse seeded.");
  console.log("Nexora ERP database seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
