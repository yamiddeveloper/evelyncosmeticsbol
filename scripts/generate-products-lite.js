/**
 * Script para generar products-lite.json
 * Ejecutar: node scripts/generate-products-lite.js
 * 
 * Este archivo optimizado reduce el tamaño del JSON eliminando
 * campos innecesarios para la vista de lista (como description).
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../src/data/products.json');
const outputPath = path.join(__dirname, '../public/products-lite.json');

const products = require(inputPath);

const optimized = products.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    priceFormatted: p.priceFormatted,
    image: p.image,
    featured: p.featured
}));

fs.writeFileSync(outputPath, JSON.stringify(optimized));

const originalSize = fs.statSync(inputPath).size;
const optimizedSize = fs.statSync(outputPath).size;
const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

console.log(`✓ Generado products-lite.json`);
console.log(`  - Productos: ${optimized.length}`);
console.log(`  - Original: ${(originalSize / 1024).toFixed(1)}KB`);
console.log(`  - Optimizado: ${(optimizedSize / 1024).toFixed(1)}KB`);
console.log(`  - Reducción: ${reduction}%`);
