import { Router } from "express";
import userPageRouters from "./usersRouter/pages.js";
import userRouters from "./usersRouter/index.js";
import driverAuthRouter from "./driverRouter/auth.js";
import driverBookingRouter from "./driverRouter/bookings.js";

import adminRouter from "./admin/index.js";
import adminAuthRouter from "./admin/auth.js";
import adminTripsRouter from "./admin/tripe.js";
import adminDriversRouter from "./admin/drivers.js";
import adminBookingsRouter from "./admin/bookings.js";

const router = Router();

router.use("/", userPageRouters);
router.use("/v1/users", userRouters);

router.use("/v2/drivers/auth", driverAuthRouter);
router.use("/v2/drivers/booking", driverBookingRouter);

router.use("/admin", adminRouter);
router.use("/admin/auth", adminAuthRouter);
router.use("/admin/trips", adminTripsRouter);
router.use("/admin/drivers", adminDriversRouter);
router.use("/admin/bookings", adminBookingsRouter);

export default router;