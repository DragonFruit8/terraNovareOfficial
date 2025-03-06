import express from "express";
import { handleWebDevInquiry } from "../controllers/webdev.controller.js"
import { handleDJInquiry } from "../controllers/djservice.controller.js"
import { handleSponsorInquiry } from "../controllers/donorsponsor.controller.js"

const router = express.Router();

router.post("/webdev", handleWebDevInquiry);
router.post("/dj", handleDJInquiry);
router.post("/donor-sponsor", handleSponsorInquiry);

export default router;