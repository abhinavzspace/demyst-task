import { Router } from "express";
import { outcome } from "../controllers/outcome.js";

const router = Router();
router.get("/:tempBusinessId", outcome);

export default router;
