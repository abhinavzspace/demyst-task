import { Router } from "express";
import { decide } from "../controllers/decide.js";

const router = Router();
router.get("/", decide);

export default router;
