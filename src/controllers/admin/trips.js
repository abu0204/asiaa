import TripModel from "../../models/TripDetails.js";

export const getAllTrips = async (req, res) => {
  try {
    const trips = await TripModel.find({})
      .populate("bookingId")
      .populate("driverId")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      status: true,
      message: "Trips fetched successfully",
      data: trips,
    });
  } catch (error) {
    console.error({ getAllTrips: error });
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};
