import Coupon from "../models/Coupon.js";

// Validate Coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid or inactive coupon code" });
    }

    // Check if expired
    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    res.json({
      code: coupon.code,
      discount: coupon.discount,
      message: "Coupon validated successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create Coupon (Admin)
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiryDate } = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discount,
      expiryDate: expiryDate || null
    });

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get All Coupons (Admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete Coupon (Admin)
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
