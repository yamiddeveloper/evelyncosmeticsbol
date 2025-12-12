import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, id, index }) => {
    const [productClicked, setProductClicked] = useState(false);
    return (
        <motion.div
            className="group flex-shrink-0 w-[calc(50%-4px)] md:w-[calc(33.333%-10px)] lg:w-[calc(25%-12px)] overflow-hidden cursor-pointer snap-start rounded-lg transition-shadow duration-300 hover:shadow-lg"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: "easeOut"
            }}
            viewport={{ once: true, amount: 0.2 }}
            id={`product-${id}-${index}`}
            key={`${product.id}-${id}-${index}`}
        >
            <div className="relative overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
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
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // Use a small tolerance
        }
    };
    
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            checkScroll(); // Check initially
            scrollContainer.addEventListener('scroll', checkScroll);

            // Check on resize
            const resizeObserver = new ResizeObserver(() => checkScroll());
            resizeObserver.observe(scrollContainer);

            return () => {
                scrollContainer.removeEventListener('scroll', checkScroll);
                resizeObserver.unobserve(scrollContainer);
            };
        }
    }, [products]); // Re-run if products change

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8; // Scroll by 80% of the visible width for a smoother experience

            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <motion.div
            className="relative w-full overflow-hidden bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                ref={scrollRef}
                className="flex gap-2 md:gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}
            >
                {products.map((product, index) => (
                    <ProductCard key={`${product.id}-${index}`} product={product} id={product.id} index={index} />
                ))}
            </motion.div>

            {canScrollLeft && (
                <motion.button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-lg rounded-full !p-2 hover:bg-white transition-colors cursor-pointer"
                    aria-label="Anterior"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.button>
            )}

            {canScrollRight && (
                <motion.button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-lg rounded-full cursor-pointer !p-2 hover:bg-white transition-colors"
                    aria-label="Siguiente"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.button>
            )}
        </motion.div>
    );
};

export default Carrousel;
