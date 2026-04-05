import { Router } from "express";
import { adminAuth } from "../../middleware.js/auth.js";
import {
  bookingDet,
  approveBooking,
  assignBooking,
  getAllTrips,
} from "../../controllers/admin/bookings.js";
const router = Router();

router.get("/get-tripes", adminAuth, getAllTrips);
router.put("/approve/:bookingId", adminAuth, approveBooking);
router.post("/assign", adminAuth, assignBooking);
router.get("/:bookingId", adminAuth, bookingDet);


export default router;