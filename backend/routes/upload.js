import express from "express";
import multer from "multer";
import sql from "../db.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Set up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.array("files"), async (req, res) => {
  try {
    const { user_email } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const insertedFiles = [];
    for (const file of req.files) {
      const newFile = await sql`
        INSERT INTO user_files (user_email, file_name, file_path)
        VALUES (${user_email}, ${file.originalname}, ${file.path})
        RETURNING *`;
      insertedFiles.push(newFile[0]);
    }

    res.json({ message: "Files uploaded successfully!", files: insertedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
