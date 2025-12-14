import { Router } from "express";
import userRouters from "./usersRouter/pages.js";
import driverAuthRouter from "./driverRouter/auth.js";
import adminRouter from "./admin/index.js"
const router = Router();

router.use("/", userRouters);

router.use("/v1/users", userRouters);

router.use("/v2/drivers/auth", driverAuthRouter);

router.use("/admin", adminRouter);

export default router;