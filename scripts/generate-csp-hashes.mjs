#!/usr/bin/env node
/**
 * Calculate SHA-256 hash for inline scripts in index.html
 * Used for Content Security Policy (CSP) hash-based script authorization
 * 
 * Run this script when you modify the inline JSON-LD script in index.html
 * Then update the hash in vercel.json under Content-Security-Policy header
 */

import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexPath = join(__dirname, '..', 'index.html');
const indexContent = readFileSync(indexPath, 'utf8');

// Extract all inline scripts
const scriptRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
let match;
let scriptNumber = 1;

console.log('\n📊 CSP Script Hashes for index.html\n');
console.log('Copy these hashes to vercel.json > Content-Security-Policy > script-src\n');

while ((match = scriptRegex.exec(indexContent)) !== null) {
  const scriptContent = match[1].trim();
  const hash = createHash('sha256').update(scriptContent).digest('base64');
  
  console.log(`Script ${scriptNumber}:`);
  console.log(`  Content preview: ${scriptContent.substring(0, 50)}...`);
  console.log(`  Hash: 'sha256-${hash}'`);
  console.log('');
  
  scriptNumber++;
}

console.log('✅ Total inline scripts found:', scriptNumber - 1);
console.log('\n💡 Update vercel.json with:');
console.log('   "script-src": "\'self\' \'sha256-<hash>\' https://..."');
console.log('');
