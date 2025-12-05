import React, { useState, useEffect } from 'react';

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
        <div className="relative w-full aspect-[4/3] md:aspect-[3/1] overflow-hidden group">
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
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/30"></div>
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white !px-4 ">
                            <h1 className="text-5xl md:text-8xl font-serif tracking-widest text-[#F3E5AB] drop-shadow-lg !mb-4 opacity-90">
                                {slide.title}
                            </h1>
                            <p className="text-xl md:text-2xl font-light tracking-wider text-white/90 drop-shadow-md font-sans">
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
        </div>
    );
};

export default Hero;