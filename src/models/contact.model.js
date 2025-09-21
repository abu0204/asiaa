import mongoose, { Document, Schema } from "mongoose";

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "Contacts",
  }
);

const ContactModel = mongoose.model("Contacts", contactSchema);
export default ContactModel;
