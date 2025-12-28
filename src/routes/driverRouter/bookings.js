import express from "express";
import {
  getNewBookings,
  acceptBooking,
  cancelBooking,
  completeBooking,
} from "../../controllers/driverController/bookings.js";
import { driverAuth } from "../../middleware.js/driver.auth.js";
const router = express.Router();

router.get("/get-new-bookings", driverAuth, getNewBookings);
router.post("/accept", driverAuth, acceptBooking);
router.post("/cancel", driverAuth, cancelBooking);
router.post("/complete", driverAuth, completeBooking);

export default router;
