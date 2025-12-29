import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import NewsLetter from '../components/NewsLetter'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const { products } = useAppContext()

  // Get the last 8 products (newest products)
  const newProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8)

  return (
    <div className='mt-10'>
      <MainBanner/>
      <Categories/>
      <BestSeller/>
      
      {/* New Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">New Arrivals</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out our latest products, freshly added to our collection
          </p>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {newProducts.length > 0 ? (
            newProducts.map((product) => (
              <div key={product._id} className="transform hover:-translate-y-2 transition-all duration-300">
                <ProductCard product={product} small />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No New Products Available</h3>
                <p className="text-gray-500">
                  Check back soon for new arrivals!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <NewsLetter/>
    </div>
  )
}

export default Home
