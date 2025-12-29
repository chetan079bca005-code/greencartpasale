import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
    const { products } = useAppContext();
    // Filter in-stock products first, then take the first 5
    const bestSellers = products.filter(product => product.inStock === true).slice(0, 5);

    return (
        <div className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Best Sellers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {bestSellers.map((product) => (
                        <div 
                            key={product._id} 
                            className="transform hover:-translate-y-2 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl p-4"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BestSeller
