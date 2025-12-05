import React, { useState, useRef } from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="flex-shrink-0 w-[280px] md:w-[300px] bg-white rounded-2xl overflow-hidden shadow-md">
            <div className="relative">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-[280px] object-cover"
                />
                {product.discount && (
                    <span className="absolute top-4 right-4 bg-pink-200 text-pink-800 text-sm font-semibold !px-3 !py-1 rounded">
                        {product.discount}
                    </span>
                )}
            </div>
            <div className="p-4 text-center">
                <h3 className="text-lg font-medium text-gray-800 !mb-2">{product.name}</h3>
                <p className="text-xl font-bold text-gray-900 !mb-4">${product.price}</p>
                <button className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium !py-3 !px-6 rounded-full transition-colors">
                    Agregar al carrito
                </button>
            </div>
        </div>
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
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative w-full">
            {/* Botón izquierdo */}
            {canScrollLeft && (
                <button 
                    onClick={() => scroll('left')}
                    className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 rounded-full !p-2 md:p-3 hover:bg-gray-100 transition-colors"
                    aria-label="Anterior"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Contenedor del carrusel */}
            <div 
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-2 py-4 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Botón derecho */}
            {canScrollRight && (
                <button 
                    onClick={() => scroll('right')}
                    className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 rounded-full !p-2 md:p-3 hover:bg-gray-100 transition-colors"
                    aria-label="Siguiente"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default Carrousel;