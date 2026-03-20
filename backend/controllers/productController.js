import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

export const addProduct = async (req, res) => {
  try {
    // Basic logging to console
    console.log("ADD PRODUCT REQUEST RECEIVED");
    
    const { name, description, price, category, subCategory, sizes, bestSeller, stock, image } = req.body;
    
    // Handle images
    let productImages = [];
    
    // 1. Add local uploaded files
    if (req.files && req.files.length > 0) {
      const localPaths = req.files.map(file => `/uploads/${file.filename}`);
      productImages = [...productImages, ...localPaths];
    }
    
    // 2. Add image URLs from body
    if (image) {
      const urlImages = Array.isArray(image) ? image.filter(img => img.trim() !== "") : [image].filter(img => img && img.trim() !== "");
      productImages = [...productImages, ...urlImages];
    }

    // Fallback
    if (productImages.length === 0) {
      productImages = ["https://via.placeholder.com/400x500?text=Premium+Product"];
    }
    
    // Safe parse for sizes
    let parsedSizes = [];
    try {
      if (Array.isArray(sizes)) {
        parsedSizes = sizes;
      } else if (typeof sizes === 'string') {
        parsedSizes = JSON.parse(sizes);
      }
    } catch (e) {
      console.error("Sizes parsing error:", e);
      parsedSizes = ["S", "M", "L", "XL"]; // Default fallback
    }

    const product = await Product.create({
      name: name || "Untitled Product",
      description: description || "No description provided",
      price: Number(price) || 0,
      category: category || "Other",
      subCategory: subCategory || "Other",
      sizes: parsedSizes,
      bestSeller: bestSeller === 'true' || bestSeller === true,
      stock: Number(stock) || 0,
      image: productImages
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("CRITICAL ADD PRODUCT ERROR:", error);
    res.status(500).json({ 
      message: "Server Error during product creation", 
      error: error.message,
      stack: process.env.NODE_ENV === "production" ? null : error.stack 
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    console.log("GET PRODUCTS REQUEST STARTED");
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`FOUND ${products.length} PRODUCTS`);
    res.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true 
    });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated local files if they exist
    if (product.image && product.image.length > 0) {
      const __dirname = path.resolve();
      product.image.forEach(img => {
        if (img.startsWith('/uploads')) {
          const filePath = path.join(__dirname, img);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log("Deleted local file:", img);
            } catch (err) {
              console.error("Error deleting file:", err);
            }
          }
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product and associated images deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};