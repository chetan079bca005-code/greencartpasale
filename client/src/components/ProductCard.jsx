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
        <div className="group border p-4 rounded-lg hover:shadow-xl cursor-pointer transition-all duration-300">
            <div 
                onClick={() => {
                    navigate(`/products/${categoryPath}/${product._id}`);
                    window.scrollTo(0, 0);
                }}
                className="relative overflow-hidden rounded-lg mb-3"
            >
                <img
                    src={product.image[0]}
                    alt={product.name}
                    className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
            </div>
            <h3 
                onClick={() => {
                    navigate(`/products/${categoryPath}/${product._id}`);
                    window.scrollTo(0, 0);
                }}
                className="font-medium text-gray-800 group-hover:text-primary transition-colors"
            >
                {product.name}
            </h3>
            <div className="flex items-center justify-between mt-2">
                <div>
                    <p className="text-primary font-semibold">
                        {currency}{product.offerPrice}
                    </p>
                    <p className="text-xs text-gray-500">{getUnitDisplay(product)}</p>
                </div>
                <div className="flex items-center">
                    {Array(5).fill('').map((_, i) => (
                        <img
                            key={i}
                            src={i < (product.rating || 0) ? assets.star_icon : assets.star_dull_icon}
                            className="w-4 h-4"
                            alt="star"
                        />
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-end mt-3">
                <div onClick={(e) => e.stopPropagation()}>
                    {!cartItems[product._id] ? (
                        <button
                            onClick={() => addToCart(product._id)}
                            className="bg-primary/10 border border-primary/40 px-3 py-1 text-sm rounded-md flex items-center gap-1"
                        >
                            <img src={assets.cart_icon} alt="cart" className="w-4" />
                            Add
                        </button>
                    ) : (
                        <div className="bg-primary/20 px-2 py-1 rounded-md flex items-center gap-2">
                            <button onClick={() => removeFromCart(product._id)}>-</button>
                            <span>{cartItems[product._id]}</span>
                            <button onClick={() => addToCart(product._id)}>+</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
