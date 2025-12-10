import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.AES_SECRET_KEY || "SOME_32_CHAR_SECRET_KEY";

export const encryptAES = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptAES = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
