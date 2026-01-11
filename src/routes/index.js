import { Router } from "express";
import userPageRouters from "./usersRouter/pages.js";
import userRouters from "./usersRouter/index.js";
import driverAuthRouter from "./driverRouter/auth.js";
import driverProfileRouter from "./driverRouter/profile.js";

import driverBookingRouter from "./driverRouter/bookings.js";

import adminRouter from "./admin/index.js";
import adminAuthRouter from "./admin/auth.js";
import adminBookingsRouter from "./admin/bookings.js";
import adminTransactionsRouter from "./admin/transactions.js";


const router = Router();

router.use("/", userPageRouters);
router.use("/v1/users", userRouters);

router.use("/v2/drivers/auth", driverAuthRouter);
router.use("/v2/drivers/profile", driverProfileRouter);
router.use("/v2/drivers/booking", driverBookingRouter);

router.use("/admin", adminRouter);
router.use("/admin/auth", adminAuthRouter);
router.use("/admin/bookings", adminBookingsRouter);
router.use("/admin/transactions", adminTransactionsRouter);


export default router;