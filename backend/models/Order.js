import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 },
      size: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String, default: "" },
  deliveryFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true, default: 'COD' },
  paymentStatus: { type: String, required: true, default: 'Pending' },
  status: { type: String, required: true, default: 'Order Placed' }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);