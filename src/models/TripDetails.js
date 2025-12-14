import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    pickup: { type: String },
    drop: { type: String },
    dateTime: { type: String },
    returnDateTime: { type: String },
    travelType: { type: String },
    vehicleType: { type: String },
    days: { type: String },
    distanceVal: { type: String },
    kilometerPerVal: { type: String },
    driverBata: { type: String },
    fareVal: { type: String },
    totalVal: { type: String },
  },
  { timestamps: true, collection: "TripDetails" }
);

const TripModel = mongoose.model("TripDetails", BookingSchema);
export default TripModel;
