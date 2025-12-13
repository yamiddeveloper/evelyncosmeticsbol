import React from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity as updateQty } from '../stores/cartStore';

const Cart = ({ isOpen, onClose }) => {
    const $cartItems = useStore(cartItems);
    const totalProducts = useStore(cartCount);
    const subtotal = useStore(cartTotal);
    const ahorro = 0; // Calcular descuentos si aplica

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-[100] h-screen"
                        onClick={onClose}
                    />

                    {/* Panel del carrito */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 right-0 h-screen w-full max-w-md bg-white z-[101] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between !px-4 !py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Carrito de compras</h2>
                            <button 
                                onClick={onClose}
                                className="!p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                            >
                                <FiX className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Lista de productos */}
                        <div className="flex-1 overflow-y-auto !px-4 !py-4">
                            {$cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <svg className="w-16 h-16 !mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <p className="text-lg">Tu carrito está vacío</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {$cartItems.map((item) => (
                                        <div 
                                            key={item.id}
                                            className="flex gap-3 !py-3 border-b border-gray-100"
                                        >
                                            {/* Imagen */}
                                            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <p className="text-xs text-gray-500">{item.brand}</p>
                                                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                                    <div className="flex items-center gap-2 !mt-1">
                                                        {item.originalPrice && item.originalPrice > item.price && (
                                                            <span className="text-xs text-gray-400 line-through">
                                                                Bs {item.originalPrice}
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            Bs {item.price}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Cantidad y eliminar */}
                                                <div className="flex items-center justify-between !mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => updateQty(item.id, -1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
                                                        >
                                                            <FiMinus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQty(item.id, 1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
                                                        >
                                                            <FiPlus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Botón eliminar */}
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="self-start !p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer con totales */}
                        <div className="border-t border-gray-200 !px-4 !py-4 bg-white">
                            <div className="space-y-2 !mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Ahorro</span>
                                    <span className="text-gray-900">Bs {ahorro.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm !mt-2">
                                    <span className="text-gray-600">Total productos ({totalProducts})</span>
                                    <span className="text-gray-900">Bs {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold !pt-2 border-t border-gray-100 py-2">
                                    <span>Subtotal</span>
                                    <span>Bs {subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                className="w-full bg-gray-900 text-white font-medium !py-3 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
                                onClick={() => {
                                    // Navegar al checkout
                                    window.location.href = '/checkout';
                                }}
                            >
                                Ver Carrito
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Cart;
