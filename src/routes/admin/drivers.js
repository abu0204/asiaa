import { Router } from "express";
import { adminAuth } from "../../middleware.js/auth.js";
import { approveDriver, disapproveDriver } from "../../controllers/admin/drivers.js";

const router = Router();

router.post("/approve", adminAuth, approveDriver);
router.post("/disapprove", adminAuth, disapproveDriver);

export default router;