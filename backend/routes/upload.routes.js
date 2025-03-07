import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";


const router = express.Router();
const uploadDir = path.resolve("uploads/music");

// ✅ Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer to Keep Original Filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const safeFilename = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${safeFilename}${extension}`);
  },
});

const upload = multer({ 
	storage,
	limits: { fileSize: 100 * 1024 * 1024},
 });

// ✅ Upload Route with Proper Response
router.post("/upload-music", upload.single("music"), (req, res) => {
  if (!req.file) {
    logger.error("❌ Upload Failed: No file received.");
    return res.status(400).json({ success: false, error: "No file uploaded." });
  }

  logger.info("✅ Uploaded File:", req.file.filename);
  res.status(200).json({
    success: true, // ✅ Ensures frontend knows it's a success
    message: "✅ File uploaded successfully!",
    filename: req.file.filename,
    fileUrl: `/uploads/music/${req.file.filename}`,
  });
});

export default router;
