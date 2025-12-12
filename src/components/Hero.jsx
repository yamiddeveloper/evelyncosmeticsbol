import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1920&auto=format&fit=crop',
        tag: 'Nueva Colección',
        title: <>Realza tu <br /><span className="text-white font-light">Belleza Única</span></>,
        description: 'Descubre nuestra nueva línea de maquillaje diseñada para resaltar tus mejores rasgos con acabados profesionales y texturas sedosas.',
        buttonText: 'Ver Colección'
    },
    {
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=800&fit=crop&q=90',
        tag: 'Oferta Especial',
        title: <>Colores que <br /><span className="text-white font-light">Enamoran</span></>,
        description: '20% de descuento en labiales y sombras. Pigmentación intensa y larga duración para expresar tu estilo personal en cada momento.',
        buttonText: 'Comprar Ahora'
    },
    {
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1920&h=800&fit=crop&q=90',
        tag: 'Envío Gratis',
        title: <>Rostro <br /><span className="text-white font-light">Impecable</span></>,
        description: 'Envíos gratis en compras superiores a $50.000. Bases y correctores que se funden con tu piel para un acabado natural y radiante.',
        buttonText: 'Aprovechar'
    }
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 6000);

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <section className="relative w-full min-h-screen bg-gray-900 flex items-center overflow-hidden sm:!mt-22 md:!mt-11 flex flex-col justify-center items-center">
            {/* Background Carousel */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {/* Subtle gradient overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
                        <img 
                            src={slides[currentIndex].image} 
                            alt="Background" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <div className="container mx-auto !pt-5 !px-6 lg:!px-16 h-full w-full relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between h-full !gap-12 lg:!gap-0">
                    
                    {/* Text Content - Centered on mobile, left-aligned on desktop */}
                    <div className="w-full lg:w-2/3 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <AnimatePresence mode='wait'>
                            <motion.div 
                                key={currentIndex}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="flex flex-col items-center lg:items-start max-w-2xl"
                            >
                                {/* Tag */}
                                <span className="text-gray-300 uppercase tracking-[0.3em] text-xs sm:text-sm !mb-4 sm:!mb-6 font-medium">
                                    {slides[currentIndex].tag}
                                </span>
                                
                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] !mb-6 sm:!mb-8">
                                    {slides[currentIndex].title}
                                </h1>
                                
                                {/* Description */}
                                <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-lg !mb-8 sm:!mb-12 font-light leading-relaxed">
                                    {slides[currentIndex].description}
                                </p>
                                
                                {/* CTA Button */}
                                <motion.button 
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white text-gray-900 !px-8 !py-4 sm:!px-12 sm:!py-4 rounded-full font-medium text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg cursor-pointer"
                                >
                                    {slides[currentIndex].buttonText}
                                </motion.button>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>

            {/* Minimalist Dots Navigation */}
            <div className="absolute !bottom-8 !left-1/2 -translate-x-1/2 lg:translate-x-0 lg:!left-auto lg:!bottom-auto lg:!top-1/2 lg:-translate-y-1/2 lg:!right-8 flex flex-row lg:flex-col !gap-3 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 cursor-pointer rounded-full ${
                            currentIndex === index 
                                ? 'bg-white w-3 h-3 scale-110' 
                                : 'bg-white/40 hover:bg-white/60 w-3 h-3'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;