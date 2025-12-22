/**
 * Script para limpiar los productos scrapeados de Evelyn Cosmetics
 * Ajustado para procesar la salida de Puppeteer
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Palabras que indican ruido en el catálogo de Kyte
const INVALID_NAMES = [
    'cookies', 'categorías', 'ordenar', 'menor precio', 
    'mayor precio', 'a-z', 'z-a', 'instaview', 'términos', 
    'condiciones', 'horario de atención', 'acepto', 
    'política', 'privacidad', 'ver carrito', 'mi cuenta'
];

// Marcas actualizadas y extendidas
const VALID_BRANDS = [
    'Avene', 'Avène', 'La Roche Posay', 'La Roche-Posay', 
    'Bioderma', 'Cerave', 'CeraVe', 'Cetaphil', 
    'Eucerin', 'Isdin', 'ISDIN', 'Neutrogena', 
    'Loreal', "L'Oreal", 'Vichy', 'Nivea',
    'Garnier', 'Dove', 'Pond\'s', 'Olay', 'Uriage',
    'SVR', 'Filorga', 'Caudalie', 'Nuxe', 'Rilastil',
    'The Ordinary', 'Lidherma', 'Principia', 'Revox',
    'Tocobo', 'Skin1004', 'Byphasse', 'Bella Aurora',
    'Ecran', 'Lactovit', 'Hada Labo', 'Cosrx', 'Some By Mi'
];

function extractBrand(productName) {
    const nameLower = productName.toLowerCase();
    for (const brand of VALID_BRANDS) {
        if (nameLower.includes(brand.toLowerCase())) {
            return brand;
        }
    }
    return 'Otra marca';
}

function isValidProduct(product) {
    if (!product.name || !product.price) return false;
    
    const nameLower = product.name.toLowerCase();
    
    // 1. Filtrar nombres inválidos o muy cortos
    const isInvalidName = INVALID_NAMES.some(invalid => nameLower.includes(invalid));
    if (isInvalidName || product.name.length < 5) return false;
    
    // 2. Verificar que tenga precio válido (número o string con dígitos)
    const priceStr = String(product.price);
    if (!priceStr.match(/\d/)) return false;
    
    // 3. Verificar que tenga una imagen válida de Kyte o externa
    if (!product.image || product.image.includes('placeholder') || product.image.length < 10) return false;
    
    return true;
}

function cleanPrice(priceString) {
    // Elimina "BOB", espacios y convierte coma en punto si es necesario
    return priceString
        .replace(/BOB/g, '')
        .replace(/\s/g, '')
        .replace(',', '.')
        .trim();
}

function cleanProducts() {
    // Rutas relativas a la carpeta 'scripts'
    const inputPath = path.join(__dirname, 'products-scraped.json');
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
    
    if (!fs.existsSync(inputPath)) {
        console.error(`❌ No se encontró el archivo: ${inputPath}`);
        return;
    }

    console.log('📂 Procesando productos scrapeados...');
    const rawProducts = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    
    const uniqueProducts = [];
    const seenNames = new Set();
    
    // Filtrar y Formatear
    const filtered = rawProducts.filter(isValidProduct);

    filtered.forEach(product => {
        const normalizedName = product.name.trim();
        
        if (!seenNames.has(normalizedName.toLowerCase())) {
            seenNames.add(normalizedName.toLowerCase());
            
            const priceCleaned = cleanPrice(product.price);
            
            uniqueProducts.push({
                id: uniqueProducts.length + 1,
                name: normalizedName,
                brand: extractBrand(normalizedName),
                price: parseFloat(priceCleaned) || 0,
                priceString: `Bs. ${priceCleaned}`,
                oldPrice: product.oldPrice ? cleanPrice(product.oldPrice) : null,
                image: product.image,
                description: product.description || '',
                category: "Skin Care", // Categoría por defecto
                featured: false,
                bestSeller: false,
                onSale: !!product.oldPrice, // Si tiene precio anterior, está en oferta
                stock: true
            });
        }
    });

    // Lógica de Marketing (Aleatoria para el catálogo inicial)
    uniqueProducts.forEach((p, i) => {
        if (i % 8 === 0) p.featured = true;
        if (i % 10 === 0) p.bestSeller = true;
    });

    // Crear carpeta si no existe
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(uniqueProducts, null, 2), 'utf-8');
    
    console.log(`\n✅ Proceso completado:`);
    console.log(`   - Originales: ${rawProducts.length}`);
    console.log(`   - Válidos y Únicos: ${uniqueProducts.length}`);
    console.log(`   - Guardado en: src/data/products.json`);
}

cleanProducts();