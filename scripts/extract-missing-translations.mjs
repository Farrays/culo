// Script to extract missing translations from es.ts and show them
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read missing keys from file
const missingKeysPath = '/tmp/missing_keys.txt';
const missingKeys = fs.readFileSync(missingKeysPath, 'utf-8')
  .split('\n')
  .filter(k => k.trim());

// Read es.ts file
const esPath = path.join(__dirname, '..', 'i18n', 'locales', 'es.ts');
const esContent = fs.readFileSync(esPath, 'utf-8');

// Function to extract value for a key
function extractValue(content, key) {
  // Try to find the key and its value
  const patterns = [
    // Simple string: key: 'value',
    new RegExp(`^\\s*${key}:\\s*['"\`]([^'"\`]*?)['"\`]\\s*,?\\s*$`, 'm'),
    // Multiline string with template literal
    new RegExp(`^\\s*${key}:\\s*\`([\\s\\S]*?)\`\\s*,?\\s*$`, 'm'),
    // String spanning multiple lines with concatenation
    new RegExp(`^\\s*${key}:\\s*$`, 'm'),
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Try a more aggressive search
  const keyIndex = content.indexOf(`  ${key}:`);
  if (keyIndex !== -1) {
    const lineStart = content.lastIndexOf('\n', keyIndex) + 1;
    let lineEnd = content.indexOf('\n', keyIndex);
    let line = content.substring(keyIndex, lineEnd);

    // Check if it's a simple string
    const simpleMatch = line.match(/:\s*['"`](.+?)['"`]\s*,?\s*$/);
    if (simpleMatch) {
      return simpleMatch[1];
    }

    // Check if it's a multiline template literal
    if (line.includes('`')) {
      const start = content.indexOf('`', keyIndex);
      const end = content.indexOf('`', start + 1);
      if (end !== -1) {
        return content.substring(start + 1, end).trim();
      }
    }
  }

  return null;
}

// Extract values for all missing keys
const results = {};
let found = 0;
let notFound = 0;

for (const key of missingKeys) {
  const value = extractValue(esContent, key);
  if (value) {
    results[key] = value;
    found++;
  } else {
    // Try to find it with a regex that captures the full value
    const regex = new RegExp(`\\s${key}:\\s*([\\s\\S]*?)(?=\\n\\s*[a-zA-Z_][a-zA-Z0-9_]*:|\\n\\};)`, 'g');
    const match = regex.exec(esContent);
    if (match) {
      let val = match[1].trim();
      // Clean up the value
      if (val.startsWith("'") || val.startsWith('"') || val.startsWith('`')) {
        val = val.slice(1);
      }
      if (val.endsWith("',") || val.endsWith('",') || val.endsWith("`,")) {
        val = val.slice(0, -2);
      } else if (val.endsWith("'") || val.endsWith('"') || val.endsWith('`') || val.endsWith(',')) {
        val = val.slice(0, -1);
      }
      results[key] = val.trim();
      found++;
    } else {
      console.error(`Not found: ${key}`);
      notFound++;
    }
  }
}

console.log(`\nFound: ${found}, Not found: ${notFound}`);
console.log('\n--- Results (JSON) ---\n');
console.log(JSON.stringify(results, null, 2));
