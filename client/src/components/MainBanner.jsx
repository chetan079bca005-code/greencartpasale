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
      className="relative h-[450px] md:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="relative h-full group">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-10000 linear"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-10 md:px-20">
                <div className="max-w-2xl">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold tracking-widest uppercase mb-6 animate-fadeIn">
                    Premium Quality
                  </div>
                  <h2 className="text-4xl md:text-6xl font-extrabold mb-3 text-white leading-tight animate-fadeIn">
                    {slide.title} <span className="text-primary italic font-light">{slide.subtitle}</span>
                  </h2>
                  <p className="text-sm md:text-lg mb-6 text-slate-300 leading-relaxed max-w-md animate-fadeIn animation-delay-400">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap gap-4 animate-fadeIn animation-delay-600">
                    <button
                      onClick={() => navigate(slide.buttonLink)}
                      className="btn-primary-premium flex items-center gap-2"
                    >
                      {slide.buttonText}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigate('/about')}
                      className="px-8 py-3 rounded-xl font-semibold border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 backdrop-blur-sm"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Glass Style */}
      <div className="absolute bottom-10 right-10 flex gap-4 z-20">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Aesthetic Bottom Edge */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
    </div>

  );
};

export default MainBanner;
