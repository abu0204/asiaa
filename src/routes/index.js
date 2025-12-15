import { Router } from "express";
import userPageRouters from "./usersRouter/pages.js";
import userRouters from "./usersRouter/index.js";
import driverAuthRouter from "./driverRouter/auth.js";
import adminRouter from "./admin/index.js";
const router = Router();

router.use("/", userPageRouters);

router.use("/v1/users", userRouters);

router.use("/v2/drivers/auth", driverAuthRouter);

router.use("/admin", adminRouter);

export default router;
