import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, id, index }) => {
    const [productClicked, setProductClicked] = useState(false);
    
    const handleCardClick = () => {
        const slug = product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        window.location.href = `/producto/${slug}`;
    };

    const handleButtonClick = (e) => {
        e.stopPropagation();
        setProductClicked(!productClicked);
    };

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
            onClick={handleCardClick}
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
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }} 
                    className={`w-full text-white font-medium text-xs md:text-sm !py-2 md:!py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${productClicked ? 'bg-gray-900 shadow-md' : 'bg-gray-500 shadow-sm hover:shadow-md hover:bg-gray-600'}`} 
                    onClick={handleButtonClick}
                >
                    {productClicked ? (
                        <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Ver carrito
                        </>
                    ) : (
                        <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Agregar
                        </>
                    )}
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
