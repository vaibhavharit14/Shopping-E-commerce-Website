import express from "express";
import { 
  validateCoupon, 
  createCoupon, 
  getAllCoupons, 
  deleteCoupon 
} from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public/User route to validate
router.post("/validate", validateCoupon);

// Admin routes
router.post("/", protect, admin, createCoupon);
router.get("/", protect, admin, getAllCoupons);
router.delete("/:id", protect, admin, deleteCoupon);

export default router;
