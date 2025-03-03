import express from "express";
const router = express.Router();
import { handleWebDevInquiry } from "../controllers/webdev.controller.js"


router.post("/webdev", handleWebDevInquiry);
router.post("/dj", handleWebDevInquiry);
router.post("/donor-sponsor", );

export default router;