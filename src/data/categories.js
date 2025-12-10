// Categorías principales de productos (siempre visibles)
export const mainCategories = [
    { 
        id: 'agua-termal-sprays',
        label: 'Agua Termal y Sprays', 
        subcategories: []
    },
    { 
        id: 'capilar',
        label: 'Capilar', 
        subcategories: []
    },
    { 
        id: 'contorno-de-ojos',
        label: 'Contorno de Ojos', 
        subcategories: [
            { id: 'crema-contorno-ojos', label: 'Crema Contorno de Ojos' },
            { id: 'serum-ojos', label: 'Sérum' }
        ]
    },
    { 
        id: 'exfoliantes',
        label: 'Exfoliantes', 
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
        subcategories: []
    },
];

// Categorías extra (se muestran al dar "Ver más")
export const extraCategories = [
    { 
        id: 'labios',
        label: 'Labios', 
        subcategories: []
    },
    { 
        id: 'limpiadores',
        label: 'Limpiadores', 
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
        subcategories: []
    },
    { 
        id: 'protectores-solares',
        label: 'Protectores Solares', 
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
