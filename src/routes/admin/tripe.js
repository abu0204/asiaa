import { Router } from "express";
import { getAllTrips } from "../../controllers/admin/trips.js";
import { adminAuth } from "../../middleware.js/auth.js";
const router = Router();

router.get("/get-tripes", adminAuth, getAllTrips);

export default router;
