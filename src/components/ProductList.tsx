import { useState, useMemo, useCallback, useEffect, useRef, memo, startTransition } from 'react';
import { useStore } from '@nanostores/react';
import CategoryDropdown from './CategoryDropdown';
import { cartItems, addToCart, removeFromCart } from '../stores/cartStore';

interface Product {
    id: number;
    name: string;
    brand?: string;
    description?: string;
    price: string;
    priceFormatted?: string;
    image: string;
    featured?: boolean;
    bestSeller?: boolean;
    onSale?: boolean;
    backInStock?: boolean;
}

interface ProductListProps {
    products: Product[];
    title: string;
    showFilters?: boolean;
    categories?: { id: string; label: string }[];
}

type FilterType = 'none' | 'price' | 'brand';

const ITEMS_PER_PAGE = 12;
const LOAD_MORE_COUNT = 12;

// Componente de producto memoizado
const ProductCard = memo(({ 
    product, 
    isInCart, 
    onAddToCart 
}: { 
    product: Product; 
    isInCart: boolean; 
    onAddToCart: (product: Product) => void;
}) => (
    <div className="flex gap-2 sm:gap-4 !px-2 sm:!px-4 !py-2 sm:!py-4 border-b border-gray-100 bg-white lg:hover:bg-gray-50 cursor-pointer rounded-lg transition-colors">
        <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 relative">
            <img 
                src={product.image} 
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-lg"
            />
            {product.featured && (
                <span className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 bg-gray-900 text-white w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </span>
            )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <span className="text-[10px] sm:text-[.9rem] text-gray-500 block">{product.brand || product.description || 'Marca del producto'}</span>
                <h3 className="text-[11px] sm:text-[.85rem] font-medium text-gray-900 !mt-0.5 line-clamp-2 leading-tight">{product.name}</h3>
                <p className="text-sm sm:text-xl font-medium text-gray-900 !mt-1 sm:!mt-3">{product.priceFormatted || `BOB ${product.price}`}</p>
            </div>
            
            <button 
                onClick={() => onAddToCart(product)}
                className={`w-full h-[30px] sm:h-[40px] text-[10px] sm:text-sm font-medium !py-1.5 sm:!py-3 rounded-[10px] !mt-1.5 sm:!mt-3 cursor-pointer flex items-center justify-center gap-1 sm:gap-2 transition-colors ${
                    isInCart
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-600/45 text-white hover:bg-gray-600'
                }`}
            >
                {isInCart ? (
                    <>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="hidden xs:inline">Ver</span> carrito
                    </>
                ) : (
                    <>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Agregar
                    </>
                )}
            </button>
        </div>
    </div>
));

ProductCard.displayName = 'ProductCard';

export default function ProductList({ 
    products, 
    title, 
    showFilters = true, 
    categories = [] 
}: ProductListProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>('none');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const loaderRef = useRef<HTMLDivElement>(null);
    
    // Usar el store del carrito
    const $cartItems = useStore(cartItems) as Array<{id: number; quantity: number; price: number}>;
    const cartProductIds = useMemo(() => new Set($cartItems.map(item => item.id)), [$cartItems]);

    // Toggle producto en carrito (agregar o quitar)
    const handleToggleCart = useCallback((product: Product) => {
        if (cartProductIds.has(product.id)) {
            removeFromCart(product.id);
        } else {
            addToCart(product);
        }
    }, [cartProductIds]);

    // Manejar cambio de precio - desactiva otros filtros
    const handlePriceChange = (value: string) => {
        setMaxPrice(value);
        if (value) {
            setActiveFilter('price');
            setSelectedBrand('');
        } else {
            setActiveFilter('none');
        }
    };

    // Manejar cambio de marca - desactiva otros filtros
    const handleBrandChange = (value: string) => {
        setSelectedBrand(value);
        if (value) {
            setActiveFilter('brand');
            setMaxPrice('');
        } else {
            setActiveFilter('none');
        }
    };

    // Limpiar filtros
    const clearFilters = () => {
        setActiveFilter('none');
        setMaxPrice('');
        setSelectedBrand('');
    };


    // Filtrar productos
    const filteredProducts = useMemo(() => {
        if (activeFilter === 'none') return products;

        return products.filter(product => {
            if (activeFilter === 'price' && maxPrice) {
                const productPrice = parseFloat(product.price);
                const maxPriceNum = parseFloat(maxPrice);
                return productPrice <= maxPriceNum;
            }
            if (activeFilter === 'brand' && selectedBrand) {
                return product.brand?.toLowerCase() === selectedBrand.toLowerCase();
            }
            return true;
        });
    }, [products, activeFilter, maxPrice, selectedBrand]);

    // Productos visibles (paginados)
    const visibleProducts = useMemo(() => {
        return filteredProducts.slice(0, visibleCount);
    }, [filteredProducts, visibleCount]);

    const hasMore = visibleCount < filteredProducts.length;

    // Reset visible count cuando cambian los filtros
    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [activeFilter, maxPrice, selectedBrand]);

    // Infinite scroll con IntersectionObserver - carga anticipada
    useEffect(() => {
        const loader = loaderRef.current;
        if (!loader || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    startTransition(() => {
                        setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, filteredProducts.length));
                    });
                }
            },
            { threshold: 0, rootMargin: '300px' } // Cargar antes de llegar al final
        );

        observer.observe(loader);
        return () => observer.disconnect();
    }, [hasMore, filteredProducts.length]);

    const hasActiveFilter = activeFilter !== 'none';

    return (
        <div className="min-h-screen bg-white !pt-16 sm:!pt-18 md:!pt-[5%] lg:!pt-[5%] !pb-10 md:!pb-5 lg:!pb-5 flex flex-col md:flex-row min-w-full">
            {/* Filtros */}
            {showFilters && (
                <aside className="w-full md:w-64 lg:w-72 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 md:bg-white">
                    <div className="!px-3 sm:!px-4 !py-3 md:!py-6">
                        {/* Header filtros */}
                        <div className="flex items-center justify-between !mb-3 md:!mb-5">
                            <div className="flex items-center gap-2 !pt-4">
                                <svg className="w-4 h-4 text-gray-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <h2 className="text-xs md:text-sm font-semibold text-gray-800 uppercase tracking-wide">Filtros</h2>
                            </div>
                            {hasActiveFilter && (
                                <button 
                                    onClick={clearFilters}
                                    className="text-[10px] md:text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Limpiar
                                </button>
                            )}
                        </div>
                        
                        {/* Filtros en grid compacto en móvil, vertical en desktop */}
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-4">
                            {/* Precio Max */}
                            <div className="space-y-1 md:space-y-2">
                                <label className="text-[10px] md:text-xs font-medium text-gray-600 uppercase tracking-wider">Precio máximo</label>
                                <div className="relative">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] md:text-xs font-medium">Bs</span>
                                    <input 
                                        type="number" 
                                        value={maxPrice}
                                        onChange={(e) => handlePriceChange(e.target.value)}
                                        disabled={activeFilter === 'brand'}
                                        className={`w-full border rounded-lg !pl-7 md:!pl-8 !pr-2 !py-2 md:!py-2.5 text-[11px] md:text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all ${
                                            activeFilter === 'brand' 
                                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                        placeholder="200"
                                    />
                                </div>
                            </div>
                            
                            {/* Marca */}
                            <div className="space-y-1 md:space-y-2">
                                <label className="text-[10px] md:text-xs font-medium text-gray-600 uppercase tracking-wider">Marca</label>
                                <select 
                                    value={selectedBrand}
                                    onChange={(e) => handleBrandChange(e.target.value)}
                                    disabled={activeFilter === 'price'}
                                    className={`w-full border rounded-lg !px-2.5 !py-2 md:!py-2.5 text-[11px] md:text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 cursor-pointer transition-all appearance-none bg-no-repeat bg-[length:16px] bg-[right_8px_center] ${
                                        activeFilter === 'price' 
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                                >
                                    <option value="">Todas</option>
                                    <option value="Avene">Avene</option>
                                    <option value="Bella Aurora">Bella Aurora</option>
                                    <option value="Bioderma">Bioderma</option>
                                    <option value="Byphasse">Byphasse</option>
                                    <option value="Cerave">Cerave</option>
                                    <option value="Cetaphil">Cetaphil</option>
                                    <option value="Cosrx">Cosrx</option>
                                    <option value="Dove">Dove</option>
                                    <option value="Ecran">Ecran</option>
                                    <option value="Eucerin">Eucerin</option>
                                    <option value="Garnier">Garnier</option>
                                    <option value="Hada Labo">Hada Labo</option>
                                    <option value="Isdin">Isdin</option>
                                    <option value="La Roche Posay">La Roche Posay</option>
                                    <option value="Lactovit">Lactovit</option>
                                    <option value="L'Oréal">L'Oréal</option>
                                    <option value="Missha">Missha</option>
                                    <option value="Neutrogena">Neutrogena</option>
                                    <option value="Nivea">Nivea</option>
                                    <option value="Principia">Principia</option>
                                    <option value="Some By Mi">Some By Mi</option>
                                    <option value="The Ordinary">The Ordinary</option>
                                    <option value="Tocobo">Tocobo</option>
                                    <option value="Uriage">Uriage</option>
                                    <option value="Vichy">Vichy</option>
                                </select>
                            </div>
                        </div>

                        {/* Indicador de filtro activo - más elegante */}
                        {hasActiveFilter && (
                            <div className="!mt-3 md:!mt-4 !px-2.5 !py-2 bg-gray-100 rounded-lg">
                                <p className="text-[10px] md:text-xs text-gray-600 text-center">
                                    {activeFilter === 'price' && (
                                        <span className="flex items-center justify-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Hasta Bs {maxPrice}
                                        </span>
                                    )}
                                    {activeFilter === 'brand' && (
                                        <span className="flex items-center justify-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            {selectedBrand}
                                        </span>
                                    )}
                                    <span className="text-gray-400 !ml-1">({filteredProducts.length})</span>
                                </p>
                            </div>
                        )}
                        
                        {/* Separador visual en desktop */}
                        <div className="hidden md:block !my-5 border-t border-gray-100"></div>
                        
                        {/* Acceso rápido a categorías */}
                        <div className="!mt-3 md:!mt-0">
                            <CategoryDropdown />
                        </div>
                    </div>
                </aside>
            )}


            {/* Lista de productos */}
            <main className="flex-1 !px-2 sm:!px-4 md:!px-6">
                <h1 className="text-lg md:text-xl font-medium text-gray-900 !py-5 md:!py-10 text-center">
                    {title}
                </h1>
                <div className={`grid ${filteredProducts.length == 0 ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2 gap-1 md:gap-2'}`}>
                    {filteredProducts.length === 0 ? (
                        <div className="text-center !py-8 sm:!py-12 text-gray-500">
                            <p className="text-sm sm:text-lg">No se encontraron productos</p>
                            <p className="text-xs sm:text-sm !mt-1 sm:!mt-2">Intenta con otro filtro</p>
                        </div>
                    ) : (
                        visibleProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isInCart={cartProductIds.has(product.id)}
                                onAddToCart={handleToggleCart}
                            />
                        ))
                    )}
                </div>
                {/* Trigger para infinite scroll */}
                {hasMore && (
                    <div ref={loaderRef} className="flex justify-center !py-6">
                        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin"></div>
                    </div>
                )}
                
                {/* Contador de productos */}
                {filteredProducts.length > 0 && (
                    <div className="text-center !py-3 text-[11px] md:text-xs text-gray-400">
                        {hasMore 
                            ? `${visibleProducts.length} de ${filteredProducts.length}`
                            : `${filteredProducts.length} productos`
                        }
                    </div>
                )}
            </main>
        </div>
    );
}
