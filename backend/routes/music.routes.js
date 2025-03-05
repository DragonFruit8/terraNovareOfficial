import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();
const uploadDir = path.resolve("/var/www/terraNovareOfficial/backend/uploads/music");

// ✅ Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  console.log("📁 Creating upload directory:", uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Async version of unlink for better performance
const unlinkAsync = promisify(fs.unlink);

// ✅ Helper function: Sanitize filenames
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_"); // ✅ Replace special characters with "_"
};

// ✅ Multer configuration for uploading files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeFilename = `${Date.now()}_${sanitizeFilename(file.originalname)}`;
    cb(null, safeFilename);
  },
});

const upload = multer({ storage });

// ✅ Get the list of available music files
router.get("/music-list", async (req, res) => {
  try {
    console.log("📂 Checking files in:", uploadDir);
    const files = await fs.promises.readdir(uploadDir);
    res.json({ files });
  } catch (err) {
    console.error("❌ Error reading directory:", err);
    res.status(500).json({ error: "Unable to read music files." });
  }
});

// ✅ Upload music (Admins only)
router.post("/upload-music", verifyToken, isAdmin, upload.single("music"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  console.log("📂 File uploaded successfully:", req.file.path);
  res.json({ message: "File uploaded successfully!", fileUrl: `/uploads/music/${req.file.filename}` });
});

// ✅ Rename a music file (Admins only)
router.put("/rename-music", verifyToken, isAdmin, async (req, res) => {
  let { oldName, newName } = req.body;

  const oldExt = path.extname(oldName);
  if (!path.extname(newName)) {
    newName = `${newName}${oldExt}`;
  }

  newName = sanitizeFilename(newName);

  console.log("📝 Rename Request:", { oldName, newName });

  try {
    const oldPath = path.join(uploadDir, oldName);
    const newPath = path.join(uploadDir, newName);

    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ error: `File not found: ${oldName}` });
    }

    await fs.promises.rename(oldPath, newPath);

    // ✅ Update database
    const result = await pool.query(
      `UPDATE user_files 
       SET file_name = $1, file_path = $2 
       WHERE LOWER(file_name) = LOWER($3) 
       RETURNING *`,
      [newName, `uploads/music/${newName}`, oldName]
    );

    if (result.rowCount === 0) {
      return res.status(500).json({ error: "Database update failed." });
    }

    console.log("✅ Rename Successful:", result.rows);
    res.json({ message: "File renamed successfully!", files: result.rows });

  } catch (error) {
    console.error("❌ Rename Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Delete a music file (Admins only)
router.delete("/delete-music/:filename", verifyToken, isAdmin, async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  console.log("🗑 Deleting:", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found." });
  }

  try {
    await unlinkAsync(filePath);

    // ✅ Remove from database
    const result = await pool.query(
      `DELETE FROM user_files WHERE LOWER(file_name) = LOWER($1) RETURNING *`,
      [filename]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "File deleted from disk, but not found in DB." });
    }

    console.log("✅ Deleted from DB:", result.rows);
    res.json({ message: "File deleted successfully!" });

  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ error: "Failed to delete file." });
  }
});

export default router;
