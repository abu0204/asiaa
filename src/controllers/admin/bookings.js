import BookingModel from "../../models/Bookings.js";
import { alertDriversForNewBookings } from "../../helpers/socket.helper.js";
import { errorResponse, successResponse } from "../../helpers/response.helper.js";
export const bookingDet = async (req, res) => {
  try {
    const bookingData = await BookingModel.findById(
      req.params.bookingId
    ).lean();

    if (!bookingData) {
      return errorResponse(req, res, {
        status: false,
        message: "Trip not found",
      });
    }

    return successResponse(req, res, { data: bookingData });
  } catch (error) {
    return errorResponse(req, res, {
      status: false,
      message: "Internal Server Error",
      code: 500,
    });
  }
};

export const approveBooking = async (req, res) => {
  try {
    const bookingData = await BookingModel.findById(
      req.params.bookingId
    ).lean();

    if (!bookingData) {
      return errorResponse(req, res, {
        status: false,
        message: "Trip not found",
      });
    }
    const updated = await BookingModel.findOneAndUpdate(
      { _id: req.params.bookingId },
      { $set: { status: "Approve" } },
      { new: true }
    ).lean();
    await alertDriversForNewBookings();
    return successResponse(req, res, { data: updated });
  } catch (error) {
    return errorResponse(req, res, {
      status: false,
      message: "Internal Server Error",
      code: 500,
    });
  }
};
