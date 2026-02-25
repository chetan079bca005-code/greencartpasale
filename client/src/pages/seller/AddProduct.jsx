import React, { useState, useRef } from 'react';
import { assets, categories } from '../../assets/assets';
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

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const { axios } = useAppContext();

  const discount = price && offerPrice ? Math.round(((price - offerPrice) / price) * 100) : 0;

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
    const updatedFiles = [...files];
    droppedFiles.forEach((file, i) => {
      if (updatedFiles.length < 6) updatedFiles.push(file);
    });
    setFiles(updatedFiles.slice(0, 6));
  };

  const removeImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      if (files.length === 0) {
        toast.error('Please upload at least one product image');
        return;
      }
      setIsSubmitting(true);

      const productData = {
        name,
        description: description.split('\n').filter(line => line.trim()),
        category,
        price: Number(price),
        offerPrice: Number(offerPrice),
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
        nutritionalInfo: {
          calories,
          protein,
          carbs,
          fat,
          fiber,
        }
      };

      const formData = new FormData();
      formData.append('productData', JSON.stringify(productData));
      for (let i = 0; i < files.length; i++) {
        if (files[i]) formData.append('images', files[i]);
      }

      const { data } = await axios.post('/api/product/add', formData);

      if (data.success) {
        toast.success(data.message);
        // Reset all fields
        setName(''); setDescription(''); setCategory(''); setPrice(''); setOfferPrice('');
        setWeight(''); setUnit('piece'); setBrand(''); setSku(''); setTags([]); setTagInput('');
        setOrigin(''); setShelfLife(''); setIsOrganic(false); setIsFeatured(false);
        setCountInStock('100'); setMinimumOrderQty('1'); setMaxOrderQty('50');
        setCalories(''); setProtein(''); setCarbs(''); setFat(''); setFiber('');
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full outline-none py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600";
  const selectClass = "w-full outline-none py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer";

  const sections = [
    { label: 'Basic Info', icon: '📋' },
    { label: 'Media', icon: '📸' },
    { label: 'Pricing', icon: '💰' },
    { label: 'Details', icon: '📦' },
    { label: 'Nutrition', icon: '🥗' },
  ];

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Fill in the product information below</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
              {sections.map((sec, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveSection(i)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${activeSection === i
                    ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  <span className="mr-1">{sec.icon}</span> {sec.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <SectionHeader icon="📋" title="Basic Information" subtitle="Product name, description and category" />

              <div className="space-y-5">
                <InputField label="Product Name" required hint="Use a clear, descriptive name that customers can easily search for">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fresh Organic Tomatoes" className={inputClass} required />
                </InputField>

                <InputField label="Product Description" required hint="Each line becomes a bullet point. Include key features and benefits.">
                  <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} resize-none`} placeholder="Line 1: Main product feature&#10;Line 2: Quality details&#10;Line 3: Freshness guarantee" required />
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

                  <InputField label="Brand" hint="Leave empty if no specific brand">
                    <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Farm Fresh" className={inputClass} />
                  </InputField>
                </div>

                <InputField label="SKU (Stock Keeping Unit)" hint="Unique product identifier for inventory">
                  <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. VEG-TOM-001" className={inputClass} />
                </InputField>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <SectionHeader icon="📸" title="Product Media" subtitle="Upload up to 6 high-quality product images" />

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragOver
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 scale-[1.01]'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}
              >
                {files.length === 0 ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Drag and drop images here</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">or click to browse • PNG, JPG up to 5MB each • Max 6 images</p>
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 px-5 py-2 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors">
                      Browse Files
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                      {files.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Product ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-xl border-2 border-gray-100 dark:border-gray-700 group-hover:border-primary transition-colors shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >×</button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 text-[8px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-md">Main</span>
                          )}
                        </div>
                      ))}
                      {files.length < 6 && (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-600 hover:border-primary hover:text-primary transition-colors">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{files.length}/6 images uploaded • First image will be the main thumbnail</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" hidden multiple accept="image/*" onChange={(e) => {
                  const newFiles = [...files, ...Array.from(e.target.files || [])].slice(0, 6);
                  setFiles(newFiles);
                  e.target.value = '';
                }} />
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <SectionHeader icon="💰" title="Pricing & Stock" subtitle="Set pricing, discount and inventory levels" />

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputField label="Regular Price" required hint="MRP or original price">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₹</span>
                      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className={`${inputClass} pl-8`} required min="0" step="0.01" />
                    </div>
                  </InputField>

                  <InputField label="Offer Price" required hint="Selling price after discount">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₹</span>
                      <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="0.00" className={`${inputClass} pl-8`} required min="0" step="0.01" />
                    </div>
                  </InputField>

                  <InputField label="Discount" hint="Auto-calculated">
                    <div className={`w-full py-2.5 px-4 rounded-xl border text-sm font-bold text-center ${discount > 0 ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700 text-gray-400 dark:text-gray-500'}`}>
                      {discount > 0 ? `${discount}% OFF` : 'No discount'}
                    </div>
                  </InputField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputField label="Stock Quantity" hint="Available units">
                    <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} placeholder="100" className={inputClass} min="0" />
                  </InputField>

                  <InputField label="Min Order Qty" hint="Minimum per order">
                    <input type="number" value={minimumOrderQty} onChange={(e) => setMinimumOrderQty(e.target.value)} placeholder="1" className={inputClass} min="1" />
                  </InputField>

                  <InputField label="Max Order Qty" hint="Maximum per order">
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
            {/* Product Preview Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm sticky top-24">
              <SectionHeader icon="👁" title="Live Preview" subtitle="How it appears to customers" />

              <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-slate-900 p-3">
                <div className="aspect-square rounded-lg overflow-hidden bg-white dark:bg-slate-800 mb-3 flex items-center justify-center">
                  {files[0] ? (
                    <img src={URL.createObjectURL(files[0])} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-300 dark:text-gray-600">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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

              {/* Completeness */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Completeness</span>
                  <span className="text-xs font-bold text-primary">
                    {Math.round(([name, description, category, price, offerPrice, files.length > 0].filter(Boolean).length / 6) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${([name, description, category, price, offerPrice, files.length > 0].filter(Boolean).length / 6) * 100}%` }}
                  />
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
                      {unitOptions.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </InputField>
                </div>

                <InputField label="Origin / Source" hint="Where the product comes from">
                  <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Nepal, Local Farm" className={inputClass} />
                </InputField>

                <InputField label="Shelf Life" hint="Expected freshness duration">
                  <input type="text" value={shelfLife} onChange={(e) => setShelfLife(e.target.value)} placeholder="e.g. 7 days, 6 months" className={inputClass} />
                </InputField>

                {/* Tags */}
                <InputField label="Product Tags" hint="Press Enter to add tag • Max 10 tags">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary text-xs font-semibold rounded-lg">
                          #{tag}
                          <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">×</button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                      placeholder="Type a tag..."
                      className={inputClass}
                    />
                    <div className="flex flex-wrap gap-1">
                      {tagSuggestions.filter(s => !tags.includes(s)).slice(0, 6).map((s, i) => (
                        <button key={i} type="button" onClick={() => addTag(s)} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors">
                          +{s}
                        </button>
                      ))}
                    </div>
                  </div>
                </InputField>

                {/* Toggles */}
                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <label className="flex items-center justify-between cursor-pointer group">
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

                  <label className="flex items-center justify-between cursor-pointer group">
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
          <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
            <span className="text-red-400">*</span> Required fields must be filled before publishing
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={() => {
                setName(''); setDescription(''); setCategory(''); setPrice(''); setOfferPrice('');
                setFiles([]); setWeight(''); setUnit('piece'); setBrand(''); setSku(''); setTags([]);
                setOrigin(''); setShelfLife(''); setIsOrganic(false); setIsFeatured(false);
                setCalories(''); setProtein(''); setCarbs(''); setFat(''); setFiber('');
              }}
              className="px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Clear All
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-primary to-emerald-500 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Publish Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
