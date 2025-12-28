import BookingModel from "../../models/Bookings.js";
import TripModel from "../../models/TripDetails.js";
import { alertDriversForNewBookings } from "../../helpers/socket.helper.js";
import {
  errorResponse,
  successResponse,
} from "../../helpers/response.helper.js";
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

export const assignBooking = async (req, res) => {
  try {
    const { tripId, driverId } = req.body;

    const tripData = await TripModel.findById({ _id: tripId }).lean();
    if (!tripData) {
      return errorResponse(req, res, {
        status: false,
        message: "Trip not found",
      });
    }

    const bookingData = await BookingModel.findById({
      _id: tripData.bookingId,
    }).lean();

    if (!bookingData) {
      return errorResponse(req, res, {
        status: false,
        message: "Booking not found",
      });
    }

    const updatedBooking = await BookingModel.findOneAndUpdate(
      { _id: tripData.bookingId },
      { $set: { status: "Assigned" } },
      { new: true }
    ).lean();

    const updatedTrip = await TripModel.findOneAndUpdate(
      { _id: tripData._id },
      { $set: { status: "Assigned", driverId: [driverId] } },
      { new: true }
    ).lean();
    await alertDriversForNewBookings();
    return successResponse(req, res, { data: { updatedBooking, updatedTrip } });
  } catch (error) {
    console.log({ error });
    return errorResponse(req, res, {
      status: false,
      message: "Internal Server Error",
      code: 500,
    });
  }
};
