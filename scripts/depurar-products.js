/**
 * Script para depurar products-scraped.json
 * Elimina entradas basura y limpia los datos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Palabras/frases que indican que NO es un producto real
const INVALID_PATTERNS = [
    'cookies',
    'categorías',
    'ordenar por',
    'menor precio',
    'mayor precio',
    'a-z',
    'z-a',
    'instaview',
    'lista',
    'términos',
    'condiciones',
    'horario',
    'política',
    'privacidad',
    'acepto',
    'utilizamos',
    'optimizar',
    'servicio',
    '@evelyn',
    '+591',
    'gmail.com',
    'whatsapp',
    'instagram',
    'facebook',
    'black days',
    'ofertón',
    'destacados',
    'coreano y japonés',
    'cabello',
    'maquillaje',
    'labios 👄',
    'otros',
    'principia y más',
    'lidherma y más',
    'tocobo & skin1004',
    'revox b77',
    'byphasse & b. aurora',
    'ecran y lactovit'
];

// Marcas válidas conocidas
const VALID_BRANDS = [
    'Avene', 'Avène', 'La Roche Posay', 'La Roche-Posay', 
    'Bioderma', 'Cerave', 'CeraVe', 'Cetaphil', 
    'Eucerin', 'Isdin', 'ISDIN', 'Neutrogena', 
    'Loreal', "L'Oreal", "L'Oréal", 'Vichy', 'Nivea',
    'Garnier', 'Dove', "Pond's", 'Olay', 'Uriage',
    'SVR', 'Filorga', 'Caudalie', 'Nuxe', 'Rilastil',
    'The Ordinary', 'Lidherma', 'Principia', 'Revox',
    'Tocobo', 'Skin1004', 'Byphasse', 'Bella Aurora',
    'Ecran', 'Lactovit', 'Hada Labo', 'Cosrx', 'Some By Mi',
    'Rohto', 'Melano CC', 'Innisfree', 'Missha', 'Laneige',
    'Etude House', 'Klairs', 'Purito', 'Neogen', 'Mizon'
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
    if (!product.name || typeof product.name !== 'string') {
        return false;
    }
    
    const nameLower = product.name.toLowerCase().trim();
    
    // Verificar patrones inválidos
    for (const pattern of INVALID_PATTERNS) {
        if (nameLower.includes(pattern.toLowerCase()) || nameLower === pattern.toLowerCase()) {
            return false;
        }
    }
    
    // Nombre muy corto = probablemente no es producto
    if (product.name.length < 15) {
        return false;
    }
    
    // Debe tener precio con BOB
    if (!product.price || !product.price.includes('BOB')) {
        return false;
    }
    
    // Debe tener imagen válida
    if (!product.image || product.image.length < 20) {
        return false;
    }
    
    // Verificar que parece un nombre de producto (tiene números o ml/g/etc)
    const hasProductIndicators = /\d+\s*(ml|g|gr|oz|mg|l|kg|un|pz|pack)/i.test(product.name) ||
                                  VALID_BRANDS.some(b => nameLower.includes(b.toLowerCase()));
    
    if (!hasProductIndicators) {
        // Si no tiene indicadores de producto, verificar que al menos tenga una marca conocida
        const hasBrand = VALID_BRANDS.some(b => nameLower.includes(b.toLowerCase()));
        if (!hasBrand && product.name.length < 30) {
            return false;
        }
    }
    bg-gray-100 border-gray-200 border text-grabg-gray-100 border-gray-200 border text-gray-400 cursor-not-allowed
    return true;border-gray-300 border bg-whitebg-gray-100 border-gray-200 border text-gray-400 cursor-not-allowedallowed
}border-gray-300 border bg-whiteborder-gray-300 border bg-white

function cleanPrice(priceStr) {
    if (!priceStr) return '0';
    // Extraer solo el número del precio
    const match = priceStr.match(/[\d,.]+/);
    if (match) {
        return match[0].replace(',', '.');
    }
    return '0';
}

function depurarProductos() {
    const inputPath = path.join(__dirname, 'products-scraped.json');
    const outputPath = path.join(__dirname, 'products-depurado.json');
    const dataOutputPath = path.join(__dirnbg-gray-100 border-gray-200 border text-gray-400 cursor-not-allowedallowed
    bg-white border-gray-300 border text-grbg-gray-100 border-gray-200 border text-gray-400 cursor-not-allowedallowed
    console.log('📂 Leyendo products-scrapebg-white border-gray-300 border text-gray-900ray-900
    const rawProducts = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    console.log(`   Total productos raw: ${rawProducts.length}\n`);
    
    // Filtrar productos válidos
    console.log('🧹 Filtrando productos inválidos...');
    const validProducts = rawProducts.filter(isValidProduct);
    console.log(`   Productos válidos: ${validProducts.length}`);
    console.log(`   Eliminados: ${rawProducts.length - validProducts.length}\n`);
    
    // Eliminar duplicados por nombre normalizado
    console.log('🔄 Eliminando duplicados...');
    const uniqueProducts = [];
    const seenNames = new Set();
    
    for (const product of validProducts) {
        // Normalizar nombre para comparación
        const normalizedName = product.name.toLowerCase().trim()
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s]/g, '');
        
        if (!seenNames.has(normalizedName)) {
            seenNames.add(normalizedName);
            
            const cleanedProduct = {
                id: uniqueProducts.length + 1,
                name: product.name.trim(),
                brand: extractBrand(product.name),
                price: cleanPrice(product.price),
                priceFormatted: product.price,
                image: product.image,
                description: (product.description || '').substring(0, 500),
                featured: false,
                bestSeller: false,
                onSale: false,
                backInStock: false
            };
            
            uniqueProducts.push(cleanedProduct);
        }
    }
    
    console.log(`   Productos únicos: ${uniqueProducts.length}\n`);
    
    // Asignar flags aleatorios para demo
    uniqueProducts.forEach((p, i) => {
        if (i % 6 === 0) p.featured = true;
        if (i % 8 === 0) p.bestSeller = true;
        if (i % 12 === 0) p.onSale = true;
        if (i % 15 === 0) p.backInStock = true;
    });
    
    // Guardar en scripts/
    fs.writeFileSync(outputPath, JSON.stringify(uniqueProducts, null, 2), 'utf-8');
    console.log(`💾 Guardado en: scripts/products-depurado.json`);
    
    // Guardar en src/data/
    fs.writeFileSync(dataOutputPath, JSON.stringify(uniqueProducts, null, 2), 'utf-8');
    console.log(`💾 Guardado en: src/data/products.json\n`);
    
    // Estadísticas por marca
    const brandStats = {};
    uniqueProducts.forEach(p => {
        brandStats[p.brand] = (brandStats[p.brand] || 0) + 1;
    });
    
    console.log('📊 Productos por marca:');
    console.log('─'.repeat(40));
    Object.entries(brandStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .forEach(([brand, count]) => {
            const bar = '█'.repeat(Math.min(count, 30));
            console.log(`   ${brand.padEnd(18)} ${String(count).padStart(3)} ${bar}`);
        });
    
    // Mostrar ejemplos
    console.log('\n📦 Primeros 10 productos depurados:');
    console.log('═'.repeat(60));
    uniqueProducts.slice(0, 10).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name.substring(0, 70)}${p.name.length > 70 ? '...' : ''}`);
        console.log(`   🏷️  Marca: ${p.brand}`);
        console.log(`   💰 Precio: ${p.priceFormatted}`);
        console.log(`   🖼️  Imagen: ${p.image.substring(0, 50)}...`);
    });
    
    console.log('\n' + '═'.repeat(60));
    console.log(`✅ DEPURACIÓN COMPLETADA: ${uniqueProducts.length} productos listos`);
    console.log('═'.repeat(60));
    
    return uniqueProducts;
}

depurarProductos();
