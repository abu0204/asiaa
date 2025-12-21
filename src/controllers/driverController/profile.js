import DriversModel from "../../models/Drivers.js";
import ConfirmedOrdersModel from "../../models/ConfirmedOrders.js";

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
    const rideDet = await ConfirmedOrdersModel.findById(driverId);
    return res.status(200).json({
      status: true,
      message: "Profile fetched successfully",
      data: rideDet,
    });
  } catch (error) {
    console.error("myProfile error:", error);
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
