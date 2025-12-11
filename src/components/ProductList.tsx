import { motion } from 'framer-motion';

interface Product {
    id: number;
    name: string;
    brand?: string;
    description?: string;
    price: string;
    image: string;
    featured?: boolean;
    discount?: string;
}

interface ProductListProps {
    products: Product[];
    title: string;
    showFilters?: boolean;
    categories?: { id: string; label: string }[];
}

export default function ProductList({ 
    products, 
    title, 
    showFilters = true, 
    categories = [] 
}: ProductListProps) {
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
                    <h2 className="text-center text-sm font-medium text-gray-900 !mb-4">Filtros</h2>
                    
                    <div className="grid grid-cols-2 gap-3 !mb-3">
                        {/* Precio Max */}
                        <div>
                            <label className="text-xs text-gray-600 block mb-1">Precio Max</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                                <input 
                                    type="number" 
                                    className="w-full border border-gray-300 rounded-md !pl-7 !pr-3 !py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    placeholder=""
                                />
                            </div>
                        </div>
                        
                        {/* Marca */}
                        <div>
                            <label className="text-xs text-gray-600 block mb-1">Marca</label>
                            <select className="w-full bg-white border-gray-300 border text-gray-900 rounded-md !px-4 !py-2 text-sm focus:outline-none cursor-pointer">
                                <option>Seleccionar Marca</option>
                                <option>Marca 1</option>
                                <option>Marca 2</option>
                                <option>Marca 3</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Categoría */}
                    <div>
                        <select className="w-full bg-gray-800 text-white rounded-md !px-4 !py-2 text-sm focus:outline-none cursor-pointer">
                            <option>Seleccionar categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
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
                {products.map((product, index) => (
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
                                <span className="text-xs text-gray-500 block">{product.brand || product.description || 'Marca del producto'}</span>
                                <h3 className="text-base font-medium text-gray-900 !mt-0.5">{product.name}</h3>
                                <p className="text-xl font-medium text-gray-900 !mt-1">${product.price}</p>
                            </div>
                            
                            {/* Botón */}
                            {index === 0 ? (
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gray-900 text-white text-sm font-medium !py-2.5 rounded-md !mt-2"
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
