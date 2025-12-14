import { Router } from "express";
import { loginAdmin } from "../../controllers/admin/auth.js";
import adminController from "../../controllers/admin/pages.js";
import { adminAuth } from "../../middleware.js/auth.js";
const router = Router();

router.get("/login", adminController.login);
router.get("/home", adminAuth, adminController.home);
router.get("/drivers", adminAuth, adminController.drivers);
router.get("/bookings", adminAuth, adminController.bookings);
router.get("/booking/:bookingId", adminAuth, adminController.bookingDet);

router.post("/auth/login", loginAdmin);

export default router;
