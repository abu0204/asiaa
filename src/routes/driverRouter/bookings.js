import express from "express";
import {
  getNewBookings,
  acceptBooking,
  cancelBooking,
  completeBooking,
  getAcceptedBookings,
  closeRide
} from "../../controllers/driverController/bookings.js";
import { driverAuth } from "../../middleware.js/driver.auth.js";
const router = express.Router();

router.get("/get-new-bookings", driverAuth, getNewBookings);
router.get("/accepted-bookings", driverAuth, getAcceptedBookings);

router.post("/accept", driverAuth, acceptBooking);
router.post("/cancel", driverAuth, cancelBooking);
router.post("/complete", driverAuth, completeBooking);
router.post("/close-ride", driverAuth, closeRide);

export default router;
