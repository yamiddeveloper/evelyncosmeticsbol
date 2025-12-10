import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { allCategories } from '../data/categories.js';

const CategoryCard = ({ category }) => {
    return (
        <motion.a 
            href={`/categoria/${category.id}`}
            className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Imagen circular */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-lg">
                <img 
                    src={category.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop'} 
                    alt={category.label} 
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Nombre de categoría */}
            <span className="text-sm sm:text-base md:text-lg font-medium text-gray-800 text-center">
                {category.label}
            </span>
        </motion.a>
    );
};

const CategoryCarrousel = () => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    
    // Calcular cuántos items se ven por página (aproximado)
    const itemsPerPage = 4;
    const totalPages = Math.ceil(allCategories.length / itemsPerPage);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
            const newIndex = Math.round(scrollPercentage * (totalPages - 1));
            setActiveIndex(newIndex);
        }
    };

    const scrollToPage = (pageIndex) => {
        if (scrollRef.current) {
            const { scrollWidth, clientWidth } = scrollRef.current;
            const maxScroll = scrollWidth - clientWidth;
            const scrollPosition = (pageIndex / (totalPages - 1)) * maxScroll;
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
                className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide !py-4 !px-4 scroll-smooth justify-start"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
            >
                {allCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </motion.div>

            {/* Dots de navegación */}
            <div className="flex justify-center gap-2 !mt-4">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToPage(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            activeIndex === index 
                                ? 'bg-gray-400' 
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        aria-label={`Ir a página ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryCarrousel;
