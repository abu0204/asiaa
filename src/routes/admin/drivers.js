import { Router } from "express";
import { adminAuth } from "../../middleware.js/auth.js";
import { removeDriverFromBooking } from "../../controllers/admin/drivers.js";
const router = Router();

router.post("/remove-driver", adminAuth, removeDriverFromBooking);

export default router;
