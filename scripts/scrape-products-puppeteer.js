/**
 * Web Scraper con Puppeteer para Evelyn Cosmetics - Kyte Catalog
 * Extrae: imagen, nombre, precio, precio de oferta, marca y descripción de productos
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta donde se guardarán las imágenes
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Crear carpeta de imágenes si no existe
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`📁 Carpeta de imágenes creada: ${IMAGES_DIR}`);
}

// Función para descargar una imagen
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    if (!url || url.trim() === '') {
      resolve(null);
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    const filePath = path.join(IMAGES_DIR, filename);

    // Si ya existe, no descargar de nuevo
    if (fs.existsSync(filePath)) {
      console.log(`   ⏭️  Imagen ya existe: ${filename}`);
      resolve(`/images/products/${filename}`);
      return;
    }

    const file = fs.createWriteStream(filePath);
    
    protocol.get(url, (response) => {
      // Seguir redirecciones
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filename)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        fs.unlink(filePath, () => {});
        resolve(null);
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`   ✅ Descargada: ${filename}`);
        resolve(`/images/products/${filename}`);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      console.log(`   ❌ Error descargando ${filename}: ${err.message}`);
      resolve(null);
    });
  });
}

// Función para generar nombre de archivo seguro
function sanitizeFilename(name, id) {
  const safeName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
  return `${id}-${safeName}.jpg`;
}

const CATALOG_URL = 'https://evelyn-cosmetics.catalog.kyte.site';

// Marcas conocidas para extraer
const KNOWN_BRANDS = [
  'Avene', 'Avène', 'La Roche Posay', 'La Roche-Posay',
  'Bioderma', 'Cerave', 'CeraVe', 'Cetaphil',
  'Eucerin', 'Isdin', 'ISDIN', 'Neutrogena',
  'Loreal', "L'Oreal", 'Vichy', 'Nivea',
  'Garnier', 'Dove', 'Pond\'s', 'Olay', 'Uriage',
  'SVR', 'Filorga', 'Caudalie', 'Nuxe', 'Rilastil'
];

function extractBrand(productName) {
  for (const brand of KNOWN_BRANDS) {
    if (productName.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return 'Sin marca';
}

async function scrapeAllProducts() {
  console.log('🚀 Iniciando Puppeteer...\n');
  const browser = await puppeteer.launch({
    headless: true, // o false si quieres ver cómo trabaja
    executablePath: '/usr/bin/google-chrome', // Esta es la ruta por defecto en Linux
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  // Configurar viewport
  await page.setViewport({ width: 1920, height: 1080 });
  // User agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  console.log(`📍 Navegando a: ${CATALOG_URL}`);
  await page.goto(CATALOG_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  // Esperar a que carguen los productos
  console.log('⏳ Esperando que carguen los productos...');
  await page.waitForSelector('[class*="product"]', { timeout: 30000 }).catch(() => {
    console.log('⚠️ No se encontró selector de productos, continuando...');
  });
  // Esperar un poco más para asegurar carga completa
  await new Promise(r => setTimeout(r, 3000));
  // Tomar screenshot para debug
  await page.screenshot({ path: path.join(__dirname, 'screenshot-catalog.png'), fullPage: true });
  console.log('📸 Screenshot guardado en screenshot-catalog.png\n');
  // Obtener todas las categorías del sidebar
  const categories = await page.evaluate(() => {
    const categoryElements = document.querySelectorAll('[class*="category"], [class*="sidebar"] a, [class*="menu"] a');
    const cats = [];
    categoryElements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length > 0 && text.length < 50) {
        cats.push(text);
      }
    });
    return [...new Set(cats)];
  });
  console.log('📂 Categorías encontradas:', categories);
  // Función para scroll y cargar todos los productos
  async function scrollToLoadAll() {
    let previousHeight = 0;
    let currentHeight = await page.evaluate(() => document.body.scrollHeight);
    while (previousHeight !== currentHeight) {
      previousHeight = currentHeight;
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 1500));
      currentHeight = await page.evaluate(() => document.body.scrollHeight);
    }
  }
  console.log('📜 Haciendo scroll para cargar todos los productos...');
  await scrollToLoadAll();
  // Extraer productos
  console.log('\n🔍 Extrayendo productos...\n');
  const products = await page.evaluate(() => {
    const productList = [];
    // Buscar contenedores de productos (basado en las clases vistas en el screenshot)
    const productContainers = document.querySelectorAll('[class*="product_list"], [class*="product-item"], [class*="catalog-product"], div[class*="product"]');
    // Si no encuentra con esas clases, buscar de forma más genérica
    let containers = productContainers.length > 0 ? productContainers : document.querySelectorAll('[class*="main_column"]');
    // Buscar todos los elementos que parecen productos
    const allDivs = document.querySelectorAll('div');
    allDivs.forEach(div => {
      // Buscar título del producto
      const titleEl = div.querySelector('[class*="product_title"], [class*="title"], h4, h3, h2');
      const priceEl = div.querySelector('[class*="price"]:not([class*="old"])');
      const oldPriceEl = div.querySelector('[class*="old-price"], [class*="old_price"], [class*="product_old-price"]');
      const imageEl = div.querySelector('img');
      const descEl = div.querySelector('[class*="description"], p');
      if (titleEl && priceEl) {
        const title = titleEl.textContent?.trim();
        const priceText = priceEl.textContent?.trim();
        const oldPriceText = oldPriceEl?.textContent?.trim() || null;
        const image = imageEl?.src || '';
        const description = descEl?.textContent?.trim() || '';
        // Evitar duplicados
        if (title && priceText && !productList.some(p => p.name === title)) {
          productList.push({
            name: title,
            price: priceText,
            oldPrice: oldPriceText,
            image: image,
            description: description.substring(0, 500)
          });
        }
      }
    });
    return productList;
  });
  // Agregar marca a cada producto
  const productsWithBrand = products.map(p => ({
    ...p,
    brand: extractBrand(p.name)
  }));
  console.log(`✅ Encontrados ${productsWithBrand.length} productos\n`);
  // Si no encontró productos, intentar método alternativo
  if (productsWithBrand.length === 0) {
    console.log('🔄 Intentando método alternativo...\n');
    // Obtener todo el HTML y buscar patrones
    const html = await page.content();
    // Guardar HTML para análisis
    fs.writeFileSync(path.join(__dirname, 'page-content.html'), html, 'utf-8');
    console.log('📄 HTML guardado en page-content.html');
    // Buscar en el HTML con regex
    const titleMatches = html.match(/Avene[^<]+|La Roche[^<]+|Bioderma[^<]+|Cerave[^<]+|Cetaphil[^<]+|Eucerin[^<]+|Isdin[^<]+|Neutrogena[^<]+/gi) || [];
    const priceMatches = html.match(/BOB\s*[\d,.]+/gi) || [];
    const oldPriceMatches = html.match(/class="product_old-price[^"]*"[^>]*>([\d,.]+)\s*BOB/gi) || [];
    const imageMatches = html.match(/https:\/\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi) || [];
    console.log(`\n📊 Método alternativo encontró:`);
    console.log(` - ${titleMatches.length} posibles títulos`);
    console.log(` - ${priceMatches.length} precios`);
    console.log(` - ${oldPriceMatches.length} precios anteriores`);
    console.log(` - ${imageMatches.length} imágenes`);
    // Crear productos del método alternativo
    const uniqueTitles = [...new Set(titleMatches)].slice(0, 50);
    const uniquePrices = [...new Set(priceMatches)];
    const uniqueOldPrices = [...new Set(oldPriceMatches)];
    const uniqueImages = [...new Set(imageMatches)].filter(img =>
      img.includes('kyte') || img.includes('catalog') || img.includes('product')
    );
    for (let i = 0; i < uniqueTitles.length; i++) {
      productsWithBrand.push({
        name: uniqueTitles[i],
        brand: extractBrand(uniqueTitles[i]),
        price: uniquePrices[i] || 'Precio no disponible',
        oldPrice: uniqueOldPrices[i] || null,
        image: uniqueImages[i] || '',
        description: ''
      });
    }
  }
  // Descargar imágenes
  console.log('\n📥 Descargando imágenes...');
  console.log('='.repeat(60));
  
  const productsWithLocalImages = [];
  
  for (let i = 0; i < productsWithBrand.length; i++) {
    const product = productsWithBrand[i];
    const productId = i + 1;
    const filename = sanitizeFilename(product.name, productId);
    
    console.log(`\n[${productId}/${productsWithBrand.length}] ${product.name.substring(0, 40)}...`);
    
    let localImagePath = null;
    if (product.image) {
      localImagePath = await downloadImage(product.image, filename);
    }
    
    productsWithLocalImages.push({
      ...product,
      id: productId,
      originalImage: product.image,
      image: localImagePath || product.image
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Imágenes descargadas en: ${IMAGES_DIR}`);

  // Guardar resultados
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'products-scraped.json');
  fs.writeFileSync(outputPath, JSON.stringify(productsWithLocalImages, null, 2), 'utf-8');
  console.log(`\n💾 Productos guardados en: src/data/products-scraped.json`);
  // También guardar en scripts para referencia
  fs.writeFileSync(
    path.join(__dirname, 'products-scraped.json'),
    JSON.stringify(productsWithLocalImages, null, 2),
    'utf-8'
  );
  // Mostrar algunos productos de ejemplo
  console.log('\n📦 Primeros 5 productos:');
  console.log('='.repeat(60));
  productsWithLocalImages.slice(0, 5).forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.name}`);
    console.log(`   Marca: ${p.brand}`);
    console.log(`   Precio: ${p.price}`);
    console.log(`   Precio anterior: ${p.oldPrice || 'N/A'}`);
    console.log(`   Imagen local: ${p.image}`);
    console.log(`   Imagen original: ${p.originalImage ? p.originalImage.substring(0, 50) + '...' : 'No disponible'}`);
  });
  await browser.close();
  console.log('\n✅ Scraping completado!');
  return productsWithLocalImages;
}

// Ejecutar
scrapeAllProducts().catch(console.error);