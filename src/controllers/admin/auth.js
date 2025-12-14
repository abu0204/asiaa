import Admin from "../../models/Admin.js";
import {
  decryptAdminAES,
  genAdminAuthToken,
  generateOTP,
} from "../../helpers/common.js";

export const loginAdmin = async (req, res) => {
  try {
    const { phone, password, otp = "" } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const user = await Admin.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    if (!otp || otp == "") {
      if (!password) {
        return res.status(400).json({
          message: "Password required",
        });
      }

      const decryptedPass = decryptAdminAES(user.password);

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

    const token = genAdminAuthToken(user._id);
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
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
