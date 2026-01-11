import { Router } from "express";
import { adminAuth } from "../../middleware.js/auth.js";
import {
  bookingDet,
  approveBooking,
  assignBooking,
  getAllTrips,
} from "../../controllers/admin/bookings.js";
const router = Router();

router.get("/:bookingId", adminAuth, bookingDet);
router.put("/approve/:bookingId", adminAuth, approveBooking);
router.post("/assign", adminAuth, assignBooking);
router.get("/get-tripes", adminAuth, getAllTrips);


export default router;