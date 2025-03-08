import fs from "fs";
import path from "path";


const uploadDir = path.resolve("uploads/music");

// ✅ Sanitize filename to avoid issues
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
};

// ✅ Rename Music File
export const renameMusic = async (req, res) => {
  try {
    console.log("📩 Incoming Rename Request:", req.body);

    if (!req.body || !req.body.oldName || !req.body.newName) {
      console.error("❌ Missing oldName or newName in request body.");
      return res.status(400).json({ success: false, error: "Both oldName and newName are required." });
    }

    let { oldName, newName } = req.body;

    // ✅ Ensure newName has the ".mp3" extension
    if (!newName.endsWith(".mp3")) {
      newName += ".mp3";
    }

    const oldPath = path.join(uploadDir, oldName);
    const newPath = path.join(uploadDir, newName);

    console.log("📂 Processing Rename:", { oldPath, newPath });

    if (!fs.existsSync(oldPath)) {
      console.error("❌ Rename Error: File not found.");
      return res.status(404).json({ success: false, error: "File not found." });
    }

    fs.renameSync(oldPath, newPath);
    res.json({ success: true, message: `✅ File renamed to "${newName}" successfully.` });
  } catch (error) {
    console.error("❌ Rename Error:", error);
    res.status(500).json({ success: false, error: "Failed to rename the file. Please try again." });
  }
};

// ✅ Delete Music File
export const deleteMusic = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required." });
    }

    const filePath = path.join(uploadDir, decodeURIComponent(filename));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found." });
    }

    fs.unlinkSync(filePath);
    res.status(200).json({ message: `✅ "${filename}" deleted successfully.` });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ error: "Failed to delete the file. Please try again." });
  }
};

// ✅ Get List of Music Files
export const getMusicList = async (req, res) => {
  try {
    console.log("📂 Fetching music files from:", uploadDir);
    const files = await fs.promises.readdir(uploadDir);
    const musicFiles = files.filter(file => file.match(/\.(mp3|wav|ogg|flac)$/i)); // ✅ Supports more formats

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    res.json({ files: musicFiles });
  } catch (err) {
    console.error("❌ Error reading directory:", err);
    res.status(500).json({ error: "Unable to read music files." });
  }
};
