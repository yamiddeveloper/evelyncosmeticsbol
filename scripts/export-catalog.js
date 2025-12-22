/**
 * Script para exportar catálogo de productos para el cliente
 * Genera una carpeta con: productos.json + imágenes + README
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas
const PRODUCTS_SOURCE = path.join(__dirname, '..', 'src', 'data', 'products.json');
const IMAGES_SOURCE = path.join(__dirname, '..', 'public', 'images', 'products');
const EXPORT_DIR = path.join(__dirname, '..', 'export', 'catalogo-evelyn');
const EXPORT_IMAGES_DIR = path.join(EXPORT_DIR, 'images');

function exportCatalog() {
  console.log('📦 Exportando catálogo para el cliente...\n');

  // 1. Crear carpetas de exportación
  if (fs.existsSync(EXPORT_DIR)) {
    fs.rmSync(EXPORT_DIR, { recursive: true });
  }
  fs.mkdirSync(EXPORT_IMAGES_DIR, { recursive: true });
  console.log('📁 Carpeta de exportación creada:', EXPORT_DIR);

  // 2. Leer productos
  if (!fs.existsSync(PRODUCTS_SOURCE)) {
    console.error('❌ No se encontró products.json');
    return;
  }
  const products = JSON.parse(fs.readFileSync(PRODUCTS_SOURCE, 'utf-8'));
  console.log(`📋 ${products.length} productos encontrados`);

  // 3. Copiar imágenes y actualizar rutas
  let imagesCopied = 0;
  let imagesMissing = 0;

  const exportProducts = products.map(product => {
    const newProduct = { ...product };
    
    // Si la imagen es una ruta local
    if (product.image && product.image.startsWith('/images/products/')) {
      const imageName = path.basename(product.image);
      const sourceImage = path.join(IMAGES_SOURCE, imageName);
      const destImage = path.join(EXPORT_IMAGES_DIR, imageName);
      
      if (fs.existsSync(sourceImage)) {
        fs.copyFileSync(sourceImage, destImage);
        newProduct.image = `./images/${imageName}`;
        imagesCopied++;
      } else {
        console.log(`   ⚠️ Imagen no encontrada: ${imageName}`);
        imagesMissing++;
      }
    } else if (product.image && product.image.startsWith('http')) {
      // Mantener URL externa
      newProduct.image = product.image;
    }
    
    // Eliminar originalImage si existe (no necesario para el cliente)
    delete newProduct.originalImage;
    
    return newProduct;
  });

  // 4. Guardar JSON con rutas relativas
  const jsonPath = path.join(EXPORT_DIR, 'productos.json');
  fs.writeFileSync(jsonPath, JSON.stringify(exportProducts, null, 2), 'utf-8');
  console.log(`\n💾 productos.json guardado con rutas relativas`);

  // 5. Crear README
  const readme = `# Catálogo de Productos - Evelyn Cosmetics

## Contenido

- \`productos.json\` - Archivo con todos los productos
- \`images/\` - Carpeta con las imágenes de los productos

## Estructura del JSON

Cada producto tiene los siguientes campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | number | Identificador único del producto |
| name | string | Nombre completo del producto |
| brand | string | Marca del producto |
| price | number | Precio en Bolivianos (Bs.) |
| priceString | string | Precio formateado (ej: "Bs. 170.00") |
| oldPrice | string/null | Precio anterior si está en oferta |
| image | string | Ruta relativa a la imagen (./images/...) |
| description | string | Descripción del producto |
| category | string | Categoría del producto |
| featured | boolean | Si es producto destacado |
| bestSeller | boolean | Si es más vendido |
| onSale | boolean | Si está en oferta |
| stock | boolean | Si hay stock disponible |

## Ejemplo de uso

### JavaScript
\`\`\`javascript
const productos = require('./productos.json');

productos.forEach(producto => {
  console.log(producto.name, '-', producto.priceString);
});
\`\`\`

### Python
\`\`\`python
import json

with open('productos.json', 'r', encoding='utf-8') as f:
    productos = json.load(f)

for producto in productos:
    print(f"{producto['name']} - {producto['priceString']}")
\`\`\`

## Notas

- Las imágenes están en formato JPG
- Las rutas de imágenes son relativas a esta carpeta
- Total de productos: ${exportProducts.length}
- Generado el: ${new Date().toLocaleDateString('es-BO')}
`;

  fs.writeFileSync(path.join(EXPORT_DIR, 'README.md'), readme, 'utf-8');
  console.log('📄 README.md creado');

  // 6. Resumen
  console.log('\n' + '='.repeat(50));
  console.log('✅ Exportación completada!\n');
  console.log(`   📋 Productos: ${exportProducts.length}`);
  console.log(`   🖼️  Imágenes copiadas: ${imagesCopied}`);
  console.log(`   ⚠️  Imágenes faltantes: ${imagesMissing}`);
  console.log(`\n📁 Carpeta de exportación: export/catalogo-evelyn/`);
  console.log('\n💡 Para crear el ZIP:');
  console.log('   cd export && zip -r catalogo-evelyn.zip catalogo-evelyn/');
}

exportCatalog();
