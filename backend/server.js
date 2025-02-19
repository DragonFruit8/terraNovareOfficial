import express from "express";
import multer from "multer";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import webhookRouter from "./routes/webhook.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import stripeRoutes from "./routes/stripe.routes.js"
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { authenticateUser, isAdmin } from "./middleware/auth.middleware.js"; 
import { syncAllProducts } from "./services/stripe.service.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import "./config/passport.js";
dotenv.config();


const app = express();

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

app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// ✅ Apply webhook route separately with raw body parsing
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }), webhookRouter);
// ✅ Register other routes

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/checkout", checkoutRoutes);
// ✅ Secure Admin Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", authenticateUser, userRoutes);
app.use("/api/admin", adminRoutes);

const upload = multer({ storage });

// File upload endpoint
app.post('/upload', upload.array('files'), (req, res) => {
  res.json({ message: 'Files uploaded successfully!', files: req.files });
});
app.use("/api", webhookRouter);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  syncAllProducts();
})
