import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const MainBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      image: assets.banner1,
      title: "Fresh & Organic",
      subtitle: "Discover Nature's Best",
      description: "Shop our wide selection of fresh, organic products delivered to your doorstep.",
      buttonText: "Shop Now",
      buttonLink: "/products"
    },
    {
      image: assets.banner2,
      title: "Special Offers",
      subtitle: "Up to 50% Off",
      description: "Take advantage of our limited-time offers on selected items.",
      buttonText: "View Deals",
      buttonLink: "/products"
    },
    {
      image: assets.banner3,
      title: "New Arrivals",
      subtitle: "Latest Products",
      description: "Check out our newest additions to the store.",
      buttonText: "Explore",
      buttonLink: "/products"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div 
      className="relative h-[600px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-16 lg:px-24 xl:px-32">
                <div className="max-w-2xl text-white">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
                    {slide.title}
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-medium mb-6 text-primary animate-fadeIn animation-delay-200">
                    {slide.subtitle}
                  </h3>
                  <p className="text-lg mb-8 animate-fadeIn animation-delay-400">
                    {slide.description}
                  </p>
                  <button
                    onClick={() => navigate(slide.buttonLink)}
                    className="bg-primary hover:bg-primary-dull text-white px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-300 animate-fadeIn animation-delay-600"
                  >
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transform hover:scale-110 transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transform hover:scale-110 transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MainBanner;
