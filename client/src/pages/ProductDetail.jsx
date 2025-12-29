import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart, currency } = useAppContext();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const foundProduct = products.find((p) => p._id === id);
    setProduct(foundProduct);
    setThumbnail(foundProduct?.image?.[0] || null);
    window.scrollTo(0, 0);
  }, [id, products]);

  if (!product) return <div className="p-6">Product not found.</div>;

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p._id !== product._id
  );

  const getUnitDisplay = (product) => {
    switch (product.category.toLowerCase()) {
      case 'vegetables':
      case 'fruits':
        return 'kg';
      case 'grain':
        return 'kg';
      case 'dairy products':
        return 'L';
      case 'cold drinks':
        return 'bottle';
      case 'instant food':
        return 'packet';
      default:
        return 'piece';
    }
  };

  const getQuantityStep = (product) => {
    switch (product.category.toLowerCase()) {
      case 'vegetables':
      case 'fruits':
      case 'grain':
        return 0.5;
      case 'dairy products':
        return 0.5;
      case 'cold drinks':
      case 'instant food':
        return 1;
      default:
        return 1;
    }
  };

  const formatQuantity = (value) => {
    if (value % 1 === 0) {
      return value;
    }
    return value.toFixed(1);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await addToCart(product._id, quantity);
    setIsAddingToCart(false);
  };

  const handleBuyNow = async () => {
    setIsAddingToCart(true);
    await addToCart(product._id, quantity);
    setIsAddingToCart(false);
    navigate("/cart");
  };

  return (
    <div className="max-w-6xl w-full px-6 py-10 mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Home</span>
        <span>/</span>
        <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/products')}>Products</span>
        <span>/</span>
        <span className="hover:text-primary cursor-pointer" onClick={() => navigate(`/products/${product.category.toLowerCase()}`)}>{product.category}</span>
        <span>/</span>
        <span className="text-primary">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-16 mt-6">
        {/* Images */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product.image.map((img, i) => (
              <div
                key={i}
                onClick={() => setThumbnail(img)}
                className={`border max-w-24 border-gray-300 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-md ${
                  thumbnail === img ? 'border-primary shadow-md' : ''
                }`}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-24 object-cover" />
              </div>
            ))}
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <img src={thumbnail} alt="Selected" className="w-full h-[400px] object-contain" />
          </div>
        </div>

        {/* Product Info */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center">
              {Array(5).fill('').map((_, i) => (
                <img
                  key={i}
                  src={i < (product.rating || 0) ? assets.star_icon : assets.star_dull_icon}
                  className="w-5 h-5"
                  alt="star"
                />
              ))}
            </div>
            <span className="text-primary font-semibold">({product.rating || 0} / 5)</span>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex items-baseline gap-3">
              <p className="text-gray-400 line-through text-lg">{currency}{product.price}</p>
              <p className="text-3xl font-bold text-primary">{currency}{product.offerPrice}</p>
            </div>
            <span className="text-sm text-gray-500">(inclusive of all taxes)</span>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getUnitDisplay(product).charAt(0).toUpperCase() + getUnitDisplay(product).slice(1)}
            </label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setQuantity(prev => Math.max(getQuantityStep(product), prev - getQuantityStep(product)))}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{formatQuantity(quantity)} {getUnitDisplay(product)}</span>
              <button 
                onClick={() => setQuantity(prev => prev + getQuantityStep(product))}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">About Product</h2>
            <ul className="space-y-2 text-gray-600">
              {product.description.map((desc, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 text-base">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={isAddingToCart}
              className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
            <div className="w-20 h-1 bg-primary rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                onClick={() =>
                  navigate(
                    `/products/${item.category
                      .toLowerCase()
                      .replace(/\s/g, '')}/${item._id}`
                  )
                }
                className="group border p-4 rounded-lg hover:shadow-xl cursor-pointer transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-primary transition-colors">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-primary font-semibold">
                    {currency}{item.offerPrice}
                  </p>
                  <div className="flex items-center">
                    {Array(5).fill('').map((_, i) => (
                      <img
                        key={i}
                        src={i < (item.rating || 0) ? assets.star_icon : assets.star_dull_icon}
                        className="w-4 h-4"
                        alt="star"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
