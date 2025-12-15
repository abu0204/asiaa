import mongoose from "mongoose";

const tripDetailsSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drivers",
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookings",
    },
    status: {
      type: String,
      default: "Approved",
    },
  },
  { timestamps: true, collection: "TripDetails" }
);

const TripModel = mongoose.model("TripDetails", tripDetailsSchema);
export default TripModel;
