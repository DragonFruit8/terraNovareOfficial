import express from "express";
import multer from "multer";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js";
import printRoutes from "./utils/printRoutes.js"; // ✅ Import the route printer
import cartRoutes from "./routes/cart.routes.js";
import webhookRouter from "./routes/webhook.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import stripeRoutes from "./routes/stripe.routes.js"
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import musicRoutes from "./routes/music.router.js";
import verifyRecaptcha from "./routes/verify-recaptcha.js";
import { authenticateUser } from "./middleware/auth.middleware.js"; 
import { syncAllProducts } from "./services/stripe.service.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import checkoutRoutes from "./routes/checkout.routes.js";
import "./config/passport.js";
dotenv.config({path: "./.env"});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const isProduction = process.env.NODE_ENV === "production";
const corsOptions = {
  origin: ["http://localhost:3000","https://terranovare.tech", "http://terranovare.tech"], // Allow both HTTP & HTTPS
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// ✅ Use `express.json()` for all routes EXCEPT webhook
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    next(); // Skip JSON parsing for webhooks
  } else {
    express.json()(req, res, next); // Parse JSON for other routes
  }
});


// app.use((req, res, next) => {
//   if (req.headers["x-forwarded-proto"] !== "https") {
//     return res.redirect("https://" + req.headers.host + req.url);
//   }
//   next();
// });

// ✅ Print all routes when server starts

app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//  Change to "https://terranovare.tech"
app.use(cors(corsOptions));
app.use(express.json());
// app.disable("x-powered-by");
app.options("*", cors(corsOptions)); // ✅ Handle preflight requests globally
// ✅ Tell Express to trust proxy headers
app.set("trust proxy", 1);

app.use(cookieParser());

// ✅ Apply webhook route separately with raw body parsing
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }), webhookRouter);
// ✅ Register other routes
// Music API
app.use("/uploads/music", express.static(path.join(__dirname, "uploads/music")));
app.use("/api/music", musicRoutes);
app.use("/api", authRoutes);
// ✅ Secure Admin Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/verify-recaptcha", verifyRecaptcha);

// ✅ User Routes
app.use("/api/stripe", checkoutRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/user", authenticateUser, userRoutes);
app.use("/api/forms", inquiryRoutes)
const upload = multer({ storage });

// File upload endpoint
app.post('/upload', upload.array('files'), (req, res) => {
  res.json({ message: 'Files uploaded successfully!', files: req.files });
});
app.use("/api", webhookRouter);

app.use((req, res, next) => {
  console.time(`⏳ Request to ${req.originalUrl}`);
  res.on("finish", () => console.timeEnd(`⏳ Request to ${req.originalUrl}`));
  next();
});


app.get('/api/health', (req, res) =>{
 console.log(printRoutes(app));
	res.status(200).json({status: 'Server is running! Check you Console...'})
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  // console.log(`🚀 Server running on port ${PORT}`);
  syncAllProducts();
})

export default app; 