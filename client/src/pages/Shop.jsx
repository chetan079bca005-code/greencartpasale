import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { assets, categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const { products, currency, searchQuery, setSearchQuery } = useAppContext();
    const [activeCategory, setActiveCategory] = useState('all');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Filter in-stock products
    const inStockProducts = products.filter(product => product.inStock === true);

    // Filter by category and search
    const filteredProducts = inStockProducts.filter(product => {
        const matchesCategory = activeCategory === 'all' ||
            product.category.toLowerCase().replace(/\s+/g, '') === activeCategory.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes((searchQuery || '').toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Get featured products (first 8)
    const featuredProducts = inStockProducts.slice(0, 8);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-500">
            {/* Hero Section - Light Mode Friendly */}
            <div className="relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -mr-96 -mt-96"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-6 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                Fresh & Organic
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight leading-[0.9]">
                                Fresh<br />
                                <span className="text-primary italic">Collections</span>
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed font-medium mb-8">
                                Explore our curated selection of premium products, sourced daily from trusted local farmers and producers.
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-8">
                                <div className="text-center">
                                    <p className="text-3xl font-black text-slate-900 dark:text-white">{inStockProducts.length}+</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Products</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-black text-primary">6</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categories</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-black text-slate-900 dark:text-white">24h</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery</p>
                                </div>
                            </div>

                            <Link
                                to="/products"
                                className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black px-8 py-4 rounded-2xl hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-xl hover:shadow-2xl hover:shadow-primary/20 uppercase tracking-wider text-sm"
                            >
                                Shop Now
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>

                        {/* Right - Featured Image Grid */}
                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="h-48 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded-3xl overflow-hidden relative group">
                                    <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400" alt="Fresh vegetables" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Vegetables</p>
                                    </div>
                                </div>
                                <div className="h-64 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-3xl overflow-hidden relative group">
                                    <img src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400" alt="Fresh fruits" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Fruits</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="h-64 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 rounded-3xl overflow-hidden relative group">
                                    <img src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400" alt="Dairy products" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Dairy</p>
                                    </div>
                                </div>
                                <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 rounded-3xl overflow-hidden relative group">
                                    <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" alt="Grains" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Grains</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Categories Section */}
                <div className="py-20">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-3 inline-block">Browse</span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Shop by Category</h2>
                        </div>
                        <Link to="/products" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-2">
                            View All Categories
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category, index) => (
                            <Link
                                key={category.path}
                                to={`/products/${category.path.toLowerCase()}`}
                                className="group relative bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                                    <img src={category.image} alt={category.text} className="w-10 h-10 object-contain" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white text-center group-hover:text-primary transition-colors">{category.text}</h3>
                                <p className="text-xs text-slate-400 text-center mt-1">
                                    {inStockProducts.filter(p => p.category.toLowerCase().replace(/\s+/g, '') === category.path.toLowerCase()).length} items
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Featured Products Section */}
                <div className="py-20">
                    <div
                        className="
      relative overflow-hidden
      rounded-[2.5rem]
      p-8 md:p-12
      bg-gray-300 dark:bg-gray-900
      text-gray-900 dark:text-gray-100
      shadow-2xl
      shadow-black/20 dark:shadow-primary/30
    "
                    >
                        {/* Decorative glows */}
                        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl
                    bg-white/30 dark:bg-white/10
                    -mr-48 -mt-48" />

                        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl
                    bg-black/20 dark:bg-black/40
                    -ml-32 -mb-32" />

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
                                <div>
                                    <span className="inline-flex items-center gap-2 font-bold tracking-[0.2em] text-[10px] uppercase mb-3
                           text-gray-700 dark:text-gray-300">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        Best Sellers
                                    </span>

                                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                                        Customer Favorites
                                    </h2>

                                    <p className="mt-2 text-sm font-medium max-w-md
                        text-gray-700 dark:text-gray-400">
                                        Our most loved products based on customer reviews and sales.
                                    </p>
                                </div>

                                {/* CTA */}
                                <Link
                                    to="/products"
                                    className="
            text-sm font-bold flex items-center gap-2
            px-5 py-2.5 rounded-xl backdrop-blur-sm
            bg-black/10 hover:bg-black/20
            dark:bg-white/10 dark:hover:bg-white/20
            transition-colors
          "
                                >
                                    View All
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>

                            {/* Products Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {featuredProducts.slice(0, 4).map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


                {/* All Products Section */}
                <div className="py-20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                        <div>
                            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-3 inline-block">Explore</span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">All Products</h2>
                        </div>

                        {/* Search & Filter */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-full sm:w-80' : 'w-full sm:w-64'}`}>
                                <div className={`flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 border-2 transition-all ${isSearchFocused ? 'border-primary shadow-lg shadow-primary/10' : 'border-transparent'}`}>
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        placeholder="Search products..."
                                        className="w-full bg-transparent ml-3 outline-none text-slate-800 dark:text-white placeholder-slate-400 font-medium text-sm"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <select
                                value={activeCategory}
                                onChange={(e) => setActiveCategory(e.target.value)}
                                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 rounded-xl font-medium text-sm border-2 border-transparent focus:border-primary outline-none cursor-pointer"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.path} value={cat.path}>{cat.text}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    {(searchQuery || activeCategory !== 'all') && (
                        <div className="mb-6 flex items-center gap-3">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Showing <span className="text-primary font-bold">{filteredProducts.length}</span> products
                            </p>
                            {(searchQuery || activeCategory !== 'all') && (
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                                    className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    Clear filters
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.slice(0, 1000).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="max-w-md mx-auto p-10 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No products found</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Try adjusting your search or filter to find what you're looking for.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {filteredProducts.length > 20 && (
                        <div className="mt-12 text-center">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg hover:shadow-xl"
                            >
                                View All {inStockProducts.length} Products
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Promo Banner */}
                <div className="py-12 mb-12">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">Free Delivery on Orders Over Rs. 500</h3>
                            <p className="text-slate-600 dark:text-slate-400 font-medium">Shop now and enjoy free delivery on your first order!</p>
                        </div>
                        <Link
                            to="/products"
                            className="shrink-0 bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
