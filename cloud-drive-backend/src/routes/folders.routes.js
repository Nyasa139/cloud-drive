import express from "express";
import { protect } from "../middleware/auth.js";
import { createFolder } from "../controllers/folders.controller.js";

const router = express.Router();

router.post("/", protect, createFolder);

export default router;
