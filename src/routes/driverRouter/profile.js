import express from "express";
import { driverAuth } from "../../middleware.js/driver.auth.js";
import { uploadDriverDocuments, uploadProfilePicture } from "../../helpers/multer.js";
import {
  myProfile,
  rideInfo,
  configStatus,
  balance,
  transactions,
  uploadDocuments,
  updateProfile,
  accountDelete
} from "../../controllers/driverController/profile.js";
const router = express.Router();

router.post("/update-profile",   driverAuth, uploadProfilePicture, updateProfile);
router.get("/me", driverAuth, myProfile);
router.get("/ride-info", driverAuth, rideInfo);
router.post("/config-status", driverAuth, configStatus);
router.get("/balance", driverAuth, balance);
router.get("/tnx", driverAuth, transactions);
router.post("/upload-documents", driverAuth, uploadDriverDocuments, uploadDocuments);
router.post("/account-delete", driverAuth, accountDelete);



export default router;
