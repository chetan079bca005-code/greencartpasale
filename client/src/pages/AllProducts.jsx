import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { assets } from '../assets/assets';

const AllProducts = () => {
  const { products, searchQuery, setSearchQuery } = useAppContext();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter products based on the search query and stock status
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes((searchQuery || '').toLowerCase()) &&
    product.inStock === true
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">All Products</h1>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search products..."
              className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 shadow-sm"
            />
            <img
              src={assets.search_icon}
              alt="search"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="transform hover:-translate-y-2 transition-all duration-300">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <img
                  src={assets.empty_cart}
                  alt="No products found"
                  className="w-32 h-32 mx-auto mb-4 opacity-50"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
                <p className="text-gray-500">
                  We couldn't find any products matching your search. Try different keywords or browse our categories.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
