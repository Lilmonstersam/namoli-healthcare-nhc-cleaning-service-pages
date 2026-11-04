import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const entryFile = path.join(root, 'index.html');
const stylesheetFile = path.join(root, 'frequency-section.css');
const errors = [];

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

const ndisFile = path.join(root, 'ndis-cleaning', 'index.html');
for (const requiredFile of [entryFile, stylesheetFile, ndisFile, path.join(root, 'robots.txt')]) {
  if (!(await exists(requiredFile))) {
    errors.push(`Missing required file: ${path.relative(root, requiredFile)}`);
  }
}

if (errors.length === 0) {
  const html = await readFile(entryFile, 'utf8');
  const stylesheet = await readFile(stylesheetFile, 'utf8');
  const embeddedStyles = [
    ...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi),
    ...html.matchAll(/\bstyle=["']([^"']+)["']/gi),
  ].map((match) => match[1]).join('\n');
  const references = [
    ...html.matchAll(/<(?:a|iframe|img|link|script|source)\b[^>]*?\b(?:href|src)=["']([^"']+)["'][^>]*>/gi),
    ...embeddedStyles.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi),
    ...stylesheet.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi),
  ].map((match) => match[1].trim().replaceAll('&amp;', '&'));

  const ignoredSchemes = /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i;
  const localReferences = [...new Set(references.filter((reference) => !ignoredSchemes.test(reference)))];

  for (const reference of localReferences) {
    if (reference.startsWith('/')) {
      errors.push(`Root-relative reference will break on a project Pages URL: ${reference}`);
      continue;
    }

    const cleanReference = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
    const target = path.resolve(root, cleanReference);
    if ((target !== root && !target.startsWith(`${root}${path.sep}`)) || !(await exists(target))) {
      errors.push(`Missing local reference: ${reference}`);
    }
  }

  if (!/<meta\s+name=["']robots["']\s+content=["']noindex, nofollow["']/i.test(html)) {
    errors.push('The public mockup must retain a noindex, nofollow robots meta tag.');
  }

  if (/\b(?:localhost|127\.0\.0\.1)\b/i.test(html + stylesheet)) {
    errors.push('Localhost reference found in deployable files.');
  }

  if (/\b(?:mcfx|gtm)\.js\b|googletagmanager\.com/i.test(html)) {
    errors.push('Production tracking code found in the public mockup.');
  }

  console.log(`Checked ${localReferences.length} local references.`);

  const ndisHtml = await readFile(ndisFile, 'utf8');
  const header = (page) => page.slice(page.indexOf('<header'), page.indexOf('</header> <!-- end .header -->') + '</header> <!-- end .header -->'.length);
  const footer = (page) => page.slice(page.indexOf('<footer id="footer"'));
  if (header(html).replaceAll('href="#day-surgery-videos"', 'href="index.html#day-surgery-videos"') !== header(ndisHtml)) {
    errors.push('NDIS header differs from the medical centre header. Run npm run build.');
  }
  if (footer(html) !== footer(ndisHtml)) errors.push('NDIS footer differs from the medical centre footer. Run npm run build.');
  if (!/<head>\s*<base href="\.\.\/">/.test(ndisHtml)) errors.push('NDIS page must resolve shared assets from the mockup root.');
  for (const reference of ['index.html', 'ndis-cleaning/index.html', 'index.html#day-surgery-videos']) {
    if (!ndisHtml.includes(`href="${reference}"`)) errors.push(`Missing NDIS navigation link: ${reference}`);
  }
  if (!html.includes('href="ndis-cleaning/index.html"')) errors.push('Missing medical centre navigation link to NDIS cleaning.');
  if (!html.includes('id="day-surgery-videos"')) errors.push('Missing day surgery video section.');
  for (const id of ['bOsTSZfxcgw', 'yrBbjA_jbWM', 'U6jd7vzJnhs']) {
    if (!html.includes(`youtube-nocookie.com/embed/${id}`)) errors.push(`Missing day surgery video: ${id}`);
  }
  const ndisLocalReferences = [...ndisHtml.matchAll(/<(?:a|img|link|script)\b[^>]*?\b(?:href|src)=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1].replaceAll('&amp;', '&')).filter((reference) => !ignoredSchemes.test(reference));
  for (const reference of ndisLocalReferences) {
    const target = path.resolve(root, decodeURIComponent(reference.split(/[?#]/, 1)[0]));
    if (!(await exists(target))) errors.push(`Missing NDIS local reference: ${reference}`);
  }
  if (!/name="robots" content="noindex, nofollow"/i.test(ndisHtml)) errors.push('NDIS mockup must remain noindex.');
  console.log(`Checked ${ndisLocalReferences.length} NDIS local references.`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Static site validation passed.');
