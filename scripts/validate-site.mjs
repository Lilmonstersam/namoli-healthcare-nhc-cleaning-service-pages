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

for (const requiredFile of [entryFile, stylesheetFile, path.join(root, 'robots.txt')]) {
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
    if (!target.startsWith(`${root}${path.sep}`) || !(await exists(target))) {
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
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Static site validation passed.');
