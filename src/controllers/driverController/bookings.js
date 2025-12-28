import Bookings from "../../models/Bookings.js";
import TripModel from "../../models/TripDetails.js";
import { alertDriversForNewBookings } from "../../helpers/socket.helper.js";

export const getNewBookings = async (req, res) => {
  try {
    const bookingDet = await Bookings.find({ status: "Approve" });
    return res.status(200).send({
      status: true,
      message: "New Bookings!",
      data: bookingDet || [],
    });
  } catch (error) {
    console.error({ getNewBookings: error });
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

export const acceptBooking = async (req, res) => {
  try {
    const { driverId } = req;
    const { bookingId } = req.body;
    const booking = await Bookings.findById(bookingId);
    if (!booking) {
      return res.status(404).send({
        status: false,
        message: "Booking not found",
      });
    }

    let trip = await TripModel.findOne({ bookingId });
    if (!trip) {
      trip = await TripModel.create({
        bookingId,
        driverId: [driverId],
        status: "Pending",
      });

      return res.status(200).send({
        status: true,
        message: "Driver request accepted",
        data: trip,
      });
    }

    if (trip.status === "full-requested") {
      return res.status(400).send({
        status: false,
        message: "Booking already full",
      });
    }

    if (trip.driverId.includes(driverId)) {
      return res.status(400).send({
        status: false,
        message: "Driver already requested for this booking",
      });
    }
    if (trip.driverId.length >= 3) {
      trip.status = "full-requested";
      await trip.save();

      return res.status(400).send({
        status: false,
        message: "Booking is now full",
      });
    }
    trip.driverId.push(driverId);
    if (trip.driverId.length === 3) {
      trip.status = "full-requested";
    }

    await trip.save();
    alertDriversForNewBookings();
    return res.status(200).send({
      status: true,
      message:
        trip.status === "full-requested"
          ? "Driver added. Booking is now full"
          : "Driver request accepted",
      data: trip,
    });
  } catch (error) {
    console.error({ acceptBooking: error });
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { driverId } = req;
    const { bookingId } = req.body;

    const booking = await Bookings.findById(bookingId);
    if (!booking) {
      return res.status(404).send({
        status: false,
        message: "Booking not found",
      });
    }

    const trip = await TripModel.findOne({ bookingId });
    if (!trip) {
      return res.status(404).send({
        status: false,
        message: "Trip not found",
      });
    }

    // Check if driver exists in trip
    if (!trip.driverId.includes(driverId)) {
      return res.status(400).send({
        status: false,
        message: "Driver not part of this booking",
      });
    }

    // Remove driver
    trip.driverId = trip.driverId.filter(
      (id) => id.toString() !== driverId.toString()
    );

    // Update status if it was full
    if (trip.status === "full-requested" && trip.driverId.length < 3) {
      trip.status = "Pending";
    }

    await trip.save();

    return res.status(200).send({
      status: true,
      message: "Booking request cancelled successfully",
      data: trip,
    });
  } catch (error) {
    console.error({ cancelBooking: error });
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};
