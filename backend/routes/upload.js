import express from "express";
import multer from "multer";
import pool from "../config/db.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// ✅ Ensure files go into `uploads/music/`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve("/var/www/terraNovareOfficial/backend/uploads/music"); 
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // ✅ Keep original filename
  },
});
const upload = multer({ storage });

// ✅ Save uploaded music files to database
router.post("/", upload.array("files"), async (req, res) => {
  try {
    const { user_email } = req.body;

    if (!user_email) {
      return res.status(400).json({ error: "User email is required" });
    }

    // 🔥 Fetch user_id using user_email
    const userQuery = await pool.query(`SELECT user_id FROM users WHERE email = $1`, [user_email]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user_id = userQuery.rows[0].user_id; // ✅ Now we have user_id

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const insertedFiles = [];

    for (const file of req.files) {
      console.log("📂 Attempting to insert into DB:", file.originalname, file.path);

      const newFile = await pool.query(
        `INSERT INTO user_files (user_id, file_name, file_path)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [user_id, file.originalname, `uploads/music/${file.originalname}`] // ✅ Use correct path
      );      

      console.log("✅ Inserted:", newFile.rows[0]);
      insertedFiles.push(newFile.rows[0]);
    }

    res.json({ message: "Files uploaded successfully!", files: insertedFiles });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
