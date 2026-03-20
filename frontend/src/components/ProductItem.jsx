import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const ProductItem = ({ id, image, name, price }) => {
    
    const {currency, getImageUrl} = useContext(ShopContext);

    const imgSource = getImageUrl(image);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className='group'
        >
            <Link className='text-gray-700 cursor-pointer block' to={`/product/${id}`}>
                <div className='aspect-[3/4] overflow-hidden rounded-[32px] bg-gray-50 relative border border-gray-100 shadow-sm'>
                    <img 
                        className='h-full w-full object-cover object-center group-hover:scale-110 transition duration-700 ease-in-out saturate-[1.1]' 
                        src={imgSource} 
                        alt={name} 
                        onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdG09IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNGM0YzRjMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlBOTk5OSIgZm9udC1mYW1pbHk9ImFyaWFsIiBmb250LXNpemU9IjI0Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+' }}
                    />
                    
                    {/* Hover Overlay */}
                    <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]'>
                        <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 delay-100'>
                            <Plus className='text-black' />
                        </div>
                    </div>

                    {/* Badge placeholder if needed */}
                    <div className='absolute top-4 left-4'>
                        <span className='bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-black border border-white/20 shadow-sm'>New</span>
                    </div>
                </div>
                
                <div className='pt-5'>
                    <div className='flex items-center justify-between mb-2'>
                        <p className='text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]'>Forever Premium</p>
                        <div className='w-1 h-1 bg-blue-500 rounded-full'></div>
                    </div>
                    
                    <div className='h-10 flex flex-col justify-start mb-2'>
                        <h3 className='text-sm font-black text-gray-900 line-clamp-2 tracking-tight group-hover:text-blue-600 transition-colors uppercase leading-[1.2]'>
                            {name}
                        </h3>
                    </div>

                    <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
                        <p className='text-base font-black text-gray-900 italic'>{currency}{price}</p>
                        <div className='flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity'>
                            <p className='text-[9px] font-black uppercase tracking-widest'>Details</p>
                            <div className='w-4 h-[1px] bg-black'></div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default ProductItem;
