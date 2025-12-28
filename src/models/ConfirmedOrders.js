import mongoose, { Schema } from "mongoose";

const ConfirmedOrdersSchema = new Schema(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Drivers",
      required: true,
      index: true,
    },
    tripId: {
      type: Schema.Types.ObjectId,
      ref: "TripDetails",
      required: true,
      index: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Bookings",
      required: true,
      index: true,
    },
    status: {
      type: String,
      default: "confirmed",
    },
  },
  {
    timestamps: true,
    collection: "ConfirmedOrders",
  }
);

const ConfirmedOrdersModel = mongoose.model(
  "ConfirmedOrders",
  ConfirmedOrdersSchema
);

export default ConfirmedOrdersModel;
