import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Create Order
export const createOrder = async (req, res) => {
  console.log("CREATE_ORDER_CALLED_WITH_BODY:", JSON.stringify(req.body, null, 2));
  console.log("CREATE_ORDER_USER:", req.user?._id);
  
  try {
    const { products, address, subtotal, discountAmount, couponCode, deliveryFee, totalAmount, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      console.log("ORDER_ERROR: No products");
      return res.status(400).json({ msg: "No products provided" });
    }

    // Filter and validate product IDs to avoid CastError
    const productIds = products
      .map((p) => p.product)
      .filter(id => mongoose.Types.ObjectId.isValid(id));

    if (productIds.length === 0 && products.length > 0) {
       console.log("ORDER_ERROR: Invalid product IDs");
       return res.status(400).json({ msg: "Invalid product IDs provided (must be valid ObjectIds)" });
    }

    const dbProducts = await Product.find({ _id: { $in: productIds } });
    console.log("DB_PRODUCTS_FOUND_COUNT:", dbProducts.length);

    let calculatedSubtotal = 0;
    const orderItems = [];

    for (const item of products) {
      const dbProduct = dbProducts.find(
        (p) => p._id.toString() === item.product
      );

      if (!dbProduct) {
        console.log("ORDER_ERROR: Product not found:", item.product);
        return res.status(404).json({ msg: `Product ${item.product} not found` });
      }

      if (dbProduct.stock < item.quantity) {
        console.log("ORDER_ERROR: Insufficient stock for:", dbProduct.name);
        return res
          .status(400)
          .json({ msg: `Insufficient stock for ${dbProduct.name}` });
      }

      calculatedSubtotal += dbProduct.price * item.quantity;
      orderItems.push({
        product: dbProduct._id,
        quantity: item.quantity,
        size: item.size,
        price: dbProduct.price,
      });

      // Decrease stock
      dbProduct.stock -= item.quantity;
      await dbProduct.save();
    }

    const calculatedDiscountAmount = (calculatedSubtotal * (subtotal > 0 ? (discountAmount / subtotal) : 0));
    const calculatedTotalAmount = calculatedSubtotal + deliveryFee - calculatedDiscountAmount;

    console.log("PROCEEDING_TO_CREATE_ORDER_IN_DB");
    const order = await Order.create({
      user: req.user._id,
      products: orderItems,
      subtotal: calculatedSubtotal,
      discountAmount: calculatedDiscountAmount,
      couponCode: couponCode || "",
      deliveryFee,
      totalAmount: calculatedTotalAmount,
      address,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "Unpaid" : "Paid"
    });

    console.log("ORDER_CREATED_SUCCESSFULLY:", order._id);
    return res.status(201).json({
      msg: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE_ORDER_ERROR_VERBOSE:", error);
    return res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
};

// ... other functions remain unchanged
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name price image");

    return res.json(orders);
  } catch (error) {
    console.error("GET_USER_ORDERS_ERROR:", error);
    return res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    order.status = status;
    const updatedOrder = await order.save();

    return res.json({
      msg: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("UPDATE_ORDER_ERROR:", error);
    return res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("products.product", "name price image");
    return res.json(orders);
  } catch (error) {
    console.error("GET_ALL_ORDERS_ERROR:", error);
    return res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
};