import express from "express";
import { createOrder, getUserOrders, updateOrderStatus, getAllOrders } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);       
router.get("/", protect, getUserOrders);       
router.get("/all", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrderStatus); 

export default router;