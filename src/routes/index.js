import { Router } from "express";
import userRouters from "./usersRouter/index.js";
const router = Router();

router.use("/v1/users", userRouters);
router.use("/", userRouters);


export default router;