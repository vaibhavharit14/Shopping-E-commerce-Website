import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);