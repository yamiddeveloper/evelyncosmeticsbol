/**
 * Script para descargar imágenes de products.json existente
 * Descarga las imágenes y actualiza las rutas en el JSON
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas
const PRODUCTS_PATH = path.join(__dirname, '..', 'src', 'data', 'products.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Crear carpeta de imágenes si no existe
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`📁 Carpeta de imágenes creada: ${IMAGES_DIR}`);
}

// Función para descargar una imagen
function downloadImage(url, filename) {
  return new Promise((resolve) => {
    if (!url || url.trim() === '' || url.startsWith('/images/')) {
      resolve(null);
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    const filePath = path.join(IMAGES_DIR, filename);

    // Si ya existe, no descargar de nuevo
    if (fs.existsSync(filePath)) {
      console.log(`   ⏭️  Ya existe: ${filename}`);
      resolve(`/images/products/${filename}`);
      return;
    }

    const file = fs.createWriteStream(filePath);
    
    protocol.get(url, (response) => {
      // Seguir redirecciones
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlink(filePath, () => {});
        downloadImage(response.headers.location, filename)
          .then(resolve);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(filePath, () => {});
        console.log(`   ⚠️  Error HTTP ${response.statusCode}: ${filename}`);
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
      file.close();
      fs.unlink(filePath, () => {});
      console.log(`   ❌ Error: ${filename} - ${err.message}`);
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

async function downloadAllImages() {
  console.log('📥 Descargando imágenes de products.json...\n');
  console.log('='.repeat(60));

  // Leer productos
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8'));
  console.log(`📦 Total de productos: ${products.length}\n`);

  const updatedProducts = [];
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    const filename = sanitizeFilename(product.name, product.id);
    
    console.log(`[${product.id}/${products.length}] ${product.name.substring(0, 45)}...`);
    
    const localPath = await downloadImage(product.image, filename);
    
    if (localPath) {
      if (localPath === product.image) {
        skipped++;
      } else {
        downloaded++;
      }
      updatedProducts.push({
        ...product,
        originalImage: product.image,
        image: localPath
      });
    } else {
      failed++;
      updatedProducts.push({
        ...product,
        originalImage: product.image
      });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Resumen:');
  console.log(`   ✅ Descargadas: ${downloaded}`);
  console.log(`   ⏭️  Ya existían: ${skipped}`);
  console.log(`   ❌ Fallidas: ${failed}`);
  console.log(`\n📁 Imágenes guardadas en: ${IMAGES_DIR}`);

  // Guardar productos actualizados
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'products-local-images.json');
  fs.writeFileSync(outputPath, JSON.stringify(updatedProducts, null, 2), 'utf-8');
  console.log(`\n💾 Productos con rutas locales guardados en: src/data/products-local-images.json`);

  // Preguntar si quiere reemplazar el original
  console.log('\n💡 Para usar las imágenes locales, renombra products-local-images.json a products.json');
}

downloadAllImages().catch(console.error);
