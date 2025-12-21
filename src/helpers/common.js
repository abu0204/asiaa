import dotenv from "dotenv";
dotenv.config();
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const {
  ADMIN_AES_SECRET_KEY,
  DRIVER_AES_SECRET_KEY,
  ADMIN_JWT_SECRET,
  DRIVER_JWT_SECRET,
} = process.env;

export const encryptAES = (text) => {
  return CryptoJS.AES.encrypt(text, DRIVER_AES_SECRET_KEY).toString();
};

export const decryptAES = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, DRIVER_AES_SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const encryptAdminAES = (text) => {
  return CryptoJS.AES.encrypt(text, ADMIN_AES_SECRET_KEY).toString();
};

export const decryptAdminAES = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, ADMIN_AES_SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const genDriverAuthToken = (driverId) => {
  return jwt.sign({ driverId: driverId }, DRIVER_JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const genAdminAuthToken = (adminId) => {
  return jwt.sign({ adminId: adminId }, ADMIN_JWT_SECRET, {
    expiresIn: "1d",
  });
};
