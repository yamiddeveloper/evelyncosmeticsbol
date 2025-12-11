import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { allCategories } from '../data/categories.js';

const CategoryCard = ({ category, index }) => {
    // Delay basado en posición visible (0-3 para 4 elementos visibles)
    const visibleIndex = index % 4;
    return (
        <motion.a 
            href={`/categoria/${category.id}`}
            className="flex-shrink-0 w-[calc(50%-6px)] md:w-[calc(33.333%-12px)] lg:w-[calc(25%-18px)] flex flex-col items-center gap-3 cursor-pointer snap-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: visibleIndex * 0.08 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Imagen circular */}
            <div className="w-full aspect-square max-w-[280px] rounded-full overflow-hidden">
                <img 
                    src={category.image} 
                    alt={category.label} 
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Nombre de categoría */}
            <span className="text-xs sm:text-sm md:text-base font-medium text-gray-800 text-center">
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
                // Determinar cuántos items son visibles según el ancho de la ventana
                // lg breakpoint es 1024px
                const isLarge = window.innerWidth >= 1024;
                const visibleItems = isLarge ? 4 : 2;
                
                const dots = Math.ceil(allCategories.length / visibleItems);
                setTotalDots(Math.max(dots, 1));
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
                className="flex gap-3 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
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
