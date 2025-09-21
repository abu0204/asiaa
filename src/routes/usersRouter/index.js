import { Router } from "express";
import userController from "../../controllers/index.js";
const router = Router();

router.get("/", userController.index);
router.get("/home", userController.home);

router.get("/tariff", userController.tariff);
// router.get("/contact", userController.contact);

router.post("/submit-contact-form", userController.contactForm);

export default router;
