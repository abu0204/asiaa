import Drivers from "../models/Drivers.js";
import jwt from "jsonwebtoken";
import { decryptAES, encryptAES, generateOTP } from "../../helpers/common.js";

export const registerDriver = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const exist = await Drivers.findOne({ phone });
    if (exist) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const otp = generateOTP();
    const otpExpireAt = Date.now() + 5 * 60 * 1000;

    await Drivers.create({
      name,
      phone,
      password: encryptAES(password),
      otp: encryptAES(otp),
      otpExpireAt,
      isVerified: false,
    });

    console.log("OTP =>", otp);

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const verifyDriverOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const driver = await Drivers.findOne({ phone });
    if (!driver) return res.status(404).json({ message: "User not found" });

    const storedOtp = decryptAES(driver.otp);

    if (storedOtp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (driver.otpExpireAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    driver.isVerified = true;
    driver.otp = null;
    driver.otpExpireAt = null;
    await driver.save();

    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const loginDriver = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const driver = await Drivers.findOne({ phone });
    if (!driver) return res.status(404).json({ message: "User not found" });

    if (!driver.isVerified)
      return res.status(403).json({ message: "User not verified" });

    const decryptedPassword = decryptAES(driver.password);

    if (decryptedPassword !== password)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: driver._id },
      process.env.JWT_SECRET || "JWT_SECRET_KEY",
      { expiresIn: "30d" }
    );

    return res.json({
      message: "Login successful",
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        phone: driver.phone,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};