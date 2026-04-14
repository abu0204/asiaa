import mongoose from "mongoose";

const closingFormSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drivers",
        required: true,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookings",
        required: true,
    },
    driverBata: {
        type: Number,
        required: true,
    },
    tollParking: {
        type: Number,
        required: true,
    },
    waittingCharges: {
        type: Number,
        required: true,
    },
    hillsCharges: {
        type: Number,
        required: true,
    },
    statePermitCharges: {
        type: Number,
        required: true,
    },
    otherCharges: {
        type: Number,
        required: true,
    },
}, { collection: "ClosingForm", timestamps: true });

export default mongoose.model("ClosingForm", closingFormSchema);