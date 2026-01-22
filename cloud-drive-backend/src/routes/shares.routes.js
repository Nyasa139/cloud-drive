import express from "express";
import { protect } from "../middleware/auth.js";
import { shareResource } from "../controllers/shares.controller.js";

const router = express.Router();

router.post("/", protect, shareResource);

export default router;
