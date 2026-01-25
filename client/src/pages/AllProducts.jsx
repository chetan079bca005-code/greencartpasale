import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { categories } from '../assets/assets';

const AllProducts = () => {
  const { products, searchQuery, setSearchQuery, currency, user, axios } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  // Filter configurations with icons and colors
  const filterOptions = [
    { id: 'all', label: 'All Products', icon: '🛍️', color: 'slate', description: 'Browse all items' },
    { id: 'hot-deals', label: 'Hot Deals', icon: '🔥', color: 'red', description: 'Up to 50% off' },
    { id: 'best-sellers', label: 'Best Sellers', icon: '⭐', color: 'amber', description: 'Top rated products' },
    { id: 'fresh-arrivals', label: 'Fresh Arrivals', icon: '🆕', color: 'emerald', description: 'Newly added' },
    { id: 'recommended', label: 'Recommended', icon: '✨', color: 'violet', description: 'Just for you' },
    { id: 'budget-friendly', label: 'Budget Picks', icon: '💰', color: 'green', description: 'Under ₹100' },
    { id: 'premium', label: 'Premium', icon: '👑', color: 'yellow', description: 'Top quality' },
    { id: 'trending', label: 'Trending', icon: '📈', color: 'blue', description: 'Popular now' },
  ];

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'newest', label: 'Newest First' },
    { id: 'rating', label: 'Top Rated' },
    { id: 'discount', label: 'Highest Discount' },
  ];

  // Fetch recommendations for logged-in users
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user?._id) {
        try {
          const { data } = await axios.get(`/api/recommendations/personalized?userId=${user._id}`);
          setRecommendations(data?.recommendations || data || []);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      }
    };
    fetchRecommendations();
  }, [user, axios]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeFilter !== 'all') params.set('filter', activeFilter);
    if (activeCategory !== 'all') params.set('category', activeCategory);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    setSearchParams(params);
  }, [activeFilter, activeCategory, sortBy]);

  // Read URL params on mount
  useEffect(() => {
    const filter = searchParams.get('filter');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    if (filter) setActiveFilter(filter);
    if (category) setActiveCategory(category);
    if (sort) setSortBy(sort);
  }, []);

  // Apply all filters and sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.inStock !== false);

    // Apply search query
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(p => 
        p.category?.toLowerCase().replace(/\s+/g, '-') === activeCategory.toLowerCase()
      );
    }

    // Apply special filters
    switch (activeFilter) {
      case 'hot-deals':
        result = result.filter(p => p.price > p.offerPrice);
        break;
      case 'best-sellers':
        result = result.filter(p => (p.rating || 0) >= 4);
        break;
      case 'fresh-arrivals':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        result = result.filter(p => new Date(p.createdAt) >= thirtyDaysAgo);
        break;
      case 'recommended':
        if (recommendations.length > 0) {
          const recIds = new Set(recommendations.map(r => r._id));
          result = result.filter(p => recIds.has(p._id));
        }
        break;
      case 'budget-friendly':
        result = result.filter(p => (p.offerPrice || p.price) <= 100);
        break;
      case 'premium':
        result = result.filter(p => (p.offerPrice || p.price) >= 200);
        break;
      case 'trending':
        result = result.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 20);
        break;
      default:
        break;
    }

    // Apply price range
    result = result.filter(p => {
      const price = p.offerPrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

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
  }, [products, searchQuery, activeFilter, activeCategory, sortBy, priceRange, recommendations]);

  const currentFilterInfo = filterOptions.find(f => f.id === activeFilter);

  const getFilterColorClasses = (color, isActive) => {
    const colors = {
      slate: isActive ? 'bg-slate-600 text-white border-slate-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-600',
      red: isActive ? 'bg-red-500 text-white border-red-500' : 'hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800',
      amber: isActive ? 'bg-amber-500 text-white border-amber-500' : 'hover:bg-amber-50 dark:hover:bg-amber-900/20 border-amber-200 dark:border-amber-800',
      emerald: isActive ? 'bg-emerald-500 text-white border-emerald-500' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
      violet: isActive ? 'bg-violet-500 text-white border-violet-500' : 'hover:bg-violet-50 dark:hover:bg-violet-900/20 border-violet-200 dark:border-violet-800',
      green: isActive ? 'bg-green-500 text-white border-green-500' : 'hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800',
      yellow: isActive ? 'bg-yellow-500 text-white border-yellow-500' : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      blue: isActive ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    };
    return colors[color] || colors.slate;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Premium Header with Background */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 via-teal-800/90 to-emerald-900/95"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-emerald-200/80 text-sm mb-4">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
            <span>/</span>
            <span className="text-white font-medium">Shop</span>
            {activeFilter !== 'all' && (
              <>
                <span>/</span>
                <span className="text-amber-300 font-medium">{currentFilterInfo?.label}</span>
              </>
            )}
          
          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {currentFilterInfo && activeFilter !== 'all' && (
                  <span className="text-3xl">{currentFilterInfo.icon}</span>
                )}
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  {activeFilter === 'all' ? 'All Products' : currentFilterInfo?.label}
                </h1>
              </div>
              <p className="text-emerald-200/90 text-sm md:text-base">
                {currentFilterInfo?.description || 'Discover fresh groceries & daily essentials'}
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-96">
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
                  placeholder="Search products..."
                  className="w-full bg-transparent ml-3 outline-none text-white placeholder-white/60 font-medium"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar - Sticky */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Quick Filters */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
                  getFilterColorClasses(filter.color, activeFilter === filter.id)
                } ${activeFilter !== filter.id ? 'text-slate-700 dark:text-slate-300' : ''}`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 sticky top-20">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === 'all'
                        ? 'bg-primary text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.path}
                      onClick={() => setActiveCategory(cat.path.toLowerCase())}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        activeCategory === cat.path.toLowerCase()
                          ? 'bg-primary text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <img src={cat.image} alt={cat.text} className="w-5 h-5" />
                      {cat.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price Range
                </h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>{currency}0</span>
                    <span className="font-bold text-primary">{currency}{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Quick Price Filters */}
              <div className="space-y-2">
                <button
                  onClick={() => setPriceRange([0, 50])}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  Under {currency}50
                </button>
                <button
                  onClick={() => setPriceRange([50, 100])}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  {currency}50 - {currency}100
                </button>
                <button
                  onClick={() => setPriceRange([100, 500])}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  {currency}100 - {currency}500
                </button>
                <button
                  onClick={() => setPriceRange([0, 1000])}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-all"
                >
                  Reset Price
                </button>
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1">
            {/* Results Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Showing <span className="font-bold text-slate-900 dark:text-white">{filteredProducts.length}</span> products
                </p>
                {(activeFilter !== 'all' || activeCategory !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveFilter('all');
                      setActiveCategory('all');
                      setSearchQuery('');
                      setPriceRange([0, 1000]);
                    }}
                    className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear all
                  </button>
                )}
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

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
              </div>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeCategory === 'all' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.path}
                      onClick={() => setActiveCategory(cat.path.toLowerCase())}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                        activeCategory === cat.path.toLowerCase() ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <img src={cat.image} alt={cat.text} className="w-4 h-4" />
                      {cat.text}
                    </button>
                  ))}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Price</h3>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setPriceRange([0, 50])} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    Under {currency}50
                  </button>
                  <button onClick={() => setPriceRange([50, 100])} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    {currency}50 - {currency}100
                  </button>
                  <button onClick={() => setPriceRange([100, 500])} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    {currency}100+
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' 
                : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  viewMode === 'grid' ? (
                    <ProductCard key={product._id} product={product} />
                  ) : (
                    // List View Card
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No products found</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Try adjusting your filters or search terms</p>
                  <button
                    onClick={() => {
                      setActiveFilter('all');
                      setActiveCategory('all');
                      setSearchQuery('');
                      setPriceRange([0, 1000]);
                    }}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
