import { Router } from "express";
import { loginAdmin, logoutAdmin } from "../../controllers/admin/auth.js";
const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
export default router;
