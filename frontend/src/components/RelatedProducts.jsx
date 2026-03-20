import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion';

const RelatedProducts = ({category,subCategory,id}) => {

    const { allProducts } = useContext(ShopContext);
    const [related,setRelated] = useState([]);

    useEffect(()=>{
        if (allProducts && allProducts.length > 0) {
            let productsCopy = allProducts.slice();
            productsCopy = productsCopy.filter((item)=> category === item.category);
            productsCopy = productsCopy.filter((item)=> subCategory === item.subCategory);
            productsCopy = productsCopy.filter((item) => item._id !== id);
            setRelated(productsCopy.slice(0,5));
        }
    },[allProducts, category, subCategory, id])

    if (related.length === 0) return null;

    return (
        <div className='my-32 relative'>
            {/* Background Accent */}
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent -z-10' />

            <div className='text-center mb-16'>
                <div className='flex justify-center'>
                    <Title text1={'RELATED'} text2={'PRODUCTS'} />
                </div>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] -mt-4'>Curated for your unique style</p>
            </div>

            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
                className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 xl:gap-8'
            >
                {related.map((item,index)=>(
                    <motion.div
                        key={item._id}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <ProductItem id={item._id} name={item.name} price={item.price} image={item.image} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default RelatedProducts
