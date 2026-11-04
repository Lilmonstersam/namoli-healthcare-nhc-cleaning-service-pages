import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const medical = await readFile(path.join(root, 'index.html'), 'utf8');
const source = await readFile(path.join(root, 'ndis-cleaning/content.html'), 'utf8');

const headerEnd = medical.indexOf('</header> <!-- end .header -->') + '</header> <!-- end .header -->'.length;
const footerStart = medical.indexOf('<footer id="footer"');
const mainStart = source.indexOf('<main>');
const mainEnd = source.indexOf('</main>', mainStart) + '</main>'.length;
if (headerEnd < 50 || footerStart < headerEnd || mainStart < 0 || mainEnd < mainStart) {
  throw new Error('Could not find the shared shell or NDIS main content.');
}

let head = medical.slice(0, headerEnd);
head = head.replace('<head>', '<head>\n<base href="../">');
head = head.replace(/<title>[^<]*<\/title>/, '<title>NDIS Cleaning Services for Respite Care Centres | Namoli Healthcare</title>');
head = head.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Specialist NDIS cleaning for respite care centres in Brisbane and Melbourne. Screened teams, ATP testing and audit-ready reporting.">');
head = head.replace(/<link rel="canonical"[^>]*>/, '');
head = head.replace(/<script type="application\/ld\+json" class="yoast-schema-graph">[\s\S]*?<\/script>/, '');
head = head.replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="NDIS Cleaning Services for Respite Care Centres | Namoli Healthcare">');
head = head.replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="Specialist NDIS cleaning for respite care centres in Brisbane and Melbourne.">');
head = head.replace(/<meta property="og:url"[^>]*>/, '');
head = head.replace('</head>', `<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config = { corePlugins: { preflight: false } };</script>
<link rel="stylesheet" href="ndis-cleaning/page.css">
<script defer src="ndis-cleaning/page.js"></script>
</head>`);
head = head.replace('page-medical-centre-cleaning', 'page-ndis-cleaning');
head = head.replaceAll('href="#day-surgery-videos"', 'href="index.html#day-surgery-videos"');

let main = source.slice(mainStart, mainEnd).replace('<main>', '<main class="ndis-page">');
main = main.replaceAll('src="images/', 'src="ndis-cleaning/images/');
main = main.replace('grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto');

const footer = medical.slice(footerStart);
const output = `${head}\n${main}\n${footer}`;
await writeFile(path.join(root, 'ndis-cleaning/index.html'), output);
console.log('Built NDIS page with the medical centre header and footer.');
