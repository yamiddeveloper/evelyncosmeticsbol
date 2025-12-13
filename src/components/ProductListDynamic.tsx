import { useState, useCallback, useEffect, useRef, memo } from 'react';
import CategoryDropdown from './CategoryDropdown';

interface Product {
    id: number;
    name: string;
    brand?: string;
    price: string;
    priceFormatted?: string;
    image: string;
    featured?: boolean;
}

interface ProductListDynamicProps {
    title: string;
    showFilters?: boolean;
    initialProducts?: Product[];
}

type FilterType = 'none' | 'price' | 'brand';

const ITEMS_PER_PAGE = 30;

// Componente de producto memoizado y simplificado
const ProductCard = memo(({ 
    product, 
    isInCart, 
    onToggleCart 
}: { 
    product: Product; 
    isInCart: boolean; 
    onToggleCart: (id: number) => void;
}) => (
    <div className="flex gap-4 !px-4 !py-4 border-b border-gray-100">
        <div className="w-28 h-28 shrink-0 relative">
            <img 
                src={product.image} 
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-lg bg-gray-100"
            />
            {product.featured && (
                <span className="absolute top-1 left-1 bg-gray-900 text-white w-5 h-5 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </span>
            )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <span className="text-[.9rem] text-gray-500 block">{product.brand || 'Marca del producto'}</span>
                <h3 className="text-[.85rem] font-medium text-gray-900 !mt-0.5">{product.name}</h3>
                <p className="text-xl font-medium text-gray-900 !mt-3">{product.priceFormatted || `BOB ${product.price}`}</p>
            </div>
            
            <button 
                onClick={() => onToggleCart(product.id)}
                className={`w-full h-[40px] text-sm font-medium !py-3 rounded-[20px] !mt-3 cursor-pointer flex items-center justify-center gap-2 transition-colors ${
                    isInCart
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
            >
                {isInCart ? (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Ver carrito
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// Skeleton loader para productos
const ProductSkeleton = () => (
    <div className="flex gap-4 !px-4 !py-4 border-b border-gray-100 animate-pulse">
        <div className="w-28 h-28 shrink-0 bg-gray-200 rounded-lg" />
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-6 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-10 bg-gray-200 rounded-full !mt-3" />
        </div>
    </div>
);

export default function ProductListDynamic({ 
    title, 
    showFilters = true,
    initialProducts = []
}: ProductListDynamicProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(initialProducts.length === 0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    
    const [activeFilter, setActiveFilter] = useState<FilterType>('none');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());
    
    const loaderRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Cache de todos los productos
    const allProductsRef = useRef<Product[]>([]);

    // Función para cargar productos
    const fetchProducts = useCallback(async (pageNum: number, reset: boolean = false) => {
        // Cancelar petición anterior si existe
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const isFirstLoad = reset || pageNum === 1;
        if (isFirstLoad) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            // Cargar todos los productos solo una vez
            if (allProductsRef.current.length === 0) {
                const response = await fetch('/products-lite.json', {
                    signal: abortControllerRef.current.signal
                });
                allProductsRef.current = await response.json();
            }

            // Filtrar en cliente
            let filtered = allProductsRef.current;
            
            if (selectedBrand) {
                filtered = filtered.filter(p => 
                    p.brand?.toLowerCase() === selectedBrand.toLowerCase()
                );
            }
            
            if (maxPrice) {
                const max = parseFloat(maxPrice);
                filtered = filtered.filter(p => parseFloat(p.price) <= max);
            }

            const totalFiltered = filtered.length;
            const start = (pageNum - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const pageProducts = filtered.slice(start, end);
            
            setProducts(prev => reset ? pageProducts : [...prev, ...pageProducts]);
            setHasMore(end < totalFiltered);
            setTotal(totalFiltered);
            setPage(pageNum);
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('Error fetching products:', error);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [selectedBrand, maxPrice]);

    // Cargar productos iniciales
    useEffect(() => {
        if (initialProducts.length === 0) {
            fetchProducts(1, true);
        }
    }, []);

    // Recargar cuando cambian los filtros
    useEffect(() => {
        fetchProducts(1, true);
    }, [selectedBrand, maxPrice]);

    // Toggle producto en carrito
    const toggleCart = useCallback((productId: number) => {
        setAddedToCart(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    }, []);

    // Manejar cambio de precio
    const handlePriceChange = (value: string) => {
        setMaxPrice(value);
        if (value) {
            setActiveFilter('price');
            setSelectedBrand('');
        } else {
            setActiveFilter('none');
        }
    };

    // Manejar cambio de marca
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

    // Infinite scroll
    useEffect(() => {
        const loader = loaderRef.current;
        if (!loader || !hasMore || loading || loadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    fetchProducts(page + 1, false);
                }
            },
            { threshold: 0, rootMargin: '400px' }
        );

        observer.observe(loader);
        return () => observer.disconnect();
    }, [hasMore, loading, loadingMore, page, fetchProducts]);

    const hasActiveFilter = activeFilter !== 'none';

    return (
        <div className="min-h-screen bg-white match:!pt-24 4xs:!pt-24 xs:!pt-24 sm:!pt-24 md:!pt-[3%] lg:!pt-[3%]">
            {/* Filtros */}
            {showFilters && (
                <div className="border-b border-gray-200 !px-4 !py-4 !mt-[7%]">
                    <div className="flex items-center justify-between !mb-4">
                        <h2 className="text-sm font-medium text-gray-900">Filtros</h2>
                        {hasActiveFilter && (
                            <button 
                                onClick={clearFilters}
                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                                Limpiar filtro
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {/* Precio Max */}
                        <div>
                            <label className="text-xs text-gray-600 block mb-1">Precio Max</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Bs</span>
                                <input 
                                    type="number" 
                                    value={maxPrice}
                                    onChange={(e) => handlePriceChange(e.target.value)}
                                    disabled={activeFilter === 'brand'}
                                    className={`w-full border rounded-md !pl-8 !pr-3 !py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 ${
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
                            <label className="text-xs text-gray-600 block mb-1">Marca</label>
                            <select 
                                value={selectedBrand}
                                onChange={(e) => handleBrandChange(e.target.value)}
                                disabled={activeFilter === 'price'}
                                className={`w-full border rounded-md !px-4 !py-2 text-sm focus:outline-none cursor-pointer ${
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
                    {hasActiveFilter && !loading && (
                        <div className="!mt-3 text-xs text-gray-500 text-center">
                            {activeFilter === 'price' && `Mostrando productos hasta Bs ${maxPrice}`}
                            {activeFilter === 'brand' && `Mostrando productos de ${selectedBrand}`}
                            {` (${total} productos)`}
                        </div>
                    )}
                    
                    {/* Acceso rápido a categorías */}
                    <div className="!mt-3">
                        <CategoryDropdown />
                    </div>
                </div>
            )}

            {/* Título de sección - cambia según filtro */}
            <div className="!px-4 !pb-5 !mt-6">
                <h1 className="text-2xl md:text-3xl text-center text-gray-900">
                    {selectedBrand ? `Productos ${selectedBrand}` : title}
                </h1>
                {selectedBrand && (
                    <p className="text-center text-gray-500 text-sm !mt-2">
                        Filtrando por marca
                    </p>
                )}
            </div>

            {/* Lista de productos */}
            <div className="flex flex-col">
                {loading ? (
                    // Skeleton loaders durante carga inicial
                    <>
                        {[...Array(6)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </>
                ) : products.length === 0 ? (
                    <div className="text-center !py-12 text-gray-500">
                        <p className="text-lg">No se encontraron productos</p>
                        <p className="text-sm !mt-2">Intenta con otro filtro</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isInCart={addedToCart.has(product.id)}
                            onToggleCart={toggleCart}
                        />
                    ))
                )}
                
                {/* Trigger para infinite scroll */}
                {hasMore && !loading && (
                    <div ref={loaderRef} className="flex justify-center !py-6">
                        {loadingMore && (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        )}
                    </div>
                )}
                
                {/* Contador de productos */}
                {!loading && products.length > 0 && (
                    <div className="text-center !py-4 text-sm text-gray-500">
                        {hasMore 
                            ? `Mostrando ${products.length} de ${total} productos`
                            : `${total} productos`
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
