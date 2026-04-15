import DriversModel from "../../models/Drivers.js";
import ConfirmedOrdersModel from "../../models/ConfirmedOrders.js";
import WalletsModel from "../../models/Wallets.js";
import TransactionsModel from "../../models/Transactions.js";
import DocumentsModel from "../../models/Documents.js";
import cloudinary from "../../helpers/cloudinary.js";

const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("Invalid file upload"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};

export const myProfile = async (req, res) => {
  try {
    const { driverId } = req;

    if (!driverId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access",
      });
    }

    const userDet = await DriversModel.findById(driverId).select(
      "name phone isVerified isOnline"
    );

    if (!userDet) {
      return res.status(404).json({
        status: false,
        message: "Driver not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Profile fetched successfully",
      data: userDet,
    });
  } catch (error) {
    console.error("myProfile error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const rideInfo = async (req, res) => {
  try {
    const { driverId } = req;

    if (!driverId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access",
      });
    }

    const userDet = await DriversModel.findById(driverId);
    if (!userDet) {
      return res.status(404).json({
        status: false,
        message: "Driver not found",
      });
    }
    const rideDet = await ConfirmedOrdersModel.find({ driverId });
    return res.status(200).json({
      status: true,
      message: "Bookings fetched successfully",
      data: rideDet,
    });
  } catch (error) {
    console.error("ride info error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const configStatus = async (req, res) => {
  try {
    const { driverId } = req;

    if (!driverId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access",
      });
    }

    const userDet = await DriversModel.findById(driverId);
    if (!userDet) {
      return res.status(404).json({
        status: false,
        message: "Driver not found",
      });
    }
    userDet.isOnline = !userDet.isOnline;
    await userDet.save();

    return res.status(200).json({
      status: true,
      message: `Driver is now ${userDet.isOnline ? "Online" : "Offline"}`,
      isOnline: userDet.isOnline,
    });
  } catch (error) {
    console.error("configStatus error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const balance = async (req, res) => {
  try {
    const { driverId } = req;
    console.log({ driverId });

    if (!driverId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access",
      });
    };
    const userDet = await WalletsModel.findOne({ driverId });
    return res.status(200).json({
      status: true,
      message: "Balance fetched successfully",
      balance: userDet?.balance || 0,
    });
  } catch (error) {
    console.error("balance error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      balance: 0
    });
  }
};

export const transactions = async (req, res) => {
  try {
    const { driverId } = req;
    const txns = await TransactionsModel.find({ driverId });
    return res.status(200).json({
      status: true,
      message: "Transactions fetched successfully",
      data: txns,
    });
  } catch (error) {
    console.error("transactions error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: []
    });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const { driverId } = req;
    const files = req.files || {};
    const { car_photo = [], register_certificate = [], insurance = [], license = [], aadhaar = [] } = files;

    if (!driverId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access",
      });
    }

    const userDet = await DriversModel.findById(driverId);
    if (!userDet) {
      return res.status(404).json({
        status: false,
        message: "Driver not found",
      });
    }

    const existingDocs = await DocumentsModel.findOne({ driverId });
    if (existingDocs) {
      return res.status(400).json({
        status: false,
        message: "Documents already uploaded",
      });
    }

    const requiredFiles = {
      car_photo: car_photo[0],
      register_certificate: register_certificate[0],
      insurance: insurance[0],
      license: license[0],
      aadhaar: aadhaar[0],
    };

    for (const [field, file] of Object.entries(requiredFiles)) {
      if (!file) {
        return res.status(400).json({
          status: false,
          message: `${field} is required`,
        });
      }
    }

    const uploadFolder = `driver-documents/${driverId}`;
    const [carPhotoUrl, rcUrl, insuranceUrl, licenseUrl, aadhaarUrl] = await Promise.all([
      uploadToCloudinary(requiredFiles.car_photo, uploadFolder),
      uploadToCloudinary(requiredFiles.register_certificate, uploadFolder),
      uploadToCloudinary(requiredFiles.insurance, uploadFolder),
      uploadToCloudinary(requiredFiles.license, uploadFolder),
      uploadToCloudinary(requiredFiles.aadhaar, uploadFolder),
    ]);

    const newDocument = new DocumentsModel({
      driverId,
      car_photo: carPhotoUrl,
      register_certificate: rcUrl,
      insurance: insuranceUrl,
      license: licenseUrl,
      aadhaar: aadhaarUrl
    });
    await newDocument.save();
    return res.status(200).json({
      status: true,
      message: "Documents uploaded successfully",
      data: {
        car_photo: carPhotoUrl,
        register_certificate: rcUrl,
        insurance: insuranceUrl,
        license: licenseUrl,
        aadhaar: aadhaarUrl,
      },
    });
  } catch (error) {
    console.error("uploadDocuments error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};