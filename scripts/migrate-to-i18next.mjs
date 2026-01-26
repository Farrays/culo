#!/usr/bin/env node
/**
 * Automated Component Migration Script: useI18n → useTranslation
 *
 * This script automatically migrates components from the legacy useI18n hook
 * to the native i18next useTranslation hook.
 *
 * Usage:
 *   node scripts/migrate-to-i18next.mjs <component-path>
 *
 * Example:
 *   node scripts/migrate-to-i18next.mjs components/Header.tsx
 */

import fs from 'fs';
import path from 'path';

const filePath = process.argv[2];

if (!filePath) {
  console.error('❌ Error: Please provide a component file path');
  console.error('Usage: node scripts/migrate-to-i18next.mjs <component-path>');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`❌ Error: File not found: ${filePath}`);
  process.exit(1);
}

console.log(`\n🔄 Migrating: ${filePath}`);

// Read file
let content = fs.readFileSync(filePath, 'utf-8');
const originalContent = content;

// Track changes
let changes = [];

// 1. Replace import statement
if (content.includes("from '../hooks/useI18n'") || content.includes('from "../hooks/useI18n"')) {
  content = content.replace(
    /import \{ useI18n \} from ['"]\.\.\/hooks\/useI18n['"]/g,
    "import { useTranslation } from 'react-i18next'"
  );
  changes.push('✓ Updated import statement');
}

if (content.includes("from '../../hooks/useI18n'") || content.includes('from "../../hooks/useI18n"')) {
  content = content.replace(
    /import \{ useI18n \} from ['"]\.\.\/\.\.\/hooks\/useI18n['"]/g,
    "import { useTranslation } from 'react-i18next'"
  );
  changes.push('✓ Updated import statement (nested)');
}

// 2. Replace hook usage - simple case
content = content.replace(
  /const \{ t, locale \} = useI18n\(\);/g,
  "const { t, i18n } = useTranslation(['common']);\n  const locale = i18n.language;"
);

content = content.replace(
  /const \{ locale, t \} = useI18n\(\);/g,
  "const { t, i18n } = useTranslation(['common']);\n  const locale = i18n.language;"
);

// 3. Replace with setLocale
content = content.replace(
  /const \{ t, locale, setLocale \} = useI18n\(\);/g,
  "const { t, i18n } = useTranslation(['common']);\n  const locale = i18n.language;"
);

// 4. Replace setLocale calls with i18n.changeLanguage
content = content.replace(/setLocale\(/g, 'i18n.changeLanguage(');

if (content !== originalContent) {
  // Write back
  fs.writeFileSync(filePath, content, 'utf-8');

  console.log('✅ Migration successful!');
  changes.forEach(change => console.log(`   ${change}`));
  console.log(`\n📝 Note: Review the file and add appropriate namespaces to useTranslation(['common', ...])`);
  console.log(`   Common namespaces: booking, schedule, calendar, home, classes, blog, faq, about, contact, pages\n`);
} else {
  console.log('ℹ️  No changes needed - file may already be migrated\n');
}
