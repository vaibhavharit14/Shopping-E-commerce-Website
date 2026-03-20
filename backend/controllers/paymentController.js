import razorpay from "../utils/paymentGateway.js";
import Payment from "../models/Payment.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `order_rcptid_${orderId}`
    };

    const order = await razorpay.orders.create(options);

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, status } = req.body;

    const payment = await Payment.create({
      orderId,
      paymentId,
      amount: req.body.amount,
      status
    });

    res.json({ msg: "Payment verified", payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};