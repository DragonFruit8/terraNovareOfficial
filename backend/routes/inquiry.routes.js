import express from "express";
const router = express.Router();
import { handleWebDevInquiry } from "../controllers/webdev.controller.js"
import { handleDJInquiry } from "../controllers/djservice.controller.js"
import { handleSponsorInquiry } from "../controllers/donorsponsor.controller.js"


router.post("/webdev", handleWebDevInquiry);
router.post("/dj", handleDJInquiry);
router.post("/donor-sponsor", handleSponsorInquiry);

export default router;