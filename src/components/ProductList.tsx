import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import CategoryDropdown from './CategoryDropdown';

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

export default function ProductList({ 
    products, 
    title, 
    showFilters = true, 
    categories = [] 
}: ProductListProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>('none');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [selectedBrand, setSelectedBrand] = useState<string>('');

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

    const hasActiveFilter = activeFilter !== 'none';

    return (
        <div className="min-h-screen bg-white match:!pt-24 4xs:!pt-24 xs:!pt-24 sm:!pt-24 md:!pt-[3%] lg:!pt-[3%]">
            {/* Filtros */}
            {showFilters && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border-b border-gray-200 !px-4 !py-4 !mt-[7%]"
                >
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
                    {hasActiveFilter && (
                        <div className="!mt-3 text-xs text-gray-500 text-center">
                            {activeFilter === 'price' && `Mostrando productos hasta Bs ${maxPrice}`}
                            {activeFilter === 'brand' && `Mostrando productos de ${selectedBrand}`}
                            {` (${filteredProducts.length} productos)`}
                        </div>
                    )}
                    
                    {/* Acceso rápido a categorías */}
                    <div className="!mt-3">
                        <CategoryDropdown />
                    </div>
                </motion.div>
            )}

            {/* Título de sección */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="!px-4 !pb-5 !mt-6"
            >
                <h1 className="text-2xl md:text-3xl text-center text-gray-900">
                    {title}
                </h1>
            </motion.div>

            {/* Lista de productos */}
            <div className="flex flex-col">
                {filteredProducts.length === 0 && (
                    <div className="text-center !py-12 text-gray-500">
                        <p className="text-lg">No se encontraron productos</p>
                        <p className="text-sm !mt-2">Intenta con otro filtro</p>
                    </div>
                )}
                {filteredProducts.map((product, index) => (
                    <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex gap-4 !px-4 !py-4 border-b border-gray-100"
                    >
                        {/* Imagen */}
                        <div className="w-28 h-28 shrink-0 relative">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            {product.featured && (
                                <span className="absolute top-1 left-1 bg-gray-900 text-white w-5 h-5 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </span>
                            )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <span className="text-[.9rem] text-gray-500 block">{product.brand || product.description || 'Marca del producto'}</span>
                                <h3 className="text-[.85rem] font-medium text-gray-900 !mt-0.7">{product.name}</h3>
                                <p className="text-xl font-medium text-gray-900 !mt-3">{product.priceFormatted || `BOB ${product.price}`}</p>
                            </div>
                            
                            {/* Botón */}
                            {index === 0 ? (
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gray-900 text-white text-sm font-medium !py-2.5 rounded-md !mt-2 cursor-pointer"
                                >
                                    Ver el carrito
                                </motion.button>
                            ) : (
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gray-400 text-white text-sm font-medium !py-2.5 !pl-4 rounded-md !mt-2"
                                >
                                    Agregar al carrito
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
