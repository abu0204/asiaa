import express from "express";
import {
  loginDriver,
  registerDriver,
} from "../../controllers/driverController/auth.js";
const router = express.Router();

router.post("/register", registerDriver);
router.post("/login", loginDriver);

export default router;
