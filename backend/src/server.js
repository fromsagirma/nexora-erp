
import app from "./app.js";
import { prisma } from "./config/database.js";

const PORT = Number(process.env.PORT) || 8000;

let server;

async function startServer() {
  try {
    // Verify the database before accepting HTTP requests.
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    console.log("PostgreSQL connection established.");

    server = app.listen(PORT, () => {
      console.log(`Nexora ERP API running at http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log(`Database: http://localhost:${PORT}/api/health/db`);
    });
  } catch (error) {
    console.error("Failed to start Nexora ERP API:", error);
    await prisma.$disconnect();
    process.exitCode = 1;
  }
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      console.log("Database connection closed.");
      process.exit(0);
    });
  } else {
    await prisma.$disconnect();
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
