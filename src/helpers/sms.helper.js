import axios from "axios";

export const sendSMS = async (phone, message) => {
  try {
    const url = "https://control.msg91.com/api/v5/otp";

    const response = await axios.post(
      url,
      {
        mobile: `91${phone}`,
        otp: message,
        sender_id: process.env.MSG91_SENDER_ID,
        template_id: process.env.MSG91_TEMPLATE_ID,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authkey: process.env.MSG91_AUTH_KEY,
        },
      }
    );

    console.log("MSG91 SMS Sent:", response.data);
    return true;
  } catch (err) {
    console.log("MSG91 SMS Error:", err.response?.data || err.message);
    return false;
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
