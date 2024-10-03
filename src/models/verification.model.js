import mongoose, { Schema } from "mongoose";

const VerificationSchema = new mongoose.Schema({
  verificationCode: {
    type: String,
    default: "",
  },
  verificationCodeExpiry: {
    type: Date,
    default: () => new Date(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Verifaction = mongoose.model("verification", VerificationSchema);
