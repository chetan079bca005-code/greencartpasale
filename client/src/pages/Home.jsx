import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'
import { categories } from '../assets/assets'

const Home = () => {
  const { products, user, axios, navigate, currency } = useAppContext()
  const [recommendations, setRecommendations] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  // Get products sorted by different criteria
  const newProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8)

  const bestSellers = [...products]
    .filter(p => p.inStock)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);

  const dealsProducts = [...products]
    .filter(p => p.price > p.offerPrice)
    .sort((a, b) => ((b.price - b.offerPrice) / b.price) - ((a.price - a.offerPrice) / a.price))
    .slice(0, 6);

  // Get unique categories
  const uniqueCategories = ['All', ...new Set(products.map(p => p.category))];

  // Filter products by category
  const filteredProducts = activeCategory === 'All' 
    ? products.slice(0, 12) 
    : products.filter(p => p.category === activeCategory).slice(0, 12);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await axios.get(`/api/recommendations/personalized?userId=${user?._id || ''}`);
        setRecommendations(data?.recommendations || data || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
    fetchRecommendations();
  }, [user, axios]);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300'>
      
      {/* Top Banner - Compact Promo */}
      <div className="bg-primary text-white text-center py-2 text-sm font-medium">
        <span>🚚 Free Delivery on orders above {currency}500 | </span>
        <span className="font-bold">Fresh Products Daily!</span>
      </div>

      {/* Main Hero - Premium Royal Look with Background Image */}
      <section className="relative overflow-hidden">
        {/* Premium Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80')`,
          }}
        >
          {/* Royal Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 via-emerald-800/90 to-teal-900/85 dark:from-slate-900/98 dark:via-emerald-900/95 dark:to-slate-900/95"></div>
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left - Text Content with Premium Styling */}
            <div className="lg:w-1/2 text-white text-center lg:text-left">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 border border-amber-400/30 rounded-full px-4 py-1.5 mb-4">
                <span className="text-amber-400 text-sm">✦</span>
                <span className="text-amber-300 font-semibold text-sm tracking-wide">Premium Quality Groceries</span>
                <span className="text-amber-400 text-sm">✦</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-4">
                <span className="bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                  Fresh Groceries
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 mt-2">
                  Delivered Fast
                </span>
              </h1>
              <p className="text-emerald-100/90 mb-6 text-lg max-w-md mx-auto lg:mx-0">
                🌿 Farm-fresh vegetables, fruits & daily essentials at your doorstep with royal service
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <button 
                  onClick={() => navigate('/products')}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-300 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5"
                >
                  🛒 Shop Now
                </button>
                <button 
                  onClick={() => document.getElementById('deals').scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all"
                >
                  Today's Deals
                </button>
              </div>
              
              {/* Premium Quick Stats */}
              <div className="flex gap-8 mt-8 justify-center lg:justify-start">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
                  <p className="text-3xl font-black bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">{products.length}+</p>
                  <p className="text-xs text-emerald-200 font-medium">Products</p>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
                  <p className="text-3xl font-black bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">24h</p>
                  <p className="text-xs text-emerald-200 font-medium">Delivery</p>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
                  <p className="text-3xl font-black bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">100%</p>
                  <p className="text-xs text-emerald-200 font-medium">Fresh</p>
                </div>
              </div>
            </div>

            {/* Right - Featured Products with Premium Card Style */}
            <div className="lg:w-1/2 w-full">
              <div className="grid grid-cols-3 gap-4">
                {products.slice(0, 6).map((product, i) => (
                  <div 
                    key={product._id}
                    onClick={() => navigate(`/products/${product.category.toLowerCase().replace(/\s+/g, '')}/${product._id}`)}
                    className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl p-3 cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-300 border border-white/20 group"
                  >
                    <div className="relative">
                      <img 
                        src={product.image[0]} 
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded-xl mb-2 group-hover:brightness-105 transition-all"
                      />
                      {product.price > product.offerPrice && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{product.name}</p>
                    <p className="text-primary font-black text-sm">{currency}{product.offerPrice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Bar */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.slice(0, 8).map((cat, index) => (
              <button
                key={index}
                onClick={() => navigate(`/products/${cat.path.toLowerCase()}`)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-primary hover:text-white rounded-full whitespace-nowrap transition-all text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <img src={cat.image} alt={cat.text} className="w-5 h-5" />
                {cat.text}
              </button>
            ))}
            <Link 
              to="/products" 
              className="px-4 py-2 text-primary font-bold text-sm whitespace-nowrap hover:underline"
            >
              View All →
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Deals - Prominent */}
      {dealsProducts.length > 0 && (
        <section id="deals" className="py-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 text-white px-3 py-1 rounded-lg font-black text-sm animate-pulse">
                  🔥 HOT DEALS
                </div>
                <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">Today's Special Offers</h2>
              </div>
              <Link to="/products?filter=hot-deals" className="text-red-600 font-bold text-sm hover:underline">
                See All Deals →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {dealsProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Products Grid with Category Filter */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">
              Shop Products
            </h2>
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Link 
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg"
            >
              View All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">Best Sellers</h2>
            </div>
            <Link to="/products?filter=best-sellers" className="text-primary font-bold text-sm hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {bestSellers.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations - For Logged In Users */}
      {user && recommendations.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                  ✨ For You
                </div>
                <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">Recommended</h2>
              </div>
              <Link to="/products?filter=recommended" className="text-violet-600 font-bold text-sm hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {recommendations.slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-xs font-bold">NEW</span>
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">Fresh Arrivals</h2>
            </div>
            <Link to="/products?filter=fresh-arrivals" className="text-primary font-bold text-sm hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {newProducts.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white mb-6 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 group cursor-pointer flex flex-col items-center text-center hover:shadow-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-all"
                onClick={() => {
                  navigate(`/products/${category.path.toLowerCase()}`);
                  window.scrollTo(0, 0)
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${category.bgColor}30` }}
                >
                  <img
                    src={category.image}
                    alt={category.text}
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <h3 className="font-bold text-slate-700 dark:text-white text-xs group-hover:text-primary transition-colors">
                  {category.text}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-slate-100 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Fresh Quality</p>
                <p className="text-xs text-slate-500">100% Fresh Products</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Fast Delivery</p>
                <p className="text-xs text-slate-500">Within 24 Hours</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Secure Pay</p>
                <p className="text-xs text-slate-500">Safe Transactions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">24/7 Support</p>
                <p className="text-xs text-slate-500">Always Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter - Compact */}
      <section className="py-10 bg-primary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <h3 className="text-2xl font-black">Get Exclusive Offers!</h3>
              <p className="text-emerald-100 text-sm">Subscribe for deals & updates</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white/30 text-slate-900"
              />
              <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home