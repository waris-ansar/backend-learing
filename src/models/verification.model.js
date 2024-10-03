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
  userId: {
    type: mongoose.ObjectId,
  },
});

export const Verifaction = mongoose.model("verification", VerificationSchema);
