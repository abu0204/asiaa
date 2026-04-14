import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { collection: "Transactions", timestamps: true });

export default mongoose.model("Transaction", transactionSchema);