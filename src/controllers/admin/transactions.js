import WalletModel from "../../models/Wallets.js";
import { errorResponse, successResponse } from "../../helpers/response.helper.js";

export const addPayment = async (req, res) => {
  try {
    const { driverId, amount } = req.body;

    if (!driverId || amount <= 0) {
      return errorResponse(req, res, {
        message: "Invalid driverId or amount",
        code: 400
      });
    }

    const wallet = await WalletModel.findOneAndUpdate(
      { driverId },
      { $inc: { balance: amount } },
      { new: true, upsert: true } 
    );

    return successResponse(req, res, { data: wallet });
  } catch (error) {
    console.error(error);
    return errorResponse(req, res, {
      message: "Internal Server Error",
      code: 500
    });
  }
};

export const deductPayment = async (req, res) => {
  try {
    const { driverId, amount } = req.body;

    if (!driverId || amount <= 0) {
      return errorResponse(req, res, {
        message: "Invalid driverId or amount",
        code: 400
      });
    }

    const wallet = await WalletModel.findOne({ driverId });

    if (!wallet) {
      return errorResponse(req, res, {
        message: "Wallet not found",
        code: 404
      });
    }

    if (wallet.balance < amount) {
      return errorResponse(req, res, {
        message: "Insufficient balance",
        code: 400
      });
    }

    wallet.balance -= amount;
    await wallet.save();

    return successResponse(req, res, { data: wallet });
  } catch (error) {
    console.error(error);
    return errorResponse(req, res, {
      message: "Internal Server Error",
      code: 500
    });
  }
};

