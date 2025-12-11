// Categorías principales de productos (siempre visibles)
export const mainCategories = [
    { 
        id: 'agua-termal-sprays',
        label: 'Agua Termal y Sprays', 
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        subcategories: []
    },
    { 
        id: 'capilar',
        label: 'Capilar', 
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
        subcategories: []
    },
    { 
        id: 'contorno-de-ojos',
        label: 'Contorno de Ojos', 
        image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop',
        subcategories: [
            { id: 'crema-contorno-ojos', label: 'Crema Contorno de Ojos' },
            { id: 'serum-ojos', label: 'Sérum' }
        ]
    },
    { 
        id: 'exfoliantes',
        label: 'Exfoliantes', 
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop',
        subcategories: [
            { id: 'fisicos', label: 'Físicos' },
            { id: 'quimicos', label: 'Químicos' },
            { id: 'corporales', label: 'Corporales' },
            { id: 'faciales', label: 'Faciales' }
        ]
    },
    { 
        id: 'hidratantes',
        label: 'Hidratantes', 
        image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop',
        subcategories: [
            { id: 'faciales', label: 'Faciales' },
            { id: 'corporales', label: 'Corporales' },
            { id: 'piel-grasa', label: 'Piel Grasa' },
            { id: 'piel-seca', label: 'Piel Seca' },
            { id: 'calmantes', label: 'Calmantes' }
        ]
    },
    { 
        id: 'kits',
        label: 'Kits', 
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
        subcategories: []
    },
];

// Categorías extra (se muestran al dar "Ver más")
export const extraCategories = [
    { 
        id: 'labios',
        label: 'Labios', 
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
        subcategories: []
    },
    { 
        id: 'limpiadores',
        label: 'Limpiadores', 
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
        subcategories: [
            { id: 'piel-grasa', label: 'Piel Grasa' },
            { id: 'piel-acneica', label: 'Piel Acneica' },
            { id: 'piel-seca', label: 'Piel Seca' },
            { id: 'piel-sensible', label: 'Piel Sensible' }
        ]
    },
    { 
        id: 'maquillaje',
        label: 'Maquillaje', 
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop',
        subcategories: []
    },
    { 
        id: 'protectores-solares',
        label: 'Protectores Solares', 
        image: 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400&h=400&fit=crop',
        subcategories: [
            { id: 'piel-grasa', label: 'Piel Grasa' },
            { id: 'piel-acneica', label: 'Piel Acneica' },
            { id: 'piel-seca', label: 'Piel Seca' },
            { id: 'piel-sensible', label: 'Piel Sensible' },
            { id: 'con-color', label: 'Con Color' },
            { id: 'sin-color', label: 'Sin Color' }
        ]
    },
    { 
        id: 'serums',
        label: 'Sérums', 
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
        subcategories: [
            { id: 'acido-hialuronico', label: 'Ácido Hialurónico' },
            { id: 'vitamina-c', label: 'Vitamina C' },
            { id: 'retinol', label: 'Retinol' },
            { id: 'niacinamida', label: 'Niacinamida' }
        ]
    },
    { 
        id: 'tonicos-esencias',
        label: 'Tónicos y Esencias', 
        image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=400&fit=crop',
        subcategories: []
    },
];

// Todas las categorías combinadas
export const allCategories = [...mainCategories, ...extraCategories];

// Configuración de secciones del home
export const sections = {
    'destacados': {
        id: 'destacados',
        titulo: 'Destacados',
        descripcion: 'Nuestros productos más destacados seleccionados especialmente para ti',
        filterKey: 'featured', // Para filtrar productos con product.featured === true
    },
    'mas-vendidos': {
        id: 'mas-vendidos',
        titulo: 'Más Vendidos',
        descripcion: 'Los productos favoritos de nuestros clientes',
        filterKey: 'bestSeller', // Para filtrar productos con product.bestSeller === true
    },
    'en-oferta': {
        id: 'en-oferta',
        titulo: 'En Oferta',
        descripcion: 'Aprovecha nuestras promociones especiales',
        filterKey: 'onSale', // Para filtrar productos con product.onSale === true
    },
    'disponible': {
        id: 'disponible',
        titulo: 'Disponible en Stock',
        descripcion: 'Productos que volvieron a estar disponibles',
        filterKey: 'backInStock', // Para filtrar productos con product.backInStock === true
    },
    'por-necesidad': {
        id: 'por-necesidad',
        titulo: 'Por Necesidad',
        descripcion: 'Encuentra productos según tus necesidades',
        filterKey: 'category', // Este es especial, muestra categorías
        isCategories: true,
    },
};

// Helper para obtener la configuración de una sección
export const getSectionConfig = (sectionId) => {
    return sections[sectionId] || null;
};

// Helper para obtener todas las categorías como lista plana (para "Por Necesidad")
export const getAllCategoriesFlat = () => {
    return allCategories.map(cat => ({
        id: cat.id,
        label: cat.label,
        href: `/categoria/${cat.id}`,
        subcategories: cat.subcategories
    }));
};
