import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import Drivers from "../models/Drivers.js";

const { DRIVER_JWT_SECRET } = process.env;

export const driverAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers["driver-auth-token"]) {
      token = req.headers["driver-auth-token"];
    }
    if (!token) {
      return res
        .status(401)
        .send({ status: false, message: "Token Not Found" });
    }

    const decoded = jwt.verify(token, DRIVER_JWT_SECRET);
    const driver = await Drivers.findById(decoded.adminId);

    if (!driver) {
      return res
        .status(401)
        .send({ status: false, message: "Invalid Driver Details" });
    }

    req.driverId = driver._id;
    req.driver = driver;

    next();
  } catch (error) {
    console.error("Drivers Auth Error:", error.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};
