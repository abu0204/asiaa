import express from "express";
import { driverAuth } from "../../middleware.js/driver.auth.js";
import {
  myProfile,
  rideInfo,
} from "../../controllers/driverController/profile.js";
const router = express.Router();

router.get("/me", driverAuth, myProfile);
router.get("/ride-info", driverAuth, rideInfo);

export default router;
