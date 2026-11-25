
import { Router } from "express";
import {
  login,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Public route: employees use this endpoint to log in.
router.post("/login", login);

// Protected route: requires a valid access token.
router.get("/me", authenticate, getCurrentUser);

export default router;
