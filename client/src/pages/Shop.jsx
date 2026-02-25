import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

// ─── Floating 3D Shape Component ────────────────────────────────────
const FloatingShape = ({ className, delay = 0, duration = 6, children }) => (
    <div
        className={`absolute pointer-events-none select-none ${className}`}
        style={{
            animation: `float3D ${duration}s ease-in-out ${delay}s infinite`,
        }}
    >
        {children}
    </div>
);

// ─── 3D Product Card for Hero ───────────────────────────────────────
const Hero3DCard = ({ product, currency, index, navigate }) => {
    const ref = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        ref.current.style.transform = `perspective(800px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale3d(1.04,1.04,1.04)`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!ref.current) return;
        ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    }, []);

    if (!product) return null;
    const catPath = (product.category || '').toLowerCase().replace(/\s+/g, '');

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => { navigate(`/products/${catPath}/${product._id}`); window.scrollTo(0, 0); }}
            className="cursor-pointer group"
            style={{
                transition: 'transform 0.15s ease-out',
                transformStyle: 'preserve-3d',
                animation: `fadeSlideUp 0.7s ease-out ${index * 0.12}s both`,
            }}
        >
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/50 dark:border-slate-700/50 shadow-xl shadow-black/5 dark:shadow-black/30 hover:shadow-2xl hover:shadow-primary/20 transition-shadow duration-500">
                {/* Holographic shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-primary/5 dark:from-white/5 dark:via-transparent dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

                <div className="relative aspect-square overflow-hidden">
                    <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                    />
                    {/* Gradient fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {product.price > product.offerPrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg" style={{ transform: 'translateZ(30px)' }}>
                            -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
                        </div>
                    )}

                    {/* Quick-view badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-white text-xs font-bold drop-shadow-lg truncate">{product.name}</span>
                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-primary font-black text-xs px-2.5 py-1 rounded-full shadow">
                            {currency}{product.offerPrice}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Animated Counter ───────────────────────────────────────────────
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const counted = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !counted.current) {
                counted.current = true;
                const start = 0;
                const startTime = performance.now();
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(start + (end - start) * eased));
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
};

// ─── Section Reveal Wrapper ─────────────────────────────────────────
const RevealSection = ({ children, className = '' }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
        }, { threshold: 0.1, rootMargin: '50px' });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
        >
            {children}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
//  MAIN SHOP COMPONENT
// ═══════════════════════════════════════════════════════════════════
const Shop = () => {
    const { products, currency, searchQuery, setSearchQuery, navigate, addToCart } = useAppContext();

    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [viewMode, setViewMode] = useState('grid');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [showFilters, setShowFilters] = useState(false);
    const [loadCount, setLoadCount] = useState(20);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    // In-stock products
    const inStockProducts = products.filter(p => p.inStock === true);

    // Find max price for range slider
    const maxPrice = Math.max(...inStockProducts.map(p => p.offerPrice || p.price || 0), 100);

    useEffect(() => { setPriceRange([0, maxPrice]); }, [maxPrice]);

    // Filter + Sort
    const filteredProducts = inStockProducts
        .filter(product => {
            const matchesCategory = activeCategory === 'all' ||
                product.category.toLowerCase().replace(/\s+/g, '') === activeCategory.toLowerCase();
            const matchesSearch = product.name.toLowerCase().includes((searchQuery || '').toLowerCase());
            const price = product.offerPrice || product.price;
            const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
            return matchesCategory && matchesSearch && matchesPrice;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low': return (a.offerPrice || a.price) - (b.offerPrice || b.price);
                case 'price-high': return (b.offerPrice || b.price) - (a.offerPrice || a.price);
                case 'name-az': return a.name.localeCompare(b.name);
                case 'name-za': return b.name.localeCompare(a.name);
                case 'discount': {
                    const dA = a.price > a.offerPrice ? ((a.price - a.offerPrice) / a.price) : 0;
                    const dB = b.price > b.offerPrice ? ((b.price - b.offerPrice) / b.price) : 0;
                    return dB - dA;
                }
                default: return 0;
            }
        });

    // Hero featured products (top 6 by variety)
    const heroProducts = inStockProducts.slice(0, 6);

    // Trending: products with biggest discounts
    const trendingProducts = [...inStockProducts]
        .filter(p => p.price > p.offerPrice)
        .sort((a, b) => {
            const dA = (a.price - a.offerPrice) / a.price;
            const dB = (b.price - b.offerPrice) / b.price;
            return dB - dA;
        })
        .slice(0, 8);

    const clearFilters = () => {
        setSearchQuery('');
        setActiveCategory('all');
        setSortBy('default');
        setPriceRange([0, maxPrice]);
    };

    const hasActiveFilters = searchQuery || activeCategory !== 'all' || sortBy !== 'default' || priceRange[0] > 0 || priceRange[1] < maxPrice;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">

            {/* ══════════════════════════════════════════════════
                SECTION 1: IMMERSIVE 3D HERO
            ══════════════════════════════════════════════════ */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                {/* Animated background mesh */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/8 via-white to-emerald-50/50 dark:from-primary/15 dark:via-slate-950 dark:to-slate-900" />

                    {/* Animated gradient orbs */}
                    <div className="absolute top-20 -right-32 w-[500px] h-[500px] bg-primary/15 dark:bg-primary/25 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-emerald-400/10 dark:bg-emerald-400/15 rounded-full blur-[100px]" style={{ animation: 'float3D 8s ease-in-out infinite' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-300/5 dark:bg-teal-500/10 rounded-full blur-[140px]" />

                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }}
                    />
                </div>

                {/* 3D Floating decorative elements */}
                <FloatingShape className="top-[15%] left-[8%] opacity-20 dark:opacity-30" delay={0} duration={7}>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 rotate-12" style={{ transform: 'perspective(200px) rotateX(20deg) rotateY(-20deg)' }} />
                </FloatingShape>
                <FloatingShape className="top-[25%] right-[12%] opacity-15 dark:opacity-25" delay={1.5} duration={8}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                </FloatingShape>
                <FloatingShape className="bottom-[20%] left-[15%] opacity-10 dark:opacity-20" delay={3} duration={6}>
                    <div className="w-20 h-20 rounded-3xl border-2 border-primary/30 rotate-45" style={{ transform: 'perspective(200px) rotateX(-15deg) rotateY(25deg) rotate(45deg)' }} />
                </FloatingShape>
                <FloatingShape className="bottom-[30%] right-[5%] opacity-10 dark:opacity-20" delay={2} duration={9}>
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-lg rotate-12" />
                </FloatingShape>
                <FloatingShape className="top-[60%] left-[45%] opacity-10 dark:opacity-15" delay={4} duration={10}>
                    <svg className="w-10 h-10 text-primary/40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                </FloatingShape>

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-4 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left: Content */}
                        <div className="text-center lg:text-left" style={{ animation: 'fadeSlideUp 0.8s ease-out both' }}>
                            <div className="inline-flex items-center gap-2 text-primary font-bold tracking-[0.25em] text-[10px] uppercase mb-6 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 px-4 py-2 rounded-full backdrop-blur-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Fresh & Organic
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[0.95]">
                                Discover
                                <br />
                                <span className="relative">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-teal-500 dark:from-primary dark:via-emerald-400 dark:to-teal-400">
                                        Fresh
                                    </span>
                                    {/* Underline decoration */}
                                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" fill="none">
                                        <path d="M2 8C30 2 60 2 100 6C140 10 170 4 198 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <br />
                                <span className="text-slate-700 dark:text-slate-300">Goodness</span>
                            </h1>

                            <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed mb-10">
                                Premium groceries sourced daily from trusted local farmers. Experience the future of fresh shopping with AI-powered recommendations.
                            </p>

                            {/* Animated Stats */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-10">
                                {[
                                    { value: inStockProducts.length, suffix: '+', label: 'Products', color: 'text-slate-900 dark:text-white' },
                                    { value: categories.length, suffix: '', label: 'Categories', color: 'text-primary' },
                                    { value: 24, suffix: 'h', label: 'Delivery', color: 'text-slate-900 dark:text-white' },
                                    { value: 99, suffix: '%', label: 'Fresh Rate', color: 'text-emerald-500' },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center group">
                                        <p className={`text-3xl md:text-4xl font-black ${stat.color} transition-transform group-hover:scale-110`}>
                                            <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <a
                                    href="#shop-products"
                                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary to-emerald-500 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <span className="text-sm uppercase tracking-wider">Explore Now</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 font-bold px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm uppercase tracking-wider"
                                >
                                    View All
                                </Link>
                            </div>
                        </div>

                        {/* Right: 3D Product Showcase */}
                        <div className="hidden lg:block" style={{ perspective: '1200px', animation: 'fadeSlideUp 1s ease-out 0.3s both' }}>
                            <div className="grid grid-cols-3 gap-3" style={{ transformStyle: 'preserve-3d' }}>
                                {heroProducts.slice(0, 6).map((product, i) => (
                                    <Hero3DCard
                                        key={product._id}
                                        product={product}
                                        currency={currency}
                                        index={i}
                                        navigate={navigate}
                                    />
                                ))}
                            </div>
                            {/* Reflection effect */}
                            <div className="mt-2 h-24 bg-gradient-to-b from-slate-200/20 to-transparent dark:from-slate-500/10 rounded-3xl blur-sm opacity-50"
                                style={{ transform: 'perspective(800px) rotateX(60deg) scaleY(0.3)', transformOrigin: 'top' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Scroll</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                SECTION 2: CATEGORY EXPLORER (3D TILT CARDS)
            ══════════════════════════════════════════════════ */}
            <RevealSection>
                <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="inline-flex items-center gap-2 text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-3">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                Browse
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                Shop by Category
                            </h2>
                        </div>
                        <Link to="/products" className="text-sm font-bold text-primary hover:text-emerald-600 transition-colors flex items-center gap-2 group">
                            View All
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                        {categories.map((category, index) => {
                            const count = inStockProducts.filter(p => p.category.toLowerCase().replace(/\s+/g, '') === category.path.toLowerCase()).length;
                            const isHovered = hoveredCategory === index;

                            return (
                                <Link
                                    key={category.path}
                                    to={`/products/${category.path.toLowerCase()}`}
                                    onMouseEnter={() => setHoveredCategory(index)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                    className="group relative"
                                    style={{ animation: `fadeSlideUp 0.5s ease-out ${index * 0.08}s both` }}
                                >
                                    <div
                                        className={`relative bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-5 border transition-all duration-300 overflow-hidden ${isHovered
                                                ? 'border-primary shadow-xl shadow-primary/15 -translate-y-2 scale-[1.02]'
                                                : 'border-slate-200/80 dark:border-slate-700/50 hover:border-primary/50'
                                            }`}
                                    >
                                        {/* Background glow on hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-emerald-500/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                                        <div className="relative z-10">
                                            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-all duration-300"
                                                style={{ backgroundColor: isHovered ? 'rgb(var(--color-primary) / 0.15)' : category.bgColor + '40' }}
                                            >
                                                <img
                                                    src={category.image}
                                                    alt={category.text}
                                                    className={`w-9 h-9 object-contain transition-transform duration-300 ${isHovered ? 'scale-110 -rotate-6' : ''}`}
                                                />
                                            </div>
                                            <h3 className="text-xs font-bold text-slate-800 dark:text-white text-center group-hover:text-primary transition-colors leading-tight">
                                                {category.text}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 text-center mt-1 font-medium">{count} items</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </RevealSection>

            {/* ══════════════════════════════════════════════════
                SECTION 3: TRENDING DEALS (Horizontal scroll)
            ══════════════════════════════════════════════════ */}
            {trendingProducts.length > 0 && (
                <RevealSection>
                    <section className="py-16">
                        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <span className="inline-flex items-center gap-2 text-red-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-3">
                                        <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                                        Hot Deals
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                        Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Offers</span>
                                    </h2>
                                </div>
                                <Link to="/products" className="hidden sm:flex text-sm font-bold text-primary items-center gap-2 group">
                                    See All
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            </div>
                        </div>

                        {/* Horizontal scroll container */}
                        <div className="relative">
                            <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 md:px-12 pb-4 snap-x snap-mandatory">
                                {trendingProducts.map((product, i) => {
                                    const discount = Math.round(((product.price - product.offerPrice) / product.price) * 100);
                                    const catPath = (product.category || '').toLowerCase().replace(/\s+/g, '');

                                    return (
                                        <div
                                            key={product._id}
                                            className="group flex-shrink-0 w-[280px] sm:w-[300px] snap-start"
                                            style={{ animation: `fadeSlideUp 0.5s ease-out ${i * 0.1}s both` }}
                                        >
                                            <div
                                                onClick={() => { navigate(`/products/${catPath}/${product._id}`); window.scrollTo(0, 0); }}
                                                className="relative bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 cursor-pointer hover:-translate-y-1"
                                            >
                                                {/* Discount badge */}
                                                <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                                                    {discount}% OFF
                                                </div>

                                                <div className="relative h-52 overflow-hidden">
                                                    <img
                                                        src={product.image[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                                </div>

                                                <div className="p-4">
                                                    <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate group-hover:text-primary transition-colors">{product.name}</h3>
                                                    <p className="text-xs text-slate-400 mt-1 capitalize">{product.category}</p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-lg font-black text-primary">{currency}{product.offerPrice}</span>
                                                            <span className="text-xs text-slate-400 line-through">{currency}{product.price}</span>
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); addToCart(product._id); }}
                                                            className="p-2 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary hover:bg-primary hover:text-white transition-all"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Fade edges */}
                            <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-white dark:from-slate-950 to-transparent pointer-events-none z-10" />
                            <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none z-10" />
                        </div>
                    </section>
                </RevealSection>
            )}

            {/* ══════════════════════════════════════════════════
                SECTION 4: MAIN PRODUCT EXPLORER
            ══════════════════════════════════════════════════ */}
            <section id="shop-products" className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                <RevealSection>
                    {/* Section Header */}
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <span className="inline-flex items-center gap-2 text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-3">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    Explore
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">All Products</h2>
                            </div>

                            {/* Top controls */}
                            <div className="flex items-center gap-2">
                                {/* Mobile filter toggle */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${showFilters ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                    Filters
                                    {hasActiveFilters && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                                </button>

                                {/* View mode */}
                                <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                                    {['grid', 'list'].map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => setViewMode(mode)}
                                            className={`p-2 rounded-lg transition-all ${viewMode === mode ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {mode === 'grid' ? (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className={`flex flex-col md:flex-row gap-3 ${showFilters ? 'block' : 'hidden md:flex'}`}>
                            {/* Search */}
                            <div className={`relative flex-1 transition-all duration-300 ${isSearchFocused ? 'md:flex-[2]' : ''}`}>
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    placeholder="Search products..."
                                    className={`w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-xl text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 outline-none border-2 transition-all ${isSearchFocused ? 'border-primary shadow-lg shadow-primary/10' : 'border-slate-200 dark:border-slate-700'}`}
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>

                            {/* Category Filter */}
                            <select
                                value={activeCategory}
                                onChange={(e) => setActiveCategory(e.target.value)}
                                className="bg-white dark:bg-slate-800/80 backdrop-blur-sm text-slate-800 dark:text-white px-4 py-3 rounded-xl font-medium text-sm border-2 border-slate-200 dark:border-slate-700 focus:border-primary outline-none cursor-pointer min-w-[160px]"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.path} value={cat.path}>{cat.text}</option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white dark:bg-slate-800/80 backdrop-blur-sm text-slate-800 dark:text-white px-4 py-3 rounded-xl font-medium text-sm border-2 border-slate-200 dark:border-slate-700 focus:border-primary outline-none cursor-pointer min-w-[160px]"
                            >
                                <option value="default">Sort: Default</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name-az">Name: A to Z</option>
                                <option value="name-za">Name: Z to A</option>
                                <option value="discount">Biggest Discount</option>
                            </select>

                            {/* Price Range */}
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 min-w-[200px]">
                                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{currency}{priceRange[0]}</span>
                                <input
                                    type="range"
                                    min={0}
                                    max={maxPrice}
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="flex-1 accent-primary h-1.5 cursor-pointer"
                                />
                                <span className="text-xs font-bold text-primary whitespace-nowrap">{currency}{priceRange[1]}</span>
                            </div>
                        </div>

                        {/* Active filter pills */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-medium text-slate-500">Active:</span>
                                {searchQuery && (
                                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                        "{searchQuery}"
                                        <button onClick={() => setSearchQuery('')} className="hover:text-red-500">×</button>
                                    </span>
                                )}
                                {activeCategory !== 'all' && (
                                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                        {categories.find(c => c.path === activeCategory)?.text || activeCategory}
                                        <button onClick={() => setActiveCategory('all')} className="hover:text-red-500">×</button>
                                    </span>
                                )}
                                {sortBy !== 'default' && (
                                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                        Sorted
                                        <button onClick={() => setSortBy('default')} className="hover:text-red-500">×</button>
                                    </span>
                                )}
                                <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors ml-2">
                                    Clear All
                                </button>
                                <span className="ml-auto text-sm font-medium text-slate-500 dark:text-slate-400">
                                    <span className="text-primary font-bold">{filteredProducts.length}</span> results
                                </span>
                            </div>
                        )}
                    </div>
                </RevealSection>

                {/* Products Grid / List */}
                {filteredProducts.length > 0 ? (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredProducts.slice(0, loadCount).map((product, i) => (
                                    <div key={product._id} style={{ animation: `fadeSlideUp 0.4s ease-out ${Math.min(i * 0.03, 0.5)}s both` }}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* List View */
                            <div className="space-y-3">
                                {filteredProducts.slice(0, loadCount).map((product, i) => {
                                    const catPath = (product.category || '').toLowerCase().replace(/\s+/g, '');
                                    return (
                                        <div
                                            key={product._id}
                                            onClick={() => { navigate(`/products/${catPath}/${product._id}`); window.scrollTo(0, 0); }}
                                            className="flex items-center gap-4 bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                                            style={{ animation: `fadeSlideUp 0.4s ease-out ${Math.min(i * 0.03, 0.5)}s both` }}
                                        >
                                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-900">
                                                <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate group-hover:text-primary transition-colors">{product.name}</h3>
                                                <p className="text-xs text-slate-400 capitalize mt-0.5">{product.category}</p>
                                            </div>
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <div className="text-right">
                                                    <p className="font-black text-primary text-sm">{currency}{product.offerPrice}</p>
                                                    {product.price > product.offerPrice && (
                                                        <p className="text-[10px] text-slate-400 line-through">{currency}{product.price}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); addToCart(product._id); }}
                                                    className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary hover:bg-primary hover:text-white transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Load More */}
                        {filteredProducts.length > loadCount && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => setLoadCount(prev => prev + 20)}
                                    className="group inline-flex items-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-8 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                                >
                                    <span className="text-sm">Load More Products</span>
                                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full font-black">
                                        {filteredProducts.length - loadCount}+
                                    </span>
                                    <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <RevealSection>
                        <div className="py-24 text-center">
                            <div className="max-w-md mx-auto bg-white dark:bg-slate-800/80 backdrop-blur-sm p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
                                <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-700 rounded-3xl flex items-center justify-center">
                                    <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">No products found</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Try adjusting your filters or search terms</p>
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </RevealSection>
                )}
            </section>

            {/* ══════════════════════════════════════════════════
                SECTION 5: FEATURES / TRUST BANNER
            ══════════════════════════════════════════════════ */}
            <RevealSection>
                <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            {
                                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
                                title: 'Free Delivery',
                                desc: 'On orders ₨500+',
                                gradient: 'from-blue-500 to-cyan-500'
                            },
                            {
                                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                                title: '100% Organic',
                                desc: 'Certified fresh',
                                gradient: 'from-emerald-500 to-green-500'
                            },
                            {
                                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                                title: '24h Delivery',
                                desc: 'Fast & reliable',
                                gradient: 'from-amber-500 to-orange-500'
                            },
                            {
                                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
                                title: 'Secure Payment',
                                desc: 'Stripe & eSewa',
                                gradient: 'from-violet-500 to-purple-500'
                            },
                        ].map((feature, i) => (
                            <div
                                key={feature.title}
                                className="group relative bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                style={{ animation: `fadeSlideUp 0.5s ease-out ${i * 0.1}s both` }}
                            >
                                {/* Subtle gradient bg on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1">{feature.title}</h3>
                                <p className="text-xs text-slate-400 font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </RevealSection>

            {/* ══════════════════════════════════════════════════
                SECTION 6: PROMO / CTA BANNER
            ══════════════════════════════════════════════════ */}
            <RevealSection>
                <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 p-8 md:p-14">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40" />
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/15 rounded-full blur-[80px] -ml-30 -mb-30" />
                        <FloatingShape className="top-8 right-20 opacity-20" delay={0} duration={6}>
                            <div className="w-10 h-10 border border-white/30 rounded-lg rotate-45" />
                        </FloatingShape>
                        <FloatingShape className="bottom-10 right-40 opacity-15" delay={2} duration={8}>
                            <div className="w-6 h-6 bg-primary/40 rounded-full" />
                        </FloatingShape>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <span className="inline-flex items-center gap-2 text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-4 bg-primary/20 px-4 py-1.5 rounded-full">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" /></svg>
                                    Limited Offer
                                </span>
                                <h3 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
                                    Free Delivery on
                                    <br />
                                    Orders Over <span className="text-primary">Rs. 500</span>
                                </h3>
                                <p className="text-slate-400 font-medium text-sm max-w-md">
                                    Shop fresh groceries and get them delivered to your doorstep. First-time users get an exclusive welcome bonus!
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    to="/products"
                                    className="group inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 text-sm uppercase tracking-wider"
                                >
                                    Start Shopping
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                                <Link
                                    to="/about"
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm uppercase tracking-wider"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </RevealSection>
        </div>
    );
};

export default Shop;
