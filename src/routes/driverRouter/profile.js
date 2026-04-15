import express from "express";
import { driverAuth } from "../../middleware.js/driver.auth.js";
import { uploadDriverDocuments } from "../../helpers/multer.js";
import {
  myProfile,
  rideInfo,
  configStatus,
  balance,
  transactions,
  uploadDocuments
} from "../../controllers/driverController/profile.js";
const router = express.Router();

router.get("/me", driverAuth, myProfile);
router.get("/ride-info", driverAuth, rideInfo);
router.post("/config-status", driverAuth, configStatus);
router.get("/balance", driverAuth, balance);
router.get("/tnx", driverAuth, transactions);
router.post("/upload-documents", driverAuth, uploadDriverDocuments, uploadDocuments);



export default router;
