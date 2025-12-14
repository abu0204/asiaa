import { Router } from "express";
import userController from "../../controllers/index.js";
const router = Router();

router.get("/", userController.index);
router.get("/home", userController.home);
router.get("/tariff", userController.tariff);
router.get("/about", userController.about);
router.get("/contact", userController.contact);
router.get("/terms", userController.terms);
router.get("/privacy", userController.privacy);

export default router;