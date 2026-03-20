import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  sizes: {
    type: [String],
    required: true
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 0
  },
  image: {
    type: [String], // Array of image URLs
    default: []
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);