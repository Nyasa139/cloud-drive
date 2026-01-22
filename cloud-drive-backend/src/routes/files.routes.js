import express from "express";
import { protect } from "../middleware/auth.js";
import { uploadFile } from "../controllers/files.controller.js";

const router = express.Router();

router.post("/upload", protect, uploadFile);

export default router;
