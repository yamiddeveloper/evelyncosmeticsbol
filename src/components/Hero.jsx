import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1920&auto=format&fit=crop', // The one from the new design
        tag: 'Nueva Colección',
        title: <>Realza tu <br /><span className="text-white/90 italic">Belleza Única</span></>,
        description: 'Descubre nuestra nueva línea de maquillaje diseñada para resaltar tus mejores rasgos con acabados profesionales y texturas sedosas.',
        buttonText: 'Ver Colección'
    },
    {
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=800&fit=crop&q=90',
        tag: 'Oferta Especial',
        title: <>Colores que <br /><span className="text-white/90 italic">Enamoran</span></>,
        description: '20% de descuento en labiales y sombras. Pigmentación intensa y larga duración para expresar tu estilo personal en cada momento.',
        buttonText: 'Comprar Ahora'
    },
    {
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1920&h=800&fit=crop&q=90',
        tag: 'Envío Gratis',
        title: <>Rostro <br /><span className="text-white/90 italic">Impecable</span></>,
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
        <section className="relative w-full min-h-[100vh] lg:min-h-screen bg-[#F2B6B6] flex items-center !pt-28 !pb-16 lg:!pt-0 lg:!pb-0 !mt-[6%] !mb-[2%] overflow-hidden">
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
                        {/* Gradient Overlay for better text readability without hiding the image */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#545045]/80 via-[#545045]/40 to-transparent z-10" />
                        <img 
                            src={slides[currentIndex].image} 
                            alt="Background" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <div className="container !mx-auto !px-6 lg:!px-16 h-full w-full relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-12 lg:gap-0">
                    
                    {/* Text Content - Left Side */}
                    <div className="w-full lg:w-2/3 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <AnimatePresence mode='wait'>
                            <motion.div 
                                key={currentIndex}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="flex flex-col items-center lg:items-start"
                            >
                                <span className="text-[#E8DCC4] uppercase tracking-[0.2em] text-xs sm:text-sm !mb-4 sm:!mb-6 font-medium">
                                    {slides[currentIndex].tag}
                                </span>
                                
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#F3E5AB] leading-[1.1] !mb-6 sm:!mb-8">
                                    {slides[currentIndex].title}
                                </h1>
                                
                                <p className="text-[#E8DCC4]/90 text-base sm:text-lg lg:text-xl max-w-lg !mb-8 sm:!mb-12 font-light leading-relaxed">
                                    {slides[currentIndex].description}
                                </p>
                                
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-[#E8DCC4] text-[#545045] !px-8 !py-3 sm:!px-12 sm:!py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] cursor-pointer"
                                >
                                    {slides[currentIndex].buttonText}
                                </motion.button>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>

            {/* Dots Navigation (Right side on desktop, Bottom center on mobile) */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:right-16 flex flex-row lg:flex-col gap-4 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 cursor-pointer rounded-full border-2 border-[#E8DCC4] ${
                            currentIndex === index 
                                ? 'bg-[#E8DCC4] w-4 h-4 scale-110' 
                                : 'bg-transparent hover:bg-[#E8DCC4]/50 w-4 h-4'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;