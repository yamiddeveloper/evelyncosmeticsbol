import puppeteer from 'puppeteer';
import fs from 'fs';

const docsToDownload = [
  { name: 'HTML_Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference' },
  { name: 'CSS_Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference' },
  { name: 'JS_Standard_Objects', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects' },
  { name: 'JS_Operators', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators' }
];

async function downloadDocs() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();

  for (const doc of docsToDownload) {
    console.log(`Iniciando descarga de: ${doc.name}...`);
    try {
      await page.goto(doc.url, { waitUntil: 'networkidle2', timeout: 60000 });
      
      // Eliminamos elementos que estorban en el PDF (headers, sidebars, footers)
      await page.evaluate(() => {
        const selectors = ['header', 'footer', '.top-navigation', '.main-sidebar', '.feedback-container'];
        selectors.forEach(s => {
          const el = document.querySelector(s);
          if (el) el.style.display = 'none';
        });
      });

      await page.pdf({
        path: `${doc.name}.pdf`,
        format: 'A4',
        printBackground: true,
        margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' }
      });
      console.log(`✅ ${doc.name}.pdf guardado.`);
    } catch (err) {
      console.error(`❌ Error en ${doc.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('Proceso finalizado. Ya puedes mover los archivos a tu celular.');
}

downloadDocs();