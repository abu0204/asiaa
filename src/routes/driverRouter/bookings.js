import express from "express";
import {
  getNewBookings,
  acceptBooking,
} from "../../controllers/driverController/bookings.js";
import { driverAuth } from "../../middleware.js/driver.auth.js";
const router = express.Router();

router.get("/get-new-bookinga", driverAuth, getNewBookings);
router.post("/accept", driverAuth, acceptBooking);

export default router;
