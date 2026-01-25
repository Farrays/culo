#!/bin/bash
# Migrate ALL components from useI18n to useTranslation

echo "🚀 Starting mass migration..."

# Find all files using useI18n
FILES=$(grep -l "from.*useI18n" components/**/*.tsx components/*.tsx 2>/dev/null)

TOTAL=0
SUCCESS=0

for file in $FILES; do
  TOTAL=$((TOTAL + 1))
  echo "[$TOTAL] Migrating: $file"

  if node scripts/migrate-to-i18next.mjs "$file" > /dev/null 2>&1; then
    SUCCESS=$((SUCCESS + 1))
    echo "  ✅ Success"
  else
    echo "  ⚠️  Skipped (already migrated or error)"
  fi
done

echo ""
echo "📊 Migration Summary:"
echo "   Total files processed: $TOTAL"
echo "   Successfully migrated: $SUCCESS"
echo ""
echo "✅ Mass migration complete!"
echo "📝 Next: Review files and add appropriate namespaces"
