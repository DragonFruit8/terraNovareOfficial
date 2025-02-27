import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Allow only 5 requests
    message: "Too many requests, please try again later.",
    handler: (req, res) => {
      console.log(`⛔ Rate limit exceeded for IP: ${req.ip} at ${new Date().toISOString()}`);
      res.status(429).json({ error: "Too many requests, please try again later." });
    },
  });
  

export default limiter;
