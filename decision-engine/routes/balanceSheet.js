import { Router } from "express";
import { balanceSheet } from "../controllers/balanceSheet.js";

const router = Router();
router.get("/", balanceSheet);

export default router;
