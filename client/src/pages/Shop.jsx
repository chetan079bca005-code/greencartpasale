import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { assets, categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const { products, currency } = useAppContext();
    
    // Filter in-stock products
    const inStockProducts = products.filter(product => product.inStock === true);

    return (
        <div className="pt-24 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Pasale Shop</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover fresh, high-quality products delivered right to your doorstep.
                    </p>
                </div>

                {/* Categories Section */}
                <div className="mb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.path}
                                to={`/products/${category.path.toLowerCase()}`}
                                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <img src={category.image} alt={category.text} className="w-16 h-16 mb-2" />
                                <span className="text-gray-700 font-medium">{category.text}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Best Sellers Section */}
                <div className="mb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Best Sellers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {inStockProducts && inStockProducts.slice(0, 5).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>

                {/* New Arrivals Section */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">New Arrivals</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {inStockProducts && inStockProducts.slice(0, 20).map((product) => (
                            <ProductCard key={product._id} product={product} small />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop; 