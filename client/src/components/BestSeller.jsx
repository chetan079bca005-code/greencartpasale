import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
    const { products } = useAppContext();
    // Filter in-stock products first, then take the first 5
    const bestSellers = products.filter(product => product.inStock === true).slice(0, 5);

    return (
        <div className="py-10">
            <div className="max-w-7xl mx-auto container px-4">
                <div className="text-center mb-12">
                    <span className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase bg-white/10 px-3 py-1 rounded-full">Elite Tier</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mt-6 tracking-tight uppercase italic">Best Sellers</h2>
                    <div className="flex justify-center mt-6">
                        <div className="w-12 h-1 bg-primary rounded-full"></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {bestSellers.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>

    )
}

export default BestSeller
