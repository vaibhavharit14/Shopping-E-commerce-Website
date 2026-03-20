import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

import ProductItem from '../components/ProductItem';
import { ChevronRight, Filter, SlidersHorizontal, Check, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Collection = () => {

  const { allProducts: products , search , showSearch } = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('relevant');
  const [showSort, setShowSort] = useState(false);

  const navigate = useNavigate();

  const toggleCategory = (val) => {
    if (category.includes(val)) {
        setCategory(prev=> prev.filter(item => item !== val))
    }
    else{
      setCategory(prev => [...prev, val])
    }
  }

  const toggleSubCategory = (val) => {
    if (subCategory.includes(val)) {
      setSubCategory(prev=> prev.filter(item => item !== val))
    }
    else{
      setSubCategory(prev => [...prev, val])
    }
  }

  const applyFilter = useCallback(() => {
    if (!products || !Array.isArray(products)) return;
    
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name && item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0 ) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    switch (sortType) {
      case 'low-high':
        productsCopy.sort((a,b)=>(a.price - b.price));
        break;

      case 'high-low':
        productsCopy.sort((a,b)=>(b.price - a.price));
        break;

      default:
        break;
    }

    setFilterProducts(productsCopy)
  }, [category, subCategory, products, search, showSearch, sortType])

  useEffect(()=>{
      applyFilter();
  },[applyFilter])

  const CustomCheckbox = ({ label, checked, onChange }) => (
    <div 
      onClick={onChange}
      className='flex items-center gap-3 cursor-pointer group py-1'
    >
      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${checked ? 'bg-black border-black shadow-lg shadow-black/10' : 'border-gray-200 group-hover:border-gray-400 bg-white'}`}>
        {checked && <Check size={12} className='text-white stroke-[4]' />}
      </div>
      <span className={`text-sm font-bold transition-colors ${checked ? 'text-black' : 'text-gray-500 group-hover:text-gray-700'}`}>{label}</span>
    </div>
  );

  return (
    <div className='flex flex-col lg:flex-row gap-12 pt-8 min-h-screen bg-[#fafafa] px-4 sm:px-0'>
      
      {/* Sidebar - Filter Options */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className='lg:w-80 flex-shrink-0'
      >
        <div className='bg-white lg:sticky lg:top-32 rounded-[48px] border border-gray-100 shadow-2xl shadow-black/5 p-10 overflow-hidden relative'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50' />
          
          <div 
            onClick={()=>setShowFilter(!showFilter)} 
            className='flex items-center justify-between cursor-pointer lg:cursor-default mb-10 group relative z-10'
          >
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-black/20'>
                <SlidersHorizontal size={20} />
              </div>
              <div className='flex flex-col'>
                <p className='text-2xl font-black italic tracking-tighter uppercase leading-none'>Filters</p>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1'>Selection Console</p>
              </div>
            </div>
            <ChevronRight className={`h-6 w-6 lg:hidden transition-transform duration-500 ${showFilter ? 'rotate-90 text-black' : 'text-gray-300'}`} />
          </div>

          <div className={`${showFilter ? 'block' : 'hidden'} lg:block space-y-12 relative z-10`}>
            {/* Category Filter */}
            <div className='space-y-6'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-1.5 h-1.5 bg-black rounded-full' />
                <p className='text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase'>Range Segments</p>
              </div>
              <div className='space-y-4 pl-1'>
                <CustomCheckbox label="Men's Collection" checked={category.includes('Men')} onChange={() => toggleCategory('Men')} />
                <CustomCheckbox label="Women's Collection" checked={category.includes('Women')} onChange={() => toggleCategory('Women')} />
                <CustomCheckbox label="Kids' Collection" checked={category.includes('Kids')} onChange={() => toggleCategory('Kids')} />
              </div>
            </div>

            {/* Type Filter */}
            <div className='space-y-6'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-1.5 h-1.5 bg-black rounded-full' />
                <p className='text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase'>Apparel Type</p>
              </div>
              <div className='space-y-4 pl-1'>
                <CustomCheckbox label="Topwear Range" checked={subCategory.includes('Topwear')} onChange={() => toggleSubCategory('Topwear')} />
                <CustomCheckbox label="Bottomwear Range" checked={subCategory.includes('Bottomwear')} onChange={() => toggleSubCategory('Bottomwear')} />
                <CustomCheckbox label="Winter Edition" checked={subCategory.includes('Winterwear')} onChange={() => toggleSubCategory('Winterwear')} />
              </div>
            </div>

            {/* Premium Support Box */}
            <div 
              onClick={() => navigate('/contact')}
              className='bg-black p-8 rounded-[32px] mt-12 text-white relative overflow-hidden group/support cursor-pointer'
            >
              <div className='relative z-10'>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2'>
                   <Mail size={12} className='text-white' /> Protocol Help
                </p>
                <p className='text-xs font-bold leading-relaxed mb-6'>Direct access to our style ambassadors for personalized sizing.</p>
                <button className='w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-white/10 transition-all hover:scale-[1.02]'>
                   Connect Node
                </button>
              </div>
              <div className='absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover/support:bg-white/10 transition-colors' />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side */}
      <div className='flex-1 pb-24'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16'>
            <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-[2px] bg-black' />
                  <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]'>Curation Protocol</p>
                </div>
                <h2 className='text-4xl sm:text-5xl font-black italic tracking-tighter text-gray-900 uppercase leading-none'>
                  Store <span className='text-gray-400 font-light not-italic'>Archive</span>
                </h2>
                <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest w-fit border border-blue-100/50'>
                  <span className='w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse'></span>
                  Protocol Active: {filterProducts.length} Assets Found
                </div>
            </div>
            
            <div 
              onClick={() => setShowSort(prev => !prev)}
              className='flex items-center gap-4 bg-white p-3 rounded-[24px] border border-gray-100 shadow-xl shadow-black/5 cursor-pointer hover:border-gray-300 transition-all select-none'
            >
              <div className='w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400'>
                <SlidersHorizontal size={14} />
              </div>
              <div className='flex flex-col pr-4 relative min-w-[180px]'>
                <span className='text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1'>Sort Logic</span>
                <div className='flex items-center justify-between group/sort'>
                  <p className='text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-2'>
                    {sortType === 'relevant' ? 'Relevance Protocol' : 
                     sortType === 'low-high' ? 'Valuation: Ascension' : 
                     'Valuation: Descension'}
                    <ChevronRight size={12} className={`transition-transform duration-300 ${showSort ? 'rotate-90' : ''}`} />
                  </p>
                </div>

                <AnimatePresence>
                  {showSort && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className='absolute top-full right-0 mt-4 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] overflow-hidden p-2'
                    >
                      {[
                        { label: 'Relevance Protocol', value: 'relevant' },
                        { label: 'Valuation: Ascension', value: 'low-high' },
                        { label: 'Valuation: Descension', value: 'high-low' }
                      ].map((opt) => (
                        <div 
                          key={opt.value}
                          onClick={() => {
                            setSortType(opt.value);
                            setShowSort(false);
                          }}
                          className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${sortType === opt.value ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
        </div>

        <motion.div 
          layout
          className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10'
        >
          <AnimatePresence mode='popLayout'>
            {
              filterProducts.map((item,index)=>(
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductItem name={item.name} id={item._id} price={item.price} image={item.image} />
                </motion.div>
              ))
            }
          </AnimatePresence>
        </motion.div>

        {filterProducts.length === 0 && (
          <div className='py-32 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200'>
            <div className='w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-6 text-gray-300'>
              <Filter size={32} />
            </div>
            <h3 className='text-xl font-black text-gray-900 mb-2'>No matches found</h3>
            <p className='text-gray-500 text-sm'>Try adjusting your filters or search terms to find what you're looking for.</p>
            <button 
              onClick={() => {setCategory([]); setSubCategory([]);}}
              className='mt-8 text-xs font-black bg-black text-white px-8 py-4 rounded-2xl uppercase tracking-widest shadow-xl hover:shadow-black/20 hover:scale-105 transition-all'
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default Collection
