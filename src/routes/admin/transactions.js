import { Router } from "express";
import { addPayment, deductPayment } from "../../controllers/admin/transactions.js";
import { adminAuth } from "../../middleware.js/auth.js";
const router = Router();

router.post("/add-payment", adminAuth, addPayment)
router.post("/deduct-payment", adminAuth, deductPayment)

export default router;