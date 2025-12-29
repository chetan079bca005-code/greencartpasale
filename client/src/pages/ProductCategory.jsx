import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { assets } from '../assets/assets';

const ProductCategory = () => {
  const { category } = useParams();
  const { products, searchQuery, setSearchQuery } = useAppContext();
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter products based on category and search query
  const filteredProducts = products.filter(
    (product) =>
      product.category.toLowerCase() === category.toLowerCase() &&
      product.name.toLowerCase().includes((searchQuery || '').toLowerCase()) &&
      product.inStock === true
  );

  // Get category details
  const categoryDetails = {
    fruits: {
      title: "Fresh Fruits",
      description: "Discover our selection of fresh, seasonal fruits",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1920&auto=format&fit=crop",
      bgColor: "from-green-500/20 to-green-400/10"
    },
    vegetables: {
      title: "Fresh Vegetables",
      description: "Farm-fresh vegetables delivered to your doorstep",
      image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=1920&auto=format&fit=crop",
      bgColor: "from-emerald-500/20 to-emerald-400/10"
    },
    dairy: {
      title: "Dairy Products",
      description: "Premium quality dairy products",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1920&auto=format&fit=crop",
      bgColor: "from-blue-500/20 to-blue-400/10"
    },
    bakery: {
      title: "Bakery Items",
      description: "Freshly baked goods and pastries",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1920&auto=format&fit=crop",
      bgColor: "from-amber-500/20 to-amber-400/10"
    },
    colddrinks: {
      title: "Cold Drinks",
      description: "Refreshing beverages for every occasion",
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1920&auto=format&fit=crop",
      bgColor: "from-red-500/20 to-red-400/10"
    },
    instantfood: {
      title: "Instant Food",
      description: "Quick and delicious ready-to-eat meals",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1920&auto=format&fit=crop",
      bgColor: "from-orange-500/20 to-orange-400/10"
    },
    grain: {
      title: "Grains & Cereals",
      description: "Premium quality grains and cereals",
      image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1920&auto=format&fit=crop",
      bgColor: "from-yellow-500/20 to-yellow-400/10"
    }
  };

  const currentCategory = categoryDetails[category.toLowerCase()] || {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    description: `Browse our selection of ${category}`,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop",
    bgColor: "from-primary/20 to-primary/10"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="relative h-64 md:h-80">
        <div className={`absolute inset-0 bg-gradient-to-r ${currentCategory.bgColor}`}></div>
        <img
          src={currentCategory.image}
          alt={currentCategory.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentCategory.title}</h1>
              <p className="text-lg md:text-xl text-gray-100 max-w-2xl">{currentCategory.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:w-96">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder={`Search ${currentCategory.title.toLowerCase()}...`}
                className="w-full px-6 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 shadow-sm"
              />
              <img
                src={assets.search_icon}
                alt="search"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Found {filteredProducts.length} products</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <button
              onClick={() => navigate('/products')}
              className="text-primary hover:text-primary-dull transition-colors"
            >
              View all products
            </button>
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
                  We couldn't find any products in this category matching your search. Try different keywords or browse other categories.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
