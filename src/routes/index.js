import { Router } from "express";
import userRouters from "./usersRouter/index.js";
import driverAuthRouter from "./driverRouter/auth.js";
const router = Router();

router.use("/v1/users", userRouters);

router.use("/v2/drivers/auth", driverAuthRouter);

export default router;