import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';


const ProductCard = ({ product, id, index }) => {
    const [productClicked, setProductClicked] = useState(false);
    return (
        <motion.div 
            className="flex-shrink-0 w-[calc(50%-12px)] lg:w-[calc(25%-18px)] bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm"
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
            <div className="!p-3 md:!p-4 text-center">
                <h3 className="text-sm md:text-base lg:text-lg font-medium text-gray-800 !mb-1 md:!mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-base md:text-lg lg:text-xl font-bold text-gray-900 !mb-2 md:!mb-3">${product.price}</p>
                <motion.button whileTap={{ scale: 0.95 }} className={`w-full text-white font-medium text-sm md:text-base !py-2 md:!py-3 !px-4 md:!px-6 rounded-full transition-colors cursor-pointer ${productClicked ? 'bg-black ' : 'bg-gray-400 hover:bg-gray-600'}`} onClick={() => setProductClicked(!productClicked)}>
                    {productClicked ? 'Ver carrito' : 'Agregar al carrito'}
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
                className="flex gap-6 overflow-x-auto overflow-y-visible scrollbar-hide !py-4 !px-4 scroll-smooth"
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