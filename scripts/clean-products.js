/**
 * Script para limpiar los productos scrapeados
 * Elimina entradas que no son productos reales
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Palabras que indican que NO es un producto
const INVALID_NAMES = [
    'cookies',
    'categorías',
    'todo',
    'ordenar',
    'menor precio',
    'mayor precio',
    'a-z',
    'z-a',
    'instaview',
    'lista',
    'términos',
    'condiciones',
    'horario',
    'lunes',
    'domingo',
    'acepto',
    'política',
    'privacidad'
];

// Marcas válidas
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
    const nameLower = product.name.toLowerCase();
    
    // Verificar que no sea una entrada inválida
    for (const invalid of INVALID_NAMES) {
        if (nameLower.includes(invalid) || nameLower === invalid) {
            return false;
        }
    }
    
    // Debe tener más de 10 caracteres
    if (product.name.length < 10) {
        return false;
    }
    
    // Debe tener un precio válido
    if (!product.price || !product.price.includes('BOB')) {
        return false;
    }
    
    // Debe tener una imagen
    if (!product.image || product.image.length < 10) {
        return false;
    }
    
    return true;
}

function cleanProducts() {
    const inputPath = path.join(__dirname, '..', 'src', 'data', 'products-scraped.json');
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
    
    console.log('📂 Leyendo productos...');
    const rawProducts = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    console.log(`   Total productos raw: ${rawProducts.length}`);
    
    // Filtrar productos válidos
    const validProducts = rawProducts.filter(isValidProduct);
    console.log(`   Productos válidos: ${validProducts.length}`);
    
    // Eliminar duplicados por nombre
    const uniqueProducts = [];
    const seenNames = new Set();
    
    for (const product of validProducts) {
        const normalizedName = product.name.toLowerCase().trim();
        if (!seenNames.has(normalizedName)) {
            seenNames.add(normalizedName);
            uniqueProducts.push({
                id: uniqueProducts.length + 1,
                name: product.name.trim(),
                brand: extractBrand(product.name),
                price: product.price.replace('BOB ', '').replace(',', ''),
                priceOriginal: product.price,
                image: product.image,
                description: product.description || '',
                featured: false,
                bestSeller: false,
                onSale: product.price.includes('OFF') || false,
                backInStock: false
            });
        }
    }
    
    console.log(`   Productos únicos: ${uniqueProducts.length}`);
    
    // Marcar algunos como destacados/más vendidos aleatoriamente
    uniqueProducts.forEach((p, i) => {
        if (i % 5 === 0) p.featured = true;
        if (i % 7 === 0) p.bestSeller = true;
        if (i % 10 === 0) p.onSale = true;
    });
    
    // Guardar productos limpios
    fs.writeFileSync(outputPath, JSON.stringify(uniqueProducts, null, 2), 'utf-8');
    console.log(`\n✅ Productos guardados en: src/data/products.json`);
    
    // Estadísticas por marca
    const brandStats = {};
    uniqueProducts.forEach(p => {
        brandStats[p.brand] = (brandStats[p.brand] || 0) + 1;
    });
    
    console.log('\n📊 Productos por marca:');
    Object.entries(brandStats)
        .sort((a, b) => b[1] - a[1])
        .forEach(([brand, count]) => {
            console.log(`   ${brand}: ${count}`);
        });
    
    // Mostrar algunos ejemplos
    console.log('\n📦 Ejemplos de productos limpios:');
    uniqueProducts.slice(0, 5).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name.substring(0, 60)}...`);
        console.log(`   Marca: ${p.brand}`);
        console.log(`   Precio: ${p.priceOriginal}`);
    });
    
    return uniqueProducts;
}

cleanProducts();
