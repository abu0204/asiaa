import { Router } from "express";
import { adminAuth } from "../../middleware.js/auth.js";
import {
  bookingDet,
  approveBooking,
  assignBooking,
} from "../../controllers/admin/bookings.js";
const router = Router();

router.get("/:bookingId", adminAuth, bookingDet);
router.put("/approve/:bookingId", adminAuth, approveBooking);
router.post("/assign", adminAuth, assignBooking);


export default router;