import express from "express";
import {
  loginDriver,
  registerDriver,
  verifyDriverOTP,
} from "../../controllers/driverController/auth";

const router = express.Router();

router.post("/register", registerDriver);
router.post("/verify-otp", verifyDriverOTP);
router.post("/login", loginDriver);

export default router;
