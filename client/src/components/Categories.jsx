import React from 'react'
import {categories } from '../assets/assets'
import {useAppContext} from '../context/AppContext'

const Categories = () => {
  const {navigate} = useAppContext()

  return (
    <div className='mt-16'>
      <div className="flex flex-col items-start mb-8">
        <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>Shop by Category</h2>
        <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
      </div>
      
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6'>
        {categories.map((category,index)=>(
          <div 
            key={index} 
            className='group cursor-pointer relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300'
            style={{backgroundColor: category.bgColor}}
            onClick={()=>{
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0,0)
            }}
          >
            <div className='p-4 flex flex-col items-center justify-center h-full transform group-hover:scale-105 transition-transform duration-300'>
              <img 
                src={category.image} 
                alt={category.text} 
                className='w-24 h-24 object-contain mb-3 group-hover:rotate-6 transition-transform duration-300'
              />
              <p className='text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300'>
                {category.text}
              </p>
            </div>
            <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories
