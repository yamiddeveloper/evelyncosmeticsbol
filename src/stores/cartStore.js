import { atom, computed } from 'nanostores';

// Clave para localStorage
const CART_STORAGE_KEY = 'evelyn_cart';

/** @typedef {{id: number, name: string, brand: string, price: number, image: string, quantity: number, originalPrice?: number}} CartItem */

// Store principal del carrito
/** @type {import('nanostores').WritableAtom<CartItem[]>} */
export const cartItems = atom(/** @type {CartItem[]} */ ([]));

// Flag para saber si ya se inicializó
let isInitialized = false;

// Función para inicializar el carrito desde localStorage
export function initCart() {
    if (isInitialized || typeof window === 'undefined') return;
    
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                cartItems.set(parsed);
            }
        }
    } catch {
        // Ignorar errores
    }
    
    // Suscribirse a cambios para persistir
    cartItems.listen(items => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Ignorar errores
        }
    });
    
    isInitialized = true;
}

// Computed: total de productos
export const cartCount = computed(cartItems, items => 
    items.reduce((sum, item) => sum + item.quantity, 0)
);

// Computed: subtotal en BS
export const cartTotal = computed(cartItems, items => 
    items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
);

// Agregar producto al carrito
export function addToCart(product) {
    const items = cartItems.get();
    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
        // Si ya existe, incrementar cantidad
        cartItems.set(items.map(item => 
            item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ));
    } else {
        // Si no existe, agregar nuevo
        cartItems.set([...items, {
            id: product.id,
            name: product.name,
            brand: product.brand || product.description || 'Marca del producto',
            price: parseFloat(product.price),
            image: product.image,
            quantity: 1
        }]);
    }
}

// Remover producto del carrito
export function removeFromCart(productId) {
    cartItems.set(cartItems.get().filter(item => item.id !== productId));
}

// Actualizar cantidad
export function updateQuantity(productId, delta) {
    const items = cartItems.get();
    cartItems.set(items.map(item => {
        if (item.id === productId) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) {
                return null; // Marcar para eliminar
            }
            return { ...item, quantity: newQuantity };
        }
        return item;
    }).filter(Boolean)); // Eliminar items marcados como null
}

// Verificar si un producto está en el carrito
export function isInCart(productId) {
    return cartItems.get().some(item => item.id === productId);
}

// Limpiar carrito
export function clearCart() {
    cartItems.set([]);
}
