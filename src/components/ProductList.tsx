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
    <div className="flex gap-2 sm:gap-4 !px-2 sm:!px-4 !py-2 sm:!py-4 border-b border-gray-100 bg-white lg:hover:bg-gray-100  cursor-pointer">
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
        <div className="min-h-screen bg-white match:!pt-18 4xs:!pt-18 xs:!pt-18 sm:!pt-18 md:!pt-[5%] lg:!pt-[5%] match:!pb-10 4xs:!pb-10 xs:!pb-10 sm:!pb-10 md:!pb-5 lg:!pb-5  flex flex-col md:flex-row min-w-full">
            {/* Filtros */}
            {showFilters && (
                <div 
                    className="border-b border-gray-200 !px-2 sm:!px-4 !py-2 sm:!py-4 !mt-[5%] sm:!mt-[2%] md:!mt-[2%]"
                >
                    <div className="flex items-center justify-between !mb-2 sm:!mb-4">
                        <h2 className="text-xs sm:text-sm font-medium text-gray-900">Filtros</h2>
                        {hasActiveFilter && (
                            <button 
                                onClick={clearFilters}
                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                                Limpiar filtro
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cois-2 gap-2 sm:gap-3">
                        {/* Precio Max */}
                        <div>
                            <label className="text-[10px] sm:text-xs text-gray-600 block mb-0.5 sm:mb-1">Precio Max</label>
                            <div className="relative">
                                <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[10px] sm:text-sm">Bs</span>
                                <input 
                                    type="number" 
                                    value={maxPrice}
                                    onChange={(e) => handlePriceChange(e.target.value)}
                                    disabled={activeFilter === 'brand'}
                                    className={`w-full border rounded-md !pl-6 sm:!pl-8 !pr-2 sm:!pr-3 !py-1.5 sm:!py-2 text-[10px] sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 ${
                                        activeFilter === 'brand' 
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'border-gray-300 bg-white'
                                    }`}
                                    placeholder="Ej: 200"
                                />
                            </div>
                        </div>
                        
                        {/* Marca */}
                        <div>
                            <label className="text-[10px] sm:text-xs text-gray-600 block mb-0.5 sm:mb-1">Marca</label>
                            <select 
                                value={selectedBrand}
                                onChange={(e) => handleBrandChange(e.target.value)}
                                disabled={activeFilter === 'price'}
                                className={`w-full border rounded-md !px-2 sm:!px-4 !py-1.5 sm:!py-2 text-[10px] sm:text-sm focus:outline-none cursor-pointer ${
                                    activeFilter === 'price' 
                                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            >
                                <option value="">Todas las marcas</option>
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

                    {/* Indicador de filtro activo */}
                    {hasActiveFilter && (
                        <div className="!mt-2 sm:!mt-3 text-[10px] sm:text-xs text-gray-500 text-center">
                            {activeFilter === 'price' && `Mostrando productos hasta Bs ${maxPrice}`}
                            {activeFilter === 'brand' && `Mostrando productos de ${selectedBrand}`}
                            {` (${filteredProducts.length} productos)`}
                        </div>
                    )}
                    
                    {/* Acceso rápido a categorías */}
                    <div className="!mt-2 sm:!mt-3">
                        <CategoryDropdown />
                    </div>
                </div>
            )}


            {/* Lista de productos */}
            <div className="grid !mt-4 w-full">
                <div className="!px-2 sm:!px-4 !pb-3 sm:!pb-5 !mt-3 sm:!mt-6">
                    <h1 className="text-lg sm:text-[1.4rem] md:text-[1.6rem] text-center text-gray-900">
                        {title}
                    </h1>
                </div>
                <div className={`grid ${filteredProducts.length == 0 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 gap-5 !px-2 !pr-4'}`}>
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
                <div className='flex flex-col items-center justify-between'>
                    {/* Trigger para infinite scroll */}
                    {hasMore && (
                        <div ref={loaderRef} className="flex justify-center !py-4 sm:!py-6">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        </div>
                    )}
                    
                    {/* Contador de productos */}
                    {filteredProducts.length > 0 && (
                        <div className="text-center !py-2 sm:!py-4 text-xs sm:text-sm text-gray-500">
                            {hasMore 
                                ? `Mostrando ${visibleProducts.length} de ${filteredProducts.length} productos`
                                : `${filteredProducts.length} productos`
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
