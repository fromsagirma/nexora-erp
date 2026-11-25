
import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

import {
  createEmployeeController,
} from "../controllers/user.controller.js";

const router = Router();

// Create an employee.
// Authentication must run before role authorization.
router.post(
  "/",
  authenticate,
  authorizeRoles("Admin"),
  createEmployeeController
);

export default router;
