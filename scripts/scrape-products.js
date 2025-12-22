/**
 * Web Scraper para Evelyn Cosmetics - Kyte Catalog
 * Extrae: imagen, nombre, precio, marca y descripción de productos
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_URL = 'https://evelyn-cosmetics.catalog.kyte.site';

// Función para hacer requests HTTP
function fetchPage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Función para extraer productos del HTML
function extractProducts(html) {
    const products = [];
    
    // Buscar productos en el HTML usando regex (sin dependencias externas)
    // Patrón para encontrar títulos de productos
    const titleRegex = /class="product_title[^"]*"[^>]*>([^<]+)</g;
    const priceRegex = /BOB\s*([\d,.]+)/g;
    const oldPriceRegex = /class="product_old-price[^"]*"[^>]*>([\d,.]+)\s*BOB/gi;
    
    const imageRegex = /src="(https:\/\/[^"]*kyte[^"]*\.(jpg|jpeg|png|webp)[^"]*)"/gi;
    const descriptionRegex = /class="[^"]*description[^"]*"[^>]*>([^<]+)</gi;
    
    // Extraer todos los matches
    let titleMatch;
    const titles = [];
    while ((titleMatch = titleRegex.exec(html)) !== null) {
        titles.push(titleMatch[1].trim());
    }
    
    let priceMatch;
    const prices = [];
    while ((priceMatch = priceRegex.exec(html)) !== null) {
        prices.push(priceMatch[1].trim());
    }
    
    let oldPriceMatch;
    const oldPrices = [];
    while ((oldPriceMatch = oldPriceRegex.exec(html)) !== null) {
        oldPrices.push(oldPriceMatch[1].trim());
    }
    
    let imageMatch;
    const images = [];
    while ((imageMatch = imageRegex.exec(html)) !== null) {
        if (!images.includes(imageMatch[1])) {
            images.push(imageMatch[1]);
        }
    }
    
    console.log(`Encontrados: ${titles.length} títulos, ${prices.length} precios, ${oldPrices.length} precios anteriores, ${images.length} imágenes`);
    
    return { titles, prices, oldPrices, images };
}

// Función para extraer marca del nombre del producto
function extractBrand(productName) {
    const brands = [
        'Avene', 'Avène', 'La Roche Posay', 'La Roche-Posay', 
        'Bioderma', 'Cerave', 'CeraVe', 'Cetaphil', 
        'Eucerin', 'Isdin', 'ISDIN', 'Neutrogena', 
        'Loreal', "L'Oreal", 'Vichy', 'Nivea',
        'Garnier', 'Dove', 'Pond\'s', 'Olay'
    ];
    
    for (const brand of brands) {
        if (productName.toLowerCase().includes(brand.toLowerCase())) {
            return brand;
        }
    }
    return 'Sin marca';
}

async function scrapeKyteCatalog() {
    console.log('🔍 Iniciando scraping de:', CATALOG_URL);
    console.log('⏳ Obteniendo página principal...\n');
    
    try {
        const html = await fetchPage(CATALOG_URL);
        
        // Guardar HTML para debug
        fs.writeFileSync(
            path.join(__dirname, 'debug-page.html'), 
            html, 
            'utf-8'
        );
        console.log('📄 HTML guardado en debug-page.html para análisis\n');
        
        // Intentar encontrar datos JSON embebidos (común en SPAs)
        const jsonDataMatch = html.match(/__NEXT_DATA__[^>]*>([^<]+)</);
        if (jsonDataMatch) {
            console.log('✅ Encontrados datos JSON embebidos (Next.js)');
            try {
                const jsonData = JSON.parse(jsonDataMatch[1]);
                fs.writeFileSync(
                    path.join(__dirname, 'extracted-data.json'),
                    JSON.stringify(jsonData, null, 2),
                    'utf-8'
                );
                console.log('📦 Datos JSON guardados en extracted-data.json');
            } catch (e) {
                console.log('⚠️ No se pudo parsear JSON embebido');
            }
        }
        
        // Buscar cualquier JSON con productos
        const productJsonMatch = html.match(/"products"\s*:\s*(\[[^\]]+\])/);
        if (productJsonMatch) {
            console.log('✅ Encontrado array de productos en JSON');
        }
        
        // Extraer con regex
        const extracted = extractProducts(html);
        
        // Buscar patrones específicos de Kyte
        console.log('\n🔎 Buscando patrones específicos de Kyte...');
        
        // Kyte usa clases específicas
        const kyteProductPattern = /product_title[^"]*"[^>]*>([^<]+)/g;
        let match;
        const kyteProducts = [];
        while ((match = kyteProductPattern.exec(html)) !== null) {
            kyteProducts.push(match[1]);
        }
        
        if (kyteProducts.length > 0) {
            console.log(`✅ Encontrados ${kyteProducts.length} productos con patrón Kyte`);
            kyteProducts.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
        }
        
        // Buscar en scripts
        const scriptDataMatch = html.match(/<script[^>]*>([^<]*products[^<]*)<\/script>/gi);
        if (scriptDataMatch) {
            console.log(`\n📜 Encontrados ${scriptDataMatch.length} scripts con "products"`);
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 RESUMEN DEL SCRAPING');
        console.log('='.repeat(50));
        console.log(`Títulos encontrados: ${extracted.titles.length}`);
        console.log(`Precios encontrados: ${extracted.prices.length}`);
        console.log(`Precios anteriores encontrados: ${extracted.oldPrices.length}`);
        console.log(`Imágenes encontradas: ${extracted.images.length}`);
        
        if (extracted.titles.length === 0) {
            console.log('\n⚠️ NOTA: El sitio parece ser una SPA (Single Page Application).');
            console.log('Los productos se cargan dinámicamente con JavaScript.');
            console.log('Se necesita Puppeteer o Playwright para scraping completo.');
            console.log('\n💡 Ejecuta: npm install puppeteer');
            console.log('Luego usa el script scrape-products-puppeteer.js');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Ejecutar
scrapeKyteCatalog();
