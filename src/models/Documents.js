import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
    },
    car_photo: {
        type: String,
        required: true,
    },
    register_certificate: {
        type: String,
        required: true,
    },
    insurance: {
        type: String,
        required: true,
    },
    license: {
        type: String,
        required: true,
    },
    aadhaar: {
        type: String,
        required: true,
    },
}, { collection: "Documents", timestamps: true });

const Document = mongoose.model("Documents", DocumentSchema);
export default Document;