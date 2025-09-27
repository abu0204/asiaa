import mongoose, { Document, Schema } from "mongoose";

const tripSchema = new Schema(
  {
    pickup: { type: String, required: true },
    drop: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    returnDate: { type: Date, default: null },
    travelType: { type: String, required: true },
    vehicleType: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    driverBata: { type: Number, required: true },
    costPerKilometr: { type: Number, required: true },
    totalKiloMeter: { type: Number, required: true },
    totalCost: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: "TripDetails",
  }
);

const TripModel = mongoose.model("TripDetails", tripSchema);
export default TripModel;
