import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const { ADMIN_JWT_SECRET } = process.env;

export const adminAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies?.adminToken) {
      token = req.cookies.adminToken;
    }
    if (!token) {
      return res.redirect("/admin/login");
    }

    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId).select("_id phone");

    if (!admin) {
      res.clearCookie("adminToken");
      return res.redirect("/admin/login");
    }

    req.adminId = admin._id;
    req.admin = admin;

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    res.clearCookie("adminToken");
    return res.redirect("/admin/login");
  }
};
