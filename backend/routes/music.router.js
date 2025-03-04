import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { verifyAdmin } from "../middleware/auth.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads/music");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// 🔐 Protect this route so ONLY admins can upload music
router.post("/upload-music", verifyAdmin, upload.single("music"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  res.json({ message: "File uploaded successfully!", fileUrl: `/uploads/music/${req.file.filename}` });
});

// 🔐 Protect this route so ONLY admins can delete files
router.delete("/delete-music/:filename", verifyAdmin, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found." });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete file." });
    }
    res.json({ message: "File deleted successfully!" });
  });
});

// 🔐 Protect this route so ONLY admins can rename files
router.put("/rename-music", verifyAdmin, (req, res) => {
  const { oldName, newName } = req.body;
  const oldPath = path.join(uploadDir, oldName);
  const newPath = path.join(uploadDir, newName);

  if (!fs.existsSync(oldPath)) {
    return res.status(404).json({ error: "Original file not found." });
  }

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to rename file." });
    }
    res.json({ message: "File renamed successfully!" });
  });
});

// ✅ Public Route - Everyone can see the music list
router.get("/music-list", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read music files." });
    }
    res.json({ files });
  });
});

export default router;
