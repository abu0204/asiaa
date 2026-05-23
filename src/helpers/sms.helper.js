import axios from "axios";

// export const sendSMS = async (phone, message) => {
//   try {
//     const url = "https://control.msg91.com/api/v5/otp";

//     const response = await axios.post(
//       url,
//       {
//         mobile: `91${phone}`,
//         otp: message,
//         sender_id: process.env.MSG91_SENDER_ID,
//         template_id: process.env.MSG91_TEMPLATE_ID,
//       },
//       {
//         headers: {
//           accept: "application/json",
//           "content-type": "application/json",
//           authkey: process.env.MSG91_AUTH_KEY,
//         },
//       }
//     );

//     console.log("MSG91 SMS Sent:", response.data);
//     return true;
//   } catch (err) {
//     console.log("MSG91 SMS Error:", err.response?.data || err.message);
//     return false;
//   }
// };



const API_KEY = "732546d893b894b692e3b5ae1c805c3f";
const BASE_URL = "https://site.ping4sms.com/api/smsapi";

export const sendSMS = async (phoneNumber, otp, type) => {
  try {

    let message, templateId;

    if (type === "register") {
      message = "Dear Driver, Welcome to Asiaa travel, Use OTP " + otp + " to complete your registration. This OTP is valid for 5 minutes. Do not share this OTP with anyone.";
      templateId = "1707177813986011815";
    } else if (type === "login") {
      message = "Dear Driver, Use OTP " + otp + " to securely login to Asiaa travel. This OTP is valid for 5 minutes. Please do not share this code.";
      templateId = "1707177813988953095";
    } else if (type === "admin_login") {
      message = "Dear Admin, Use OTP " + otp + " to securely login to Asiaa travel. This OTP is valid for 5 minutes. Please do not share this code.";
      templateId = "1707177909018484683";
    }

    const url =
      `${BASE_URL}?key=${API_KEY}` +
      `&route=2` +
      `&sender=ASIAA` +
      `&number=${phoneNumber}` +
      `&sms=${encodeURIComponent(message)}` +
      `&templateid=${templateId}`;

    const response = await axios.get(url);

    console.log("SMS Response:", response.data);

    return response.data;

  } catch (error) {
    console.log("SMS Error:", error.message);
    throw error;
  }
};

export const sendBulkSMS = async (numbers = [], message) => {
  try {
    const url = "https://control.msg91.com/api/v2/sendsms";

    const payload = {
      sender: process.env.MSG91_SENDER_ID,
      route: 4,
      country: 91,
      sms: [
        {
          message: message,
          to: numbers,
        },
      ],
    };

    const response = await axios.post(url, payload, {
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("Bulk SMS Sent:", response.data);
    return true;
  } catch (err) {
    console.log("Bulk SMS Error:", err.response?.data || err.message);
    return false;
  }
};
