import express from "express";
import path from "path";
import fs from "fs";
import { renameMusic, deleteMusic, getMusicList } from "../controllers/music.controller.js";


const router = express.Router();
const uploadDir = path.resolve("uploads/music");

// ✅ Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.get("/music-list", getMusicList);
router.put("/rename-music", renameMusic);
router.delete("/delete-music/:filename", deleteMusic);

export default router;
