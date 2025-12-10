import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const slides = [
    {
        mobile: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop&q=90',
        desktop: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=800&fit=crop&q=90',
        title: 'EVELYN',
        subtitle: 'Unlock Your True Radiance'
    },
    {
        mobile: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop&q=90',
        desktop: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&h=800&fit=crop&q=90',
        title: 'NATURAL',
        subtitle: 'Beauty inspired by nature'
    },
    {
        mobile: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop&q=90',
        desktop: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1920&h=800&fit=crop&q=90',
        title: 'ELEGANCE',
        subtitle: 'Sophistication in every drop'
    }
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <motion.div 
        className="relative watch:aspect-[4/6] 4xs:aspect-[4/6] 3xs:aspect-[4/6] 2xs:aspect-[4/5] xs:aspect-[4/5] sm:aspect-[4/4] md:aspect-[4/3] lg:aspect-[4/2] xl:aspect-[5/2] w-full overflow-hidden group mt-[130px] lg:mt-[80px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        >
            {/* Slides Container */}
            <div 
                className="w-full h-full flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div 
                        key={index} 
                        className="min-w-full h-full relative"
                    >
                        <picture>
                            <source media="(min-width: 768px)" srcSet={slide.desktop} />
                            <img 
                                src={slide.mobile} 
                                alt={slide.title} 
                                className="w-full h-full object-cover"
                            />
                        </picture>
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 h-full bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 !mt-20">
                            <h1 className="watch:text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif tracking-widest text-[#F3E5AB] drop-shadow-lg !mb-2 opacity-90">
                                {slide.title}
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wider text-white/90 drop-shadow-md font-sans">
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots Navigation */}
            <div className="absolute !bottom-10 !left-1/2 !transform !-translate-x-1/2 !flex !space-x-4 !z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 cursor-pointer rounded-full shadow-lg border border-white/60 ${
                            currentIndex === index 
                                ? 'bg-white w-5 h-5 scale-110' 
                                : 'bg-white/20 hover:bg-white/50 w-4 h-4 backdrop-blur-sm'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default Hero;