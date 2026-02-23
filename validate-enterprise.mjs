import fs from 'fs';
import path from 'path';

function findHtml(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findHtml(full));
    else if (entry.name === 'index.html') results.push(full);
  }
  return results;
}

const files = findHtml('dist');
let issues = 0;
let pagesWithoutBreadcrumb = 0;
let pagesWithDuplicateBreadcrumb = 0;
let pagesWithDuplicateLocalBusiness = 0;
let pagesWithDuplicateAggregateRating = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g;
  let match;
  let bcCount = 0;
  let lbCount = 0;
  let arCount = 0;

  while ((match = regex.exec(content)) !== null) {
    const json = match[1];
    if (json.includes('"BreadcrumbList"')) bcCount++;
    if (json.includes('"LocalBusiness"')) lbCount++;
    if (json.includes('aggregateRating')) arCount++;
  }

  const rel = path.relative('dist', file);

  if (bcCount === 0) {
    console.log(`  ⚠️  NO BreadcrumbList: ${rel}`);
    pagesWithoutBreadcrumb++;
  }
  if (bcCount > 1) {
    console.log(`  ❌ DUPLICATE BreadcrumbList (${bcCount}): ${rel}`);
    pagesWithDuplicateBreadcrumb++;
    issues++;
  }
  if (lbCount > 1) {
    console.log(`  ❌ DUPLICATE LocalBusiness (${lbCount}): ${rel}`);
    pagesWithDuplicateLocalBusiness++;
    issues++;
  }
  if (arCount > 1) {
    console.log(`  ❌ DUPLICATE aggregateRating (${arCount}): ${rel}`);
    pagesWithDuplicateAggregateRating++;
    issues++;
  }
}

console.log('\n=== ENTERPRISE VALIDATION REPORT ===\n');
console.log(`Total pages scanned: ${files.length}`);
console.log(`BreadcrumbList: ${pagesWithDuplicateBreadcrumb} duplicates | ${pagesWithoutBreadcrumb} missing`);
console.log(`LocalBusiness: ${pagesWithDuplicateLocalBusiness} duplicates`);
console.log(`aggregateRating: ${pagesWithDuplicateAggregateRating} duplicates`);
console.log('');
if (issues === 0) {
  console.log('✅ PASSED: Zero duplicate schemas across ALL pages');
  console.log('✅ Single source of truth: prerender.mjs / schema-generators.mjs');
} else {
  console.log(`❌ FAILED: ${issues} issues found`);
  process.exit(1);
}
