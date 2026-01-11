import { Router } from "express";
import { addPayment } from "../../controllers/admin/transactions";
import { adminAuth } from "../../middleware.js/auth";
const router = Router();

router.post("/add-payment",adminAuth,addPayment)

export default router;