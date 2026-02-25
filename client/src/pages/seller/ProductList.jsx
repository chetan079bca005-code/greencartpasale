import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const { products, currency, axios, fetchProducts } = useAppContext();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStock, setFilterStock] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('table');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12;

    const categories = useMemo(() => {
        const cats = [...new Set(products.map(p => p.category))];
        return cats.sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                (p.brand && p.brand.toLowerCase().includes(q)) ||
                (p.sku && p.sku.toLowerCase().includes(q))
            );
        }

        // Category filter
        if (filterCategory !== 'all') {
            result = result.filter(p => p.category === filterCategory);
        }

        // Stock filter
        if (filterStock === 'in-stock') result = result.filter(p => p.inStock);
        else if (filterStock === 'out-of-stock') result = result.filter(p => !p.inStock);

        // Sort
        switch (sortBy) {
            case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
            case 'oldest': result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
            case 'price-low': result.sort((a, b) => a.offerPrice - b.offerPrice); break;
            case 'price-high': result.sort((a, b) => b.offerPrice - a.offerPrice); break;
            case 'name-az': result.sort((a, b) => a.name.localeCompare(b.name)); break;
            default: break;
        }

        return result;
    }, [products, search, filterCategory, filterStock, sortBy]);

    const totalPages = Math.ceil(filteredProducts.length / perPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

    const stats = useMemo(() => ({
        total: products.length,
        inStock: products.filter(p => p.inStock).length,
        outOfStock: products.filter(p => !p.inStock).length,
        organic: products.filter(p => p.isOrganic).length,
        featured: products.filter(p => p.isFeatured).length,
        avgPrice: products.length ? Math.round(products.reduce((s, p) => s + p.offerPrice, 0) / products.length) : 0,
    }), [products]);

    const toggleStock = async (id, inStock) => {
        try {
            const { data } = await axios.post('/api/product/stock', { id, inStock });
            if (data.success) {
                await fetchProducts();
                toast.success(data.message || 'Stock updated');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update stock');
        }
    };

    const handleEdit = (product) => {
        navigate('/seller/edit-product', { state: { product } });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        try {
            setDeletingId(id);
            const { data } = await axios.delete(`/api/product/delete/${id}`);
            if (data.success) {
                await fetchProducts();
                toast.success(data.message || 'Product deleted');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50 dark:bg-slate-900 transition-colors">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Product Inventory</h1>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{filteredProducts.length} of {products.length} products</p>
                    </div>
                    <button
                        onClick={() => navigate('/seller/add-product')}
                        className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-primary to-emerald-500 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-95 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Product
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'Total Products', value: stats.total, icon: '📦', color: 'from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/5', text: 'text-blue-600 dark:text-blue-400' },
                        { label: 'In Stock', value: stats.inStock, icon: '✅', color: 'from-green-500/10 to-green-500/5 dark:from-green-500/20 dark:to-green-500/5', text: 'text-green-600 dark:text-green-400' },
                        { label: 'Out of Stock', value: stats.outOfStock, icon: '❌', color: 'from-red-500/10 to-red-500/5 dark:from-red-500/20 dark:to-red-500/5', text: 'text-red-600 dark:text-red-400' },
                        { label: 'Organic', value: stats.organic, icon: '🌿', color: 'from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/5', text: 'text-emerald-600 dark:text-emerald-400' },
                        { label: 'Featured', value: stats.featured, icon: '⭐', color: 'from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/5', text: 'text-amber-600 dark:text-amber-400' },
                        { label: 'Avg Price', value: `${currency}${stats.avgPrice}`, icon: '💰', color: 'from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/5', text: 'text-purple-600 dark:text-purple-400' },
                    ].map((stat, i) => (
                        <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 border border-gray-100 dark:border-gray-700/50`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-lg">{stat.icon}</span>
                            </div>
                            <p className={`text-xl font-black ${stat.text}`}>{stat.value}</p>
                            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters Bar */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                placeholder="Search by name, category, brand, SKU..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }} className="text-xs px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 outline-none focus:border-primary cursor-pointer">
                                <option value="all">All Categories</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <select value={filterStock} onChange={(e) => { setFilterStock(e.target.value); setCurrentPage(1); }} className="text-xs px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 outline-none focus:border-primary cursor-pointer">
                                <option value="all">All Stock</option>
                                <option value="in-stock">In Stock</option>
                                <option value="out-of-stock">Out of Stock</option>
                            </select>

                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 outline-none focus:border-primary cursor-pointer">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="price-low">Price: Low → High</option>
                                <option value="price-high">Price: High → Low</option>
                                <option value="name-az">Name: A → Z</option>
                            </select>

                            {/* View Toggle */}
                            <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-xl p-0.5">
                                <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                </button>
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products - Table View */}
                {viewMode === 'table' ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-700">
                                        <th className="text-left px-5 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Product</th>
                                        <th className="text-left px-5 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden lg:table-cell">Category</th>
                                        <th className="text-left px-5 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Price</th>
                                        <th className="text-left px-5 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden md:table-cell">Stock</th>
                                        <th className="text-center px-5 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                                        <th className="text-right px-5 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProducts.map((product) => {
                                        const discountPct = product.price > product.offerPrice ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;
                                        return (
                                            <tr key={product._id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0 border border-gray-200 dark:border-gray-600">
                                                            <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">{product.name}</p>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                {product.isOrganic && <span className="text-[9px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">🌿 Organic</span>}
                                                                {product.isFeatured && <span className="text-[9px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">⭐ Featured</span>}
                                                                {product.brand && <span className="text-[10px] text-gray-400">{product.brand}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 hidden lg:table-cell">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{currency}{product.offerPrice}</p>
                                                        {discountPct > 0 && (
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <span className="text-[10px] text-gray-400 line-through">{currency}{product.price}</span>
                                                                <span className="text-[10px] font-bold text-green-600">{discountPct}% off</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 hidden md:table-cell">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.countInStock || '—'}</p>
                                                    {product.weight && <p className="text-[10px] text-gray-400 mt-0.5">{product.weight}{product.unit && product.unit !== 'piece' ? ` ${product.unit}` : ''}</p>}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input onChange={() => toggleStock(product._id, !product.inStock)} checked={product.inStock} type="checkbox" className="sr-only peer" />
                                                        <div className="w-10 h-5.5 bg-gray-200 dark:bg-slate-600 rounded-full peer peer-checked:bg-primary transition-colors duration-200"></div>
                                                        <span className="absolute left-0.5 top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[18px] shadow-sm"></span>
                                                    </label>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEdit(product)} className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
                                                            disabled={deletingId === product._id}
                                                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-30"
                                                            title="Delete"
                                                        >
                                                            {deletingId === product._id ? (
                                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="py-16 text-center">
                                <div className="text-4xl mb-3">📦</div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No products found</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {paginatedProducts.map((product) => {
                            const discountPct = product.price > product.offerPrice ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;
                            return (
                                <div key={product._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                                    <div className="relative aspect-square bg-gray-100 dark:bg-slate-700 overflow-hidden">
                                        <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        {discountPct > 0 && (
                                            <span className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 bg-red-500 text-white rounded-lg">{discountPct}% OFF</span>
                                        )}
                                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                                            {product.isOrganic && <span className="text-[9px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-md">🌿</span>}
                                            {product.isFeatured && <span className="text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-md">⭐</span>}
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex items-center gap-2"> 
                                                <button onClick={() => handleEdit(product)} className="flex-1 py-1.5 text-[10px] font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">Edit</button>
                                                <button onClick={() => handleDelete(product._id)} disabled={deletingId === product._id} className="flex-1 py-1.5 text-[10px] font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
                                                    {deletingId === product._id ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">{product.category}</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input onChange={() => toggleStock(product._id, !product.inStock)} checked={product.inStock} type="checkbox" className="sr-only peer" />
                                                <div className="w-8 h-4.5 bg-gray-200 dark:bg-slate-600 rounded-full peer peer-checked:bg-primary transition-colors"></div>
                                                <span className="absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-3.5 shadow-sm"></span>
                                            </label>
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{product.name}</h3>
                                        {product.brand && <p className="text-[10px] text-gray-400 mb-2">by {product.brand}</p>}
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-black text-primary">{currency}{product.offerPrice}</span>
                                            {discountPct > 0 && <span className="text-xs text-gray-400 line-through">{currency}{product.price}</span>}
                                        </div>
                                        {product.weight && <p className="text-[10px] text-gray-400 mt-1">{product.weight} {product.unit && product.unit !== 'piece' ? product.unit : ''}</p>}
                                    </div>
                                </div>
                            );
                        })}

                        {filteredProducts.length === 0 && (
                            <div className="col-span-full py-16 text-center">
                                <div className="text-4xl mb-3">📦</div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No products found</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Showing {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, filteredProducts.length)} of {filteredProducts.length}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                            >Prev</button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let page;
                                if (totalPages <= 5) page = i + 1;
                                else if (currentPage <= 3) page = i + 1;
                                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                                else page = currentPage - 2 + i;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 text-xs font-bold rounded-lg transition-colors ${currentPage === page ? 'bg-primary text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                                    >{page}</button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                            >Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
