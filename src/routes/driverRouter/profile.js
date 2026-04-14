import express from "express";
import { driverAuth } from "../../middleware.js/driver.auth.js";
import {
  myProfile,
  rideInfo,
  configStatus,
  balance,
  transactions,
} from "../../controllers/driverController/profile.js";
const router = express.Router();

router.get("/me", driverAuth, myProfile);
router.get("/ride-info", driverAuth, rideInfo);
router.post("/config-status", driverAuth, configStatus);
router.get("/balance", driverAuth, balance);
router.get("/tnx", driverAuth, transactions);



export default router;
