import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpireAt: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isAccountDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "Drivers",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
driverSchema.virtual("Documents", {
  ref: "Documents",
  localField: "_id",
  foreignField: "driverId",
});
export default mongoose.model("Drivers", driverSchema);
