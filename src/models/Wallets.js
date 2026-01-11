import mongoose, { Schema } from "mongoose";

const walletSchema = new Schema({
    driverId: {
        type: Schema.Types.ObjectId,
        ref: "Drivers"
    },
    balance: {
        type: Number,
        default: 0
    }
}, { timestamps: true, collection: "Wallets" });

const WalletModel = mongoose.model("Wallets", walletSchema);
export default WalletModel;