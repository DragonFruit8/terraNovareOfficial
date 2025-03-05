import multer from "multer";
import path from "path";

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
    const originalName = path.parse(file.originalname).name; // ✅ Extracts the filename without extension
    const extension = path.extname(file.originalname); // ✅ Extracts the extension (e.g., .mp3)

    // ✅ Sanitize filename to remove special characters
    const safeFilename = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");

    // ✅ Ensure the filename stays the same
    cb(null, `${safeFilename}${extension}`);
  },
});

export const upload = multer({ storage });
