import Drivers from "../../models/Drivers.js";
import Bookings from "../../models/Bookings.js";
import TripModel from "../../models/TripDetails.js";
import {
  decryptAES,
  encryptAES,
  genDriverAuthToken,
  generateOTP,
} from "../../helpers/common.js";
import { sendSMS } from "../../helpers/sms.helper.js";
import { stat } from "fs";

export const registerDriver = async (req, res) => {
  try {
    const { name, phone, password, otp = "" } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number required" });
    }

    const user = await Drivers.findOne({ phone });
    if (otp == "" || !otp) {
      if (user && user.isVerified) {
        return res.status(400).json({
          status: false,
          message: "User already registered and verified",
        });
      }

      const encryptedPass = encryptAES(password);
      const generatedOtp = generateOTP();

      if (!user) {
        await Drivers.create({
          name,
          phone,
          password: encryptedPass,
          otp: generatedOtp,
          otpExpireAt: Date.now() + 5 * 60 * 1000,
          isVerified: false,
        });
      } else {
        user.otp = generatedOtp;
        user.otpExpireAt = Date.now() + 5 * 60 * 1000;
        await user.save();
      }

      await sendSMS(phone, generatedOtp, "register");

      return res.json({
        success: true,
        message: "OTP sent to your mobile number",
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }
    if (user.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpireAt = null;
    await user.save();

    return res.json({
      success: true,
      message: "User registered successfully",
      driverId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginDriver = async (req, res) => {
  try {
    const { phone, password, otp = "" } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number required" });
    }

    const user = await Drivers.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "User not verified. Please complete registration.",
      });
    }
    if (!otp || otp == "") {
      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password required",
        });
      }

      const decryptedPass = decryptAES(user.password);

      if (password !== decryptedPass) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const generatedOtp = generateOTP();

      user.otp = generatedOtp;
      user.otpExpireAt = Date.now() + 1 * 60 * 1000;
      await user.save();

      await sendSMS(phone, generatedOtp, "login");

      return res.json({
        success: true,
        message: "OTP sent for login",
      });
    }

    if (user.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.otp = null;
    user.otpExpireAt = null;
    await user.save();

    const token = genDriverAuthToken(user._id);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      driverId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
