import girl_img from './girl.webp'
import iconblack from './iconblack.png'
import about_img from './shirtwomen44.jpg'
import contact_img from './kidswear44.jpg'
import logo from './logo.jpg'
import vaibhav_logo from './vimage.png'

import p_img1_1 from './shirtman1.jpg'
import p_img1_2 from './shirtman2.jpg'
import p_img1_3 from './shirtman3.jpg'
import p_img1_4 from './shirtman4.jpg'
import p_img2_1 from './shirtwomen2.jpg'
import p_img2_2 from './shirtwomen1.jpg'
import p_img2_3 from './shirtwomen3.jpg'
import p_img2_4 from './shirtwomen4.jpg'
import p_img3_1 from './jacket for kids.jpg'
import p_img3_2 from './jacket for kids1.jpg'
import p_img3_3 from './jacket for kids2.jpg'
import p_img3_4 from './jacket for kids3.jpg'
import p_img4_1 from './jacket for men.jpg'
import p_img4_2 from './jacket for men1.jpg'
import p_img4_3 from './jacket for men2.jpg'
import p_img4_4 from './jacket for men3.jpg'
import p_img5_1 from './jacket for women.jpg'
import p_img5_2 from './jacket for women1.jpg'
import p_img5_3 from './jacket for women2.jpg'
import p_img5_4 from './jacket for women3.jpg'
import p_img6_1 from './kidt-shirt1.jpg'
import p_img6_2 from './kidt-shirt2.jpg'
import p_img6_3 from './kidt-shirt3.jpg'
import p_img7_2 from './pantman2.jpg'
import p_img7_1 from './pantman1.jpg'
import p_img7_3 from './pantman3.jpg'
import p_img7_4 from './pantman4.jpg'
import p_img8_1 from './pantwoman1.jpg'
import p_img8_2 from './pantwoman2.jpg'
import p_img8_3 from './pantwoman3.jpg'
import p_img8_4 from './pantwoman4.jpg'

import p_img9_1 from './manlower3.jpg'
import p_img9_2 from './manlower1.jpg'
import p_img10_1 from './shirtwomen1.jpg'
import p_img10_2 from './shirtwomen11.jpg'
import p_img10_3 from './shirtwomen111.jpg'

import p_img11_1 from './pantwoman11.jpg'
import p_img11_2 from './pantwoman22.jpg'
import p_img11_3 from './pantwoman33.jpg'
import p_img11_4 from './pantwoman144.jpg'

import p_img12_1 from './t-shirtman1.jpg'
import p_img12_2 from './t-shirtman2.jpg'
import p_img12_3 from './t-shirtman3.jpg'
import p_img12_4 from './t-shirtman4.jpg'

import p_img13_1 from './kidswear11.webp'
import p_img13_2 from './kidswear22.jpg'
import p_img13_3 from './kidswear33.jpg'
import p_img13_4 from './kidswear44.jpg'
 
export const assets = {
    girl_img,
    iconblack,
    about_img,
    contact_img,
    logo,
    vaibhav_logo
}

export const products = [
    {
        _id: "65f1a2b3c4d5e6f7a8b9c001",
        name: "Premium Cotton Men Shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 499,
        image: [p_img1_1, p_img1_2, p_img1_3, p_img1_4],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        date: 1716634345484,
        bestSeller: true
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c002",
        name: "Modern Women Top",
        description: "A stylish and comfortable top for women, perfect for casual outings or formal events.",
        price: 349,
        image: [p_img2_1, p_img2_2, p_img2_3, p_img2_4],
        category: "Women",
        subCategory: "Topwear",
        sizes: ["M", "L", "XL"],
        date: 1716621345484,
        bestSeller: true
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c003",
        name: "Kids Winter Wear",
        description: "Warm and cozy winter wear for kids, made with high-quality materials to keep them comfortable in cold weather.",
        price: 799,
        image: [p_img3_1, p_img3_2, p_img3_3, p_img3_4],
        category: "Kids",
        subCategory: "Winterwear",
        sizes: ["S", "M", "L"],
        date: 1716234545484,
        bestSeller: true
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c004",
        name: "Men Stylish Jacket",
        description: "A trendy jacket for men, designed to provide both style and warmth.",
        price: 1299,
        image: [p_img4_1, p_img4_2, p_img4_3, p_img4_4],
        category: "Men",
        subCategory: "Winterwear",
        sizes: ["M", "L", "XL"],
        date: 1716621345484,
        bestSeller: false
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c005",
        name: "Women Puffer Jacket",
        description: "A classic puffer jacket for women, perfect for extreme cold weather.",
        price: 1599,
        image: [p_img5_1, p_img5_2, p_img5_3, p_img5_4],
        category: "Women",
        subCategory: "Winterwear",
        sizes: ["S", "M", "L"],
        date: 1716621345484,
        bestSeller: false
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c006",
        name: "Kids Graphic T-Shirt",
        description: "A fun and vibrant graphic t-shirt for kids, perfect for everyday wear.",
        price: 199,
        image: [p_img6_1, p_img6_2, p_img6_3],
        category: "Kids",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        date: 1716621345484,
        bestSeller: true
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c007",
        name: "Men Slim Fit Trousers",
        description: "Elegant slim fit trousers for men, suitable for both office and casual wear.",
        price: 899,
        image: [p_img7_1, p_img7_2, p_img7_3, p_img7_4],
        category: "Men",
        subCategory: "Bottomwear",
        sizes: ["30", "32", "34"],
        date: 1716621345484,
        bestSeller: false
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c008",
        name: "Women High Waist Pants",
        description: "Comfortable and stylish high waist pants for women.",
        price: 699,
        image: [p_img8_1, p_img8_2, p_img8_3, p_img8_4],
        category: "Women",
        subCategory: "Bottomwear",
        sizes: ["28", "30", "32"],
        date: 1716621345484,
        bestSeller: true
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c009",
        name: "Men Casual Lower",
        description: "Comfortable casual lower for men, ideal for loungewear or exercise.",
        price: 399,
        image: [p_img9_1, p_img9_2],
        category: "Men",
        subCategory: "Bottomwear",
        sizes: ["M", "L", "XL"],
        date: 1716621345484,
        bestSeller: false
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c010",
        name: "Women Floral Shirt",
        description: "A beautiful floral print shirt for women, adding a touch of elegance to any outfit.",
        price: 449,
        image: [p_img10_1, p_img10_2, p_img10_3],
        category: "Women",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        date: 1716621345484,
        bestSeller: false
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c011",
        name: "Women Baggy Jeans",
        description: "Step into effortless style with these trendy baggy jeans, designed for comfort and a relaxed vibe.",
        price: 449,
        image: [p_img11_1, p_img11_2, p_img11_3, p_img11_4],
        category: "Women",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        date: 1716621345484,
        bestSeller: false
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c012",
        name: "Man T-Shirts",
        description: "Redefine your casual look with this modern polo shirt, crafted for comfort and style.",
        price: 449,
        image: [p_img12_1, p_img12_2, p_img12_3, p_img12_4],
        category: "Man",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL", "XXL"],
        date: 1716621345484,
        bestSeller: false
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c013",
        name: "Small Girl Outfit",
        description: "A beautiful floral print shirt for women, adding a touch of elegance to any outfit.",
        price: 449,
        image: [p_img13_1, p_img13_2, p_img13_3, p_img13_4],
        category: "Kids",
        subCategory: "full dress",
        sizes: ["S", "M", "L"],
        date: 1716621345484,
        bestSeller: false
    }
]
