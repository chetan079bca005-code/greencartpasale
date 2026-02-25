import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const unitOptions = ['piece', 'kg', 'g', 'L', 'ml', 'packet', 'bottle', 'dozen', 'box', 'bundle'];

const tagSuggestions = ['organic', 'fresh', 'local', 'imported', 'gluten-free', 'vegan', 'sugar-free', 'dairy-free', 'premium', 'seasonal', 'bestseller', 'new-arrival'];

const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 flex items-center justify-center text-primary text-lg flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const InputField = ({ label, required, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
      {label}
      {required && <span className="text-red-400 text-sm">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-gray-400 dark:text-gray-500">{hint}</p>}
  </div>
);

const EditProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { axios } = useAppContext();
    const { product } = location.state || {};

    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [existingImages, setExistingImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New advanced fields
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('piece');
    const [brand, setBrand] = useState('');
    const [sku, setSku] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [origin, setOrigin] = useState('');
    const [shelfLife, setShelfLife] = useState('');
    const [isOrganic, setIsOrganic] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [countInStock, setCountInStock] = useState('100');
    const [minimumOrderQty, setMinimumOrderQty] = useState('1');
    const [maxOrderQty, setMaxOrderQty] = useState('50');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [fiber, setFiber] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const discount = price && offerPrice ? Math.round(((price - offerPrice) / price) * 100) : 0;

    useEffect(() => {
        if (!product) {
            navigate('/seller/product-list');
            return;
        }

        setName(product.name || '');
        setDescription(Array.isArray(product.description) ? product.description.join('\n') : product.description || '');
        setCategory(product.category || '');
        setPrice(product.price || '');
        setOfferPrice(product.offerPrice || '');
        setExistingImages(product.image || []);
        setWeight(product.weight || '');
        setUnit(product.unit || 'piece');
        setBrand(product.brand || '');
        setSku(product.sku || '');
        setTags(product.tags || []);
        setOrigin(product.origin || '');
        setShelfLife(product.shelfLife || '');
        setIsOrganic(product.isOrganic || false);
        setIsFeatured(product.isFeatured || false);
        setCountInStock(product.countInStock?.toString() || '100');
        setMinimumOrderQty(product.minimumOrderQty?.toString() || '1');
        setMaxOrderQty(product.maxOrderQty?.toString() || '50');
        setCalories(product.nutritionalInfo?.calories || '');
        setProtein(product.nutritionalInfo?.protein || '');
        setCarbs(product.nutritionalInfo?.carbs || '');
        setFat(product.nutritionalInfo?.fat || '');
        setFiber(product.nutritionalInfo?.fiber || '');
    }, [product, navigate]);

    const addTag = (tag) => {
        const trimmed = tag.trim().toLowerCase();
        if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
            setTags([...tags, trimmed]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        const totalSlots = 6 - existingImages.length;
        const updatedFiles = [...files, ...droppedFiles].slice(0, totalSlots);
        setFiles(updatedFiles);
    };

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            if (existingImages.length === 0 && files.length === 0) {
                toast.error('Please have at least one product image');
                return;
            }
            setIsSubmitting(true);

            const productData = {
                name,
                description: description.split('\n').filter(line => line.trim()),
                category,
                price: Number(price),
                offerPrice: Number(offerPrice),
                image: existingImages,
                weight,
                unit,
                brand,
                sku,
                tags,
                origin,
                shelfLife,
                isOrganic,
                isFeatured,
                countInStock: Number(countInStock) || 100,
                minimumOrderQty: Number(minimumOrderQty) || 1,
                maxOrderQty: Number(maxOrderQty) || 50,
                nutritionalInfo: { calories, protein, carbs, fat, fiber },
            };

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                if (files[i]) formData.append('images', files[i]);
            }

            const { data } = await axios.put(`/api/product/update/${product._id}`, formData);

            if (data.success) {
                toast.success(data.message);
                navigate('/seller/product-list');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error(error.response?.data?.message || 'Failed to update product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageRemove = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const inputClass = "w-full outline-none py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600";
    const selectClass = "w-full outline-none py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer";

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50 dark:bg-slate-900 transition-colors">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/seller/product-list')} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Editing: {product?.name || 'Product'}</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-lg">ID: {product?._id?.slice(-8)}</span>
                </div>
            </div>

            <form onSubmit={onSubmitHandler} className="max-w-5xl mx-auto p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <SectionHeader icon="📋" title="Basic Information" subtitle="Product name, description and category" />
                            <div className="space-y-5">
                                <InputField label="Product Name" required>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fresh Organic Tomatoes" className={inputClass} required />
                                </InputField>

                                <InputField label="Product Description" required hint="Each line becomes a bullet point">
                                    <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} resize-none`} placeholder="Line 1: Main feature..." required />
                                </InputField>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="Category" required>
                                        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass} required>
                                            <option value="">Select Category</option>
                                            {categories.map((item, index) => (
                                                <option key={index} value={item.path}>{item.text} ({item.path})</option>
                                            ))}
                                        </select>
                                    </InputField>
                                    <InputField label="Brand">
                                        <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Farm Fresh" className={inputClass} />
                                    </InputField>
                                </div>

                                <InputField label="SKU">
                                    <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. VEG-TOM-001" className={inputClass} />
                                </InputField>
                            </div>
                        </div>

                        {/* Product Images */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <SectionHeader icon="📸" title="Product Media" subtitle="Manage existing images or upload new ones" />

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">Current Images ({existingImages.length})</p>
                                    <div className="flex flex-wrap gap-3">
                                        {existingImages.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img src={image} alt={`Product ${index + 1}`} className="w-24 h-24 object-cover rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-sm" />
                                                <button type="button" onClick={() => handleImageRemove(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">×</button>
                                                {index === 0 && <span className="absolute bottom-1 left-1 text-[8px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-md">Main</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload new */}
                            {(existingImages.length + files.length) < 6 && (
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${dragOver ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Add more images</p>
                                        <p className="text-xs text-gray-400">Drag & drop or click to browse • {6 - existingImages.length - files.length} slots remaining</p>
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors">Browse</button>
                                    </div>
                                    <input ref={fileInputRef} type="file" hidden multiple accept="image/*" onChange={(e) => {
                                        const maxNew = 6 - existingImages.length;
                                        const newFiles = [...files, ...Array.from(e.target.files || [])].slice(0, maxNew);
                                        setFiles(newFiles);
                                        e.target.value = '';
                                    }} />
                                </div>
                            )}

                            {/* New file previews */}
                            {files.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">New Images ({files.length})</p>
                                    <div className="flex flex-wrap gap-3">
                                        {files.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <img src={URL.createObjectURL(file)} alt={`New ${index + 1}`} className="w-24 h-24 object-cover rounded-xl border-2 border-primary/30 shadow-sm" />
                                                <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== index))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                                <span className="absolute bottom-1 left-1 text-[8px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-md">New</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pricing & Stock */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <SectionHeader icon="💰" title="Pricing & Stock" subtitle="Set pricing, discount and inventory" />
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <InputField label="Regular Price" required>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₹</span>
                                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className={`${inputClass} pl-8`} required min="0" step="0.01" />
                                        </div>
                                    </InputField>
                                    <InputField label="Offer Price" required>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₹</span>
                                            <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="0.00" className={`${inputClass} pl-8`} required min="0" step="0.01" />
                                        </div>
                                    </InputField>
                                    <InputField label="Discount">
                                        <div className={`w-full py-2.5 px-4 rounded-xl border text-sm font-bold text-center ${discount > 0 ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-600' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700 text-gray-400'}`}>
                                            {discount > 0 ? `${discount}% OFF` : 'No discount'}
                                        </div>
                                    </InputField>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <InputField label="Stock Quantity">
                                        <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} placeholder="100" className={inputClass} min="0" />
                                    </InputField>
                                    <InputField label="Min Order Qty">
                                        <input type="number" value={minimumOrderQty} onChange={(e) => setMinimumOrderQty(e.target.value)} placeholder="1" className={inputClass} min="1" />
                                    </InputField>
                                    <InputField label="Max Order Qty">
                                        <input type="number" value={maxOrderQty} onChange={(e) => setMaxOrderQty(e.target.value)} placeholder="50" className={inputClass} min="1" />
                                    </InputField>
                                </div>
                            </div>
                        </div>

                        {/* Nutritional Info */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <SectionHeader icon="🥗" title="Nutritional Information" subtitle="Optional — helps customers make informed choices" />
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                {[
                                    { label: 'Calories', value: calories, set: setCalories, placeholder: 'e.g. 25 kcal', color: 'text-orange-500' },
                                    { label: 'Protein', value: protein, set: setProtein, placeholder: 'e.g. 2g', color: 'text-blue-500' },
                                    { label: 'Carbs', value: carbs, set: setCarbs, placeholder: 'e.g. 5g', color: 'text-yellow-500' },
                                    { label: 'Fat', value: fat, set: setFat, placeholder: 'e.g. 0.3g', color: 'text-red-500' },
                                    { label: 'Fiber', value: fiber, set: setFiber, placeholder: 'e.g. 1.5g', color: 'text-green-500' },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-1.5">
                                        <label className={`text-xs font-bold ${item.color}`}>{item.label}</label>
                                        <input type="text" value={item.value} onChange={(e) => item.set(e.target.value)} placeholder={item.placeholder} className={inputClass} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Preview */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm sticky top-24">
                            <SectionHeader icon="👁" title="Live Preview" subtitle="How it appears to customers" />
                            <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-slate-900 p-3">
                                <div className="aspect-square rounded-lg overflow-hidden bg-white dark:bg-slate-800 mb-3 flex items-center justify-center">
                                    {existingImages[0] || files[0] ? (
                                        <img src={existingImages[0] || (files[0] && URL.createObjectURL(files[0]))} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-300 dark:text-gray-600">
                                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <p className="text-xs">No image</p>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {isOrganic && <span className="inline-block text-[9px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">🌿 Organic</span>}
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{name || 'Product Name'}</h4>
                                    <p className="text-[10px] text-gray-400">{category || 'Category'} {weight && `• ${weight}${unit !== 'piece' ? unit : ''}`}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-black text-primary">₹{offerPrice || '0'}</span>
                                        {price && offerPrice && Number(price) > Number(offerPrice) && (
                                            <>
                                                <span className="text-xs text-gray-400 line-through">₹{price}</span>
                                                <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">{discount}% off</span>
                                            </>
                                        )}
                                    </div>
                                    {brand && <p className="text-[10px] text-gray-400">by {brand}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <SectionHeader icon="📦" title="Product Details" subtitle="Specifications and attributes" />
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Weight/Size">
                                        <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 500" className={inputClass} />
                                    </InputField>
                                    <InputField label="Unit">
                                        <select value={unit} onChange={(e) => setUnit(e.target.value)} className={selectClass}>
                                            {unitOptions.map(u => (<option key={u} value={u}>{u}</option>))}
                                        </select>
                                    </InputField>
                                </div>
                                <InputField label="Origin / Source">
                                    <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Nepal, Local Farm" className={inputClass} />
                                </InputField>
                                <InputField label="Shelf Life">
                                    <input type="text" value={shelfLife} onChange={(e) => setShelfLife(e.target.value)} placeholder="e.g. 7 days" className={inputClass} />
                                </InputField>

                                {/* Tags */}
                                <InputField label="Product Tags" hint="Press Enter to add • Max 10">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-1.5">
                                            {tags.map((tag, i) => (
                                                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary text-xs font-semibold rounded-lg">
                                                    #{tag}
                                                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">×</button>
                                                </span>
                                            ))}
                                        </div>
                                        <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }} placeholder="Type a tag..." className={inputClass} />
                                        <div className="flex flex-wrap gap-1">
                                            {tagSuggestions.filter(s => !tags.includes(s)).slice(0, 6).map((s, i) => (
                                                <button key={i} type="button" onClick={() => addTag(s)} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors">+{s}</button>
                                            ))}
                                        </div>
                                    </div>
                                </InputField>

                                {/* Toggles */}
                                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">🌿</span>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Organic Product</p>
                                                <p className="text-[10px] text-gray-400">Mark if certified organic</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input type="checkbox" checked={isOrganic} onChange={(e) => setIsOrganic(e.target.checked)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 rounded-full peer peer-checked:bg-primary transition-colors"></div>
                                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
                                        </div>
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">⭐</span>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Featured Product</p>
                                                <p className="text-[10px] text-gray-400">Show on homepage spotlight</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 rounded-full peer peer-checked:bg-primary transition-colors"></div>
                                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Bar */}
                <div className="sticky bottom-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-lg p-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400 hidden sm:block">Changes will update the product across all pages</p>
                    <div className="flex items-center gap-3 ml-auto">
                        <button type="button" onClick={() => navigate('/seller/product-list')} className="px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-primary to-emerald-500 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center gap-2">
                            {isSubmitting ? (
                                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Saving...</>
                            ) : (
                                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Save Changes</>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProduct; 