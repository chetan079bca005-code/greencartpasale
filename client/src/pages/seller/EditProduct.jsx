import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

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

    useEffect(() => {
        if (!product) {
            navigate('/seller/product-list');
            return;
        }

        setName(product.name);
        setDescription(product.description.join('\n'));
        setCategory(product.category);
        setPrice(product.price);
        setOfferPrice(product.offerPrice);
        setExistingImages(product.image);
    }, [product, navigate]);

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            setIsSubmitting(true);

            const productData = {
                name,
                description: description.split('\n'),
                category,
                price,
                offerPrice,
                image: existingImages
            };

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            
            // Only append new images if they exist
            for (let i = 0; i < files.length; i++) {
                if (files[i]) {
                    formData.append('images', files[i]);
                }
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

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Images</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {existingImages.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                    className="max-w-24 border border-gray-300 rounded p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleImageRemove(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {Array(4 - existingImages.length).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input
                                    type="file"
                                    id={`image${index}`}
                                    hidden
                                    onChange={(e) => {
                                        const updatedFiles = [...files];
                                        updatedFiles[index] = e.target.files[0];
                                        setFiles(updatedFiles);
                                    }}
                                />
                                <img
                                    className="max-w-24 cursor-pointer"
                                    src={assets.upload_area}
                                    alt="uploadArea"
                                    width={100}
                                    height={100}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input
                        id="product-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Type here"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea
                        id="product-description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                        placeholder="Type here"
                    />
                </div>

                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    >
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>{item.path}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input
                            id="product-price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input
                            id="offer-price"
                            type="number"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Product'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/seller/product-list')}
                        className="px-8 py-2.5 bg-gray-500 text-white font-medium rounded cursor-pointer hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct; 