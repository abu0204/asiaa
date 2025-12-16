import { Router } from "express";
import { adminAuth } from "../../middleware.js/auth.js";
import {
  bookingDet,
  approveBooking,
} from "../../controllers/admin/bookings.js";
const router = Router();

router.get("/:bookingId", adminAuth, bookingDet);
router.put("/approve/:bookingId", adminAuth, approveBooking);

export default router;
