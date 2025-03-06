import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js";
import printRoutes from "./utils/printRoutes.js";
import cartRoutes from "./routes/cart.routes.js";
import webhookRouter from "./routes/webhook.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import musicRoutes from "./routes/music.routes.js";
import verifyRecaptcha from "./routes/verify-recaptcha.js";
import { authenticateUser } from "./middleware/auth.middleware.js";
import { syncAllProducts } from "./services/stripe.service.js";
import uploadRoutes from "./routes/upload.routes.js";
import morgan from "morgan";
import helmet from "helmet";
import checkoutRoutes from "./routes/checkout.routes.js";
import "./config/passport.js";
import path from "path";
import limiter from "./utils/rateLimit.js";
import cors from "cors";
import fs from "fs";
import multer from "multer";

dotenv.config({ path: "./.env" });

const app = express();

// ✅ CORS MUST BE APPLIED BEFORE ALL ROUTES
app.use(cors({
  origin: ["http://localhost:3000", "https://terranovare.tech", "https://www.terranovare.tech"], // ✅ Allow frontend access
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization, Range, Cache-Control", // ✅ Explicitly allow Cache-Control
  credentials: true,
  exposedHeaders: ["Accept-Ranges", "Content-Length", "Content-Range"]
}));

// ✅ Handle Preflight Requests
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://terranovare.tech");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Range, Cache-Control"); // ✅ Allow Cache-Control
  res.setHeader("Access-Control-Expose-Headers", "Accept-Ranges, Content-Length, Content-Range");
  res.status(200).end();
});

const uploadDir = path.resolve("uploads/music");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Created upload directory:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name; // ✅ Extracts filename without extension
    const extension = path.extname(file.originalname); // ✅ Extracts file extension (e.g., .mp3)
    const safeFilename = originalName.replace(/[^a-zA-Z0-9._-]/g, "_"); // ✅ Sanitizes filename
    cb(null, `${safeFilename}${extension}`); // ✅ Keeps original name and extension
  },
});

const upload = multer({ storage });

app.post("/api/upload-music", upload.single("music"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  console.log("✅ Uploaded File:", req.file.filename);
  res.json({
    message: "✅ File uploaded successfully!",
    filename: req.file.filename,
    fileUrl: `/uploads/music/${req.file.filename}`,
  });
});

// ✅ Serve Music Files
app.use("/uploads/music", express.static(uploadDir));
app.use("/api/music", musicRoutes);
app.use("/api/uploads", uploadRoutes);

// ✅ Middleware
app.use(express.json({
	limit: "100mb"
}));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }), webhookRouter);

// ✅ API Routes
app.use("/api", authRoutes, limiter);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/verify-recaptcha", verifyRecaptcha);
app.use("/api/stripe", checkoutRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/user", authenticateUser, userRoutes);
app.use("/api/forms", inquiryRoutes);


// ✅ Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Server is running! Check your console..." });
});

// ✅ Global Error Handling
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ✅ Print all routes when server starts
printRoutes(app);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  syncAllProducts();
});

export default app;
