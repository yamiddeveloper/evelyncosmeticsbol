import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';


const ProductCard = ({ product, id, index }) => {
    const [productClicked, setProductClicked] = useState(false);
    return (
        <motion.div 
            className="flex-shrink-0 w-[calc(50%-4px)] md:w-[calc(33.333%-10px)] lg:w-[calc(25%-12px)] overflow-hidden cursor-pointer snap-start"
            initial={{ opacity: 0.4, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ 
                duration: 0.3, 
                ease: "easeOut" 
            }}
            viewport={{ once: false, amount: 0.5, root: undefined }}
            whileHover={{ 
                scale: 1.03, 
            }}
            id={`product-${id}-${index}`}
            key={`${product.id}-${id}-${index}`}
        >
            <div className="relative">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full aspect-square object-cover"
                />
                {product.discount && (
                    <span className="absolute top-4 right-4 bg-pink-200 text-pink-800 text-sm font-semibold !px-3 !py-1 rounded">
                        {product.discount}
                    </span>
                )}
            </div>
            <div className="!p-2 md:!p-3 text-center">
                <h3 className="text-xs md:text-sm lg:text-base font-medium text-gray-800 !mb-0.5 md:!mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                <p className="text-sm md:text-base lg:text-lg font-bold text-gray-900 !mb-1.5 md:!mb-2">${product.price}</p>
                <motion.button whileTap={{ scale: 0.95 }} className={`w-full text-white font-medium text-xs md:text-sm !py-1.5 md:!py-2 !px-2 md:!px-4 rounded-lg transition-colors cursor-pointer ${productClicked ? 'bg-black ' : 'bg-gray-400 hover:bg-gray-600'}`} onClick={() => setProductClicked(!productClicked)}>
                    {productClicked ? 'Ver carrito' : 'Agregar'}
                </motion.button>
            </div>
        </motion.div>
    );
};

const Carrousel = ({ products = [] }) => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const clientWidth = scrollRef.current.clientWidth;
            const gap = 24; // gap-6 is 24px
            // Calculate item width based on viewport width (approximation for scrolling)
            // Or simpler: scroll by clientWidth (one page)
            const scrollAmount = clientWidth; 
            
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <motion.div 
            className=" relative w-full !px-0 md:!px-10 overflow-visible"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
        >
            {/* Botón izquierdo */}
            <motion.button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-200 rounded-full !p-2 md:!p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Anterior"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: canScrollLeft ? 1 : 0, x: canScrollLeft ? 0 : -20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ pointerEvents: canScrollLeft ? 'auto' : 'none' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </motion.button>

            {/* Contenedor del carrusel */}
            <motion.div 
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-2 md:gap-4 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                ))}
            </motion.div>

            {/* Botón derecho */}
            <motion.button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-200 rounded-full !p-2 md:!p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Siguiente"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: canScrollRight ? 1 : 0, x: canScrollRight ? 0 : 20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ pointerEvents: canScrollRight ? 'auto' : 'none' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </motion.button>
        </motion.div>
    );
};

export default Carrousel;