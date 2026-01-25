import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const {
        currency,
        addToCart,
        removeFromCart,
        cartItems,
    } = useAppContext();

    const getUnitDisplay = (product) => {
        switch (product.category.toLowerCase()) {
            case 'vegetables':
            case 'fruits':
                return product.weight ? `${product.weight} kg` : 'per kg';
            case 'grain':
                return product.weight ? `${product.weight} kg` : 'per kg';
            case 'dairy products':
                return product.volume ? `${product.volume} L` : 'per liter';
            case 'cold drinks':
                return product.volume ? `${product.volume} L` : 'per bottle';
            case 'instant food':
                return 'per packet';
            default:
                return 'per piece';
        }
    };

    if (!product) return null;

    const categoryPath = (product.category || '').toLowerCase().replace(/\s+/g, '');

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 group flex flex-col h-full hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
            <div
                onClick={() => {
                    navigate(`/products/${categoryPath}/${product._id}`);
                    window.scrollTo(0, 0);
                }}
                className="relative overflow-hidden rounded-xl mb-2 bg-slate-100 dark:bg-slate-900 aspect-square cursor-pointer"
            >
                <img
                    src={product.image[0]}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {product.price > product.offerPrice && (
                    <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded tracking-tighter">
                        -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-grow px-1">
                <h3
                    onClick={() => {
                        navigate(`/products/${categoryPath}/${product._id}`);
                        window.scrollTo(0, 0);
                    }}
                    className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors text-xs line-clamp-1 cursor-pointer leading-tight mb-1"
                >
                    {product.name}
                </h3>

                <p className="text-[10px] font-medium text-slate-400 mb-2">{getUnitDisplay(product)}</p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-primary font-black text-sm">
                            {currency}{product.offerPrice}
                        </span>
                        {product.price > product.offerPrice && (
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 line-through">
                                {currency}{product.price}
                            </span>
                        )}
                    </div>

                    <div onClick={(e) => e.stopPropagation()} className="relative z-10">
                        {!cartItems[product._id] ? (
                            <button
                                onClick={() => addToCart(product._id)}
                                className="bg-primary hover:bg-primary-dark text-white p-1.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        ) : (
                            <div className="bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg flex items-center gap-1.5 font-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                <button onClick={() => removeFromCart(product._id)} className="w-4 h-4 flex items-center justify-center hover:text-primary transition-colors text-xs">−</button>
                                <span className="text-[10px] min-w-[10px] text-center">{cartItems[product._id]}</span>
                                <button onClick={() => addToCart(product._id)} className="w-4 h-4 flex items-center justify-center hover:text-primary transition-colors text-xs">+</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
                    
                
            
        

    );
};


export default ProductCard;
