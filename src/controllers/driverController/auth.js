import Drivers from "../../models/Drivers.js";
import jwt from "jsonwebtoken";
import {
  decryptAES,
  encryptAES,
  genDriverAuthToken,
  generateOTP,
} from "../../helpers/common.js";

export const registerDriver = async (req, res) => {
  try {
    const { name, phone, password, otp = "" } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const user = await Drivers.findOne({ phone });
    if (otp == "" || !otp) {
      if (user && user.isVerified) {
        return res.status(400).json({
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

      // await sendOTP(phone, generatedOtp);

      return res.json({
        success: true,
        message: "OTP sent to your mobile number",
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register first",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }
    if (user.otp != otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpireAt < Date.now()) {
      return res.status(400).json({
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
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginDriver = async (req, res) => {
  try {
    const { phone, password, otp = "" } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const user = await Drivers.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not registered",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "User not verified. Please complete registration.",
      });
    }
    if (!otp || otp == "") {
      if (!password) {
        return res.status(400).json({
          message: "Password required",
        });
      }

      const decryptedPass = decryptAES(user.password);

      if (password !== decryptedPass) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const generatedOtp = generateOTP();

      user.otp = generatedOtp;
      user.otpExpireAt = Date.now() + 1 * 60 * 1000;
      await user.save();

      // await sendOTP(phone, generatedOtp);

      return res.json({
        success: true,
        message: "OTP sent for login",
      });
    }

    if (user.otp != otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpireAt < Date.now()) {
      return res.status(400).json({
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
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
