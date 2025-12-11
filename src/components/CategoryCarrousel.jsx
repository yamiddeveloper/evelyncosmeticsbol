import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { allCategories } from '../data/categories.js';

const CategoryCard = ({ category, index }) => {
    return (
        <motion.a 
            href={`/categoria/${category.id}`}
            className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Imagen circular */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg border-4 border-white">
                <img 
                    src={category.image} 
                    alt={category.label} 
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Nombre de categoría */}
            <span className="text-xs sm:text-sm md:text-base font-medium text-gray-800 text-center max-w-[120px]">
                {category.label}
            </span>
        </motion.a>
    );
};

const CategoryCarrousel = () => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalDots, setTotalDots] = useState(1);
    
    // Calcular número de dots basado en el scroll real
    useEffect(() => {
        const calculateDots = () => {
            if (scrollRef.current) {
                const { scrollWidth, clientWidth } = scrollRef.current;
                // Si todo el contenido cabe, solo 1 dot
                if (scrollWidth <= clientWidth) {
                    setTotalDots(1);
                } else {
                    // Calcular cuántos "pasos" de scroll hay
                    const itemWidth = 160; // Ancho aproximado de cada item + gap
                    const visibleItems = Math.floor(clientWidth / itemWidth);
                    const dots = Math.ceil(allCategories.length / Math.max(visibleItems, 1));
                    setTotalDots(Math.max(dots, 1));
                }
            }
        };
        
        calculateDots();
        window.addEventListener('resize', calculateDots);
        return () => window.removeEventListener('resize', calculateDots);
    }, []);

    const handleScroll = () => {
        if (scrollRef.current && totalDots > 1) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const maxScroll = scrollWidth - clientWidth;
            if (maxScroll > 0) {
                const scrollPercentage = scrollLeft / maxScroll;
                const newIndex = Math.round(scrollPercentage * (totalDots - 1));
                setActiveIndex(Math.min(newIndex, totalDots - 1));
            }
        }
    };

    const scrollToPage = (pageIndex) => {
        if (scrollRef.current) {
            const { scrollWidth, clientWidth } = scrollRef.current;
            const maxScroll = scrollWidth - clientWidth;
            const scrollPosition = totalDots > 1 
                ? (pageIndex / (totalDots - 1)) * maxScroll 
                : 0;
            scrollRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full">
            {/* Carrusel */}
            <motion.div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide !py-4 !px-2 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
            >
                {allCategories.map((category, index) => (
                    <CategoryCard key={category.id} category={category} index={index} />
                ))}
            </motion.div>

            {/* Dots de navegación - solo mostrar si hay más de 1 */}
            {totalDots > 1 && (
                <div className="flex justify-center gap-2 !mt-4">
                    {Array.from({ length: totalDots }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToPage(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                activeIndex === index 
                                    ? 'bg-gray-800 scale-110' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Ir a página ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryCarrousel;
