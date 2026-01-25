import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { categories } from '../assets/assets';

const ProductCategory = () => {
  const { category } = useParams();
  const { products, searchQuery, setSearchQuery, currency } = useAppContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [priceFilter, setPriceFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'newest', label: 'Newest First' },
    { id: 'rating', label: 'Top Rated' },
    { id: 'discount', label: 'Highest Discount' },
  ];

  const priceFilters = [
    { id: 'all', label: 'All Prices' },
    { id: 'under50', label: 'Under ₹50' },
    { id: '50-100', label: '₹50 - ₹100' },
    { id: '100-200', label: '₹100 - ₹200' },
    { id: 'over200', label: '₹200+' },
  ];

  // Get category details
  const categoryDetails = {
    fruits: {
      title: "Fresh Fruits",
      description: "Discover our selection of fresh, seasonal fruits picked at peak ripeness",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1920&auto=format&fit=crop",
      icon: "🍎"
    },
    vegetables: {
      title: "Fresh Vegetables",
      description: "Farm-fresh vegetables delivered to your doorstep within 24 hours",
      image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=1920&auto=format&fit=crop",
      icon: "🥬"
    },
    dairyproducts: {
      title: "Dairy Products",
      description: "Premium quality dairy products from trusted local farms",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1920&auto=format&fit=crop",
      icon: "🥛"
    },
    bakery: {
      title: "Bakery Items",
      description: "Freshly baked goods and pastries made with love",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1920&auto=format&fit=crop",
      icon: "🥐"
    },
    colddrinks: {
      title: "Cold Drinks",
      description: "Refreshing beverages for every occasion and taste",
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1920&auto=format&fit=crop",
      icon: "🥤"
    },
    instantfood: {
      title: "Instant Food",
      description: "Quick and delicious ready-to-eat meals for busy days",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1920&auto=format&fit=crop",
      icon: "🍜"
    },
    grain: {
      title: "Grains & Cereals",
      description: "Premium quality grains and cereals for healthy meals",
      image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1920&auto=format&fit=crop",
      icon: "🌾"
    },
    dryfruits: {
      title: "Dry Fruits & Nuts",
      description: "Premium quality dry fruits and nuts for healthy snacking",
      image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=1920&auto=format&fit=crop",
      icon: "🥜"
    }
  };

  const currentCategory = categoryDetails[category.toLowerCase().replace(/\s+/g, '')] || {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    description: `Browse our selection of ${category}`,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop",
    icon: "🛒"
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (product) =>
        product.category.toLowerCase().replace(/\s+/g, '') === category.toLowerCase().replace(/\s+/g, '') &&
        product.name.toLowerCase().includes((searchQuery || '').toLowerCase()) &&
        product.inStock !== false
    );

    // Apply price filter
    switch (priceFilter) {
      case 'under50':
        result = result.filter(p => (p.offerPrice || p.price) < 50);
        break;
      case '50-100':
        result = result.filter(p => (p.offerPrice || p.price) >= 50 && (p.offerPrice || p.price) <= 100);
        break;
      case '100-200':
        result = result.filter(p => (p.offerPrice || p.price) > 100 && (p.offerPrice || p.price) <= 200);
        break;
      case 'over200':
        result = result.filter(p => (p.offerPrice || p.price) > 200);
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        result.sort((a, b) => {
          const discA = a.price > a.offerPrice ? ((a.price - a.offerPrice) / a.price) : 0;
          const discB = b.price > b.offerPrice ? ((b.price - b.offerPrice) / b.price) : 0;
          return discB - discA;
        });
        break;
      default:
        break;
    }

    return result;
  }, [products, category, searchQuery, sortBy, priceFilter]);

  // Get deals count for this category
  const dealsCount = products.filter(p => 
    p.category.toLowerCase().replace(/\s+/g, '') === category.toLowerCase().replace(/\s+/g, '') &&
    p.price > p.offerPrice
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Category Header with Background */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${currentCategory.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white font-medium">{currentCategory.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{currentCategory.icon}</div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{currentCategory.title}</h1>
                <p className="text-slate-300 text-sm md:text-base max-w-lg">{currentCategory.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-emerald-400 font-bold text-sm">{filteredProducts.length} Products</span>
                  {dealsCount > 0 && (
                    <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs font-bold">
                      🔥 {dealsCount} Deals
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-80">
              <div className={`flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border transition-all ${
                isSearchFocused ? 'border-white/50 bg-white/20' : 'border-white/20'
              }`}>
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder={`Search ${currentCategory.title}...`}
                  className="w-full bg-transparent ml-3 outline-none text-white placeholder-white/60 font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Category Navigation */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.path}
                onClick={() => navigate(`/products/${cat.path.toLowerCase()}`)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  cat.path.toLowerCase() === category.toLowerCase()
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary/10'
                }`}
              >
                <img src={cat.image} alt={cat.text} className="w-5 h-5" />
                {cat.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            {/* Price Filters */}
            {priceFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setPriceFilter(filter.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  priceFilter === filter.id
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
              >
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V5zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V5zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V5zM3 11a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
              >
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4' 
            : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              viewMode === 'grid' ? (
                <ProductCard key={product._id} product={product} />
              ) : (
                <div 
                  key={product._id}
                  onClick={() => navigate(`/products/${product.category?.toLowerCase().replace(/\s+/g, '')}/${product._id}`)}
                  className="flex gap-4 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="relative w-32 h-32 shrink-0">
                    <img 
                      src={product.image?.[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {product.price > product.offerPrice && (
                      <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-primary font-semibold mb-1">{product.category}</p>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate">{product.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 line-clamp-2">
                      {Array.isArray(product.description) ? product.description[0] : product.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-primary">{currency}{product.offerPrice}</span>
                      {product.price > product.offerPrice && (
                        <span className="text-sm text-slate-400 line-through">{currency}{product.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="max-w-md mx-auto p-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-5xl mb-4">{currentCategory.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No products found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPriceFilter('all');
                  setSortBy('featured');
                }}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
