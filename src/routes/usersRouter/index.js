import { Router } from "express";
import userController from "../../controllers/index.js";
const router = Router();

router.post("/get-estimation", userController.getEstimation);
router.post("/book-trip", userController.bookATrip);
router.post("/submit-contact-form", userController.contactForm);

export default router;
