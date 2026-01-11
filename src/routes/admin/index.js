import { Router } from "express";
import adminController from "../../controllers/admin/pages.js";
import { adminAuth } from "../../middleware.js/auth.js";
const router = Router();

router.get("/", adminController.redirectPage);
router.get("/login", adminController.login);
router.get("/home", adminAuth, adminController.home);
router.get("/drivers", adminAuth, adminController.drivers);
router.get("/bookings", adminAuth, adminController.bookings);
router.get("/trips", adminAuth, adminController.trips);


export default router;
