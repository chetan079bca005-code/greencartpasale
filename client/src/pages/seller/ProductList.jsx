import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const { products, currency, axios, fetchProducts } = useAppContext();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null);

    const toggleStock = async (id, inStock) => {
        try {
            const { data } = await axios.post('/api/product/stock', { id, inStock });
            if (data.success) {
                await fetchProducts();
                toast.success(data.message || 'Stock status updated successfully');
            } else {
                toast.error(data.message || 'Failed to update stock status');
            }
        } catch (error) {
            console.error('Error updating stock:', error);
            toast.error(error.response?.data?.message || 'Failed to update stock status');
        }
    };

    const handleEdit = (product) => {
        navigate('/seller/edit-product', { state: { product } });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            setDeletingId(id);
            const { data } = await axios.delete(`/api/product/delete/${id}`);
            if (data.success) {
                await fetchProducts();
                toast.success(data.message || 'Product deleted successfully');
            } else {
                toast.error(data.message || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error(error.response?.data?.message || 'Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium text-gray-900 dark:text-white">All Products</h2>
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white dark:bg-slate-800 border border-gray-500/20 dark:border-gray-700 shadow-lg">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 dark:text-gray-200 text-sm text-left bg-gray-100 dark:bg-slate-700">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Product</th>
                                <th className="px-4 py-3 font-semibold truncate">Category</th>
                                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                                <th className="px-4 py-3 font-semibold truncate">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500 dark:text-gray-400">
                            {products.map((product) => (
                                <tr key={product._id} className="border-t border-gray-500/20 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                        <div className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-slate-700">
                                            <img src={product.image[0]} alt="Product" className="w-16 h-16 object-contain" />
                                        </div>
                                        <span className="truncate max-sm:hidden w-full font-medium text-gray-900 dark:text-white">{product.name}</span>
                                    </td>
                                    <td className="px-4 py-3">{product.category}</td>
                                    <td className="px-4 py-3 max-sm:hidden">{currency}{product.offerPrice}</td>
                                    <td className="px-4 py-3">
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            <input onClick={() => toggleStock(product._id, !product.inStock)} checked={product.inStock} type="checkbox" className="sr-only peer" />
                                            <div className="w-12 h-7 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:bg-primary transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
                                        </label>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                disabled={deletingId === product._id}
                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === product._id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
