import React, { useRef, useEffect, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { cartItems, addToCart, removeFromCart } from '../stores/cartStore';

const ProductCard = ({ product, id, index, isInCart, onAddToCart }) => {
    const handleCardClick = () => {
        const slug = product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        window.location.href = `/producto/${slug}`;
    };

    const handleButtonClick = (e) => {
        e.stopPropagation();
        onAddToCart(product);
    };

    return (
        <div
            className="group flex-shrink-0 w-[calc(50%-4px)] md:w-[calc(33.333%-10px)] lg:w-[calc(25%-12px)] overflow-hidden cursor-pointer snap-start rounded-lg transition-shadow duration-300 hover:shadow-lg"
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
                    <span className="absolute top-2 right-2 md:top-4 md:right-4 bg-pink-200 text-pink-800 text-[10px] md:text-sm font-semibold !px-1.5 md:!px-3 !py-0.5 md:!py-1 rounded">
                        {product.discount}
                    </span>
                )}
            </div>
            <div className="!p-1 md:!p-3 text-center">
                <h3 className="text-[9px] sm:text-[10px] md:text-sm lg:text-base font-medium text-gray-800 !mb-0.5 line-clamp-2 leading-tight">{product.name}</h3>
                <p className="text-[10px] sm:text-xs md:text-base lg:text-lg font-bold text-gray-900 !mb-0.5 md:!mb-2">Bs {product.price}</p>
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }} 
                    className={`w-full h-[28px] sm:h-[32px] md:h-[45px] text-white font-medium text-[9px] sm:text-[10px] md:text-sm !py-1 md:!py-2.5 rounded-[16px] md:rounded-[20px] transition-all cursor-pointer flex items-center justify-center gap-0.5 md:gap-1.5 ${isInCart ? 'bg-gray-900 shadow-md hover:bg-gray-800' : 'bg-gray-600/45 shadow-sm hover:shadow-md hover:bg-gray-600'}`} 
                    onClick={handleButtonClick}
                >
                    {isInCart ? (
                        <>
                            <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="hidden sm:inline">Ver</span> carrito
                        </>
                    ) : (
                        <>
                            <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Agregar
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

const Carrousel = ({ products = [] }) => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);
    
    // Estado del carrito
    const $cartItems = useStore(cartItems);
    const cartProductIds = useMemo(() => new Set($cartItems.map(item => item.id)), [$cartItems]);
    
    const handleToggleCart = (product) => {
        if (cartProductIds.has(product.id)) {
            removeFromCart(product.id);
        } else {
            addToCart(product);
        }
    };

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
        <div
            className="relative w-full overflow-hidden bg-white"
        >
            <div
                ref={scrollRef}
                className="flex gap-2 md:gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}
            >
                {products.map((product, index) => (
                    <ProductCard 
                        key={`${product.id}-${index}`} 
                        product={product} 
                        id={product.id} 
                        index={index}
                        isInCart={cartProductIds.has(product.id)}
                        onAddToCart={handleToggleCart}
                    />
                ))}
            </div>

            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-lg rounded-full !p-1 md:!p-2 hover:bg-white hover:scale-110 active:scale-90 transition-all cursor-pointer"
                    aria-label="Anterior"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-lg rounded-full cursor-pointer !p-1 md:!p-2 hover:bg-white hover:scale-110 active:scale-90 transition-all"
                    aria-label="Siguiente"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default Carrousel;
