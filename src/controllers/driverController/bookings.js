import Bookings from "../../models/Bookings.js";
import TripModel from "../../models/TripDetails.js";
import { alertDriversForNewBookings } from "../../helpers/socket.helper.js";
import ConfirmedOrdersModel from "../../models/ConfirmedOrders.js";

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
    const { driverId, driver } = req;
    const { bookingId } = req.body;
    if (!driver.isOnline) {
      return res.status(404).send({
        status: false,
        message: "You're offline right now. Go online to proceed.",
      });
    }
    const booking = await Bookings.findById(bookingId);
    if (!booking) {
      return res.status(404).send({
        status: false,
        message: "Booking not found",
      });
    }

    let trip = await TripModel.findOne({ bookingId });
    if (trip && trip.status === "Completed") {
      return res.status(400).send({
        status: false,
        message: "Trip already completed. You cannot accept this booking.",
      });
    }
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

    if (trip.status === "Assigned") {
      return res.status(400).send({
        status: false,
        message: "Booking already asigned to driver",
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
    console.log({ acceptBooking: error });
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { driverId, driver } = req;
    const { bookingId } = req.body;
    if (!driver.isOnline) {
      return res.status(404).send({
        status: false,
        message: "You're offline right now. Go online to proceed.",
      });
    }
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
    console.log({ cancelBooking: error });
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const completeBooking = async (req, res) => {
  try {
    const { driverId, driver } = req;
    const { bookingId } = req.body;

    if (!driver.isOnline) {
      return res.status(403).send({
        status: false,
        message: "You're offline right now. Go online to proceed.",
      });
    }

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

    if (trip.status === "Completed") {
      return res.status(400).send({
        status: false,
        message: "Trip already completed",
      });
    }

    if (trip.status !== "Assigned") {
      return res.status(400).send({
        status: false,
        message: "Trip is not assigned yet",
      });
    }

    if (!trip.driverId.some((id) => id.toString() === driverId.toString())) {
      return res.status(403).send({
        status: false,
        message: "You are not assigned to this trip",
      });
    }

    trip.status = "Completed";
    await trip.save();

    booking.status = "Completed";
    await booking.save();
    const completedTrip = await ConfirmedOrdersModel.create({
      driverId,
      tripId: trip._id,
      bookingId: bookingId,
    });
    return res.status(200).send({
      status: true,
      message: "Trip completed successfully",
      data: completedTrip,
    });
  } catch (error) {
    console.log({ completeTrip: error });
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};
