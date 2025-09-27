import { Router } from "express";
import userController from "../../controllers/index.js";
const router = Router();

router.get("/", userController.index);
router.get("/home", userController.home);
router.get("/tariff", userController.tariff);
router.get("/about", userController.about);
router.get("/contact", userController.contact);


router.post("/get-estimation",userController.getEstimation);
router.post("/book-trip",userController.bookATrip)
router.post("/submit-contact-form", userController.contactForm);

export default router;
