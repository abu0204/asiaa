import TripModel from "../../models/TripDetails.js";

export const removeDriverFromBooking = async (req, res) => {
  try {
    const { bookingId, driverId } = req.body;

    // 1️⃣ Find trip details
    const trip = await TripModel.findOne({ bookingId });

    if (!trip) {
      return res.status(404).send({
        status: false,
        message: "Trip not found",
      });
    }

    // 2️⃣ Check driver exists in array
    if (!trip.driverId.includes(driverId)) {
      return res.status(400).send({
        status: false,
        message: "Driver not found in this booking",
      });
    }

    trip.driverId = trip.driverId.filter(
      (id) => id.toString() !== driverId.toString()
    );

    if (trip.driverId.length < 3) {
      trip.status = "Pending";
    }

    if (trip.driverId.length === 0) {
      trip.status = "Pending";
    }

    await trip.save();

    return res.status(200).send({
      status: true,
      message: "Driver removed successfully",
      data: trip,
    });
  } catch (error) {
    console.error({ removeDriverFromBooking: error });
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};
