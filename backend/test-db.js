import mongoose from 'mongoose';
import 'dotenv/config';
import Product from './models/Product.js';

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Product.countDocuments();
        console.log(`Total Products in DB: ${count}`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
