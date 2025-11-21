#!/bin/bash
# SECURITY VERIFICATION CHECKLIST
# Run this to verify all security fixes are applied

echo "🔐 FarRays Center - Security Verification Script"
echo "=================================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Check 1: XSS Vulnerability Fixed
echo "📋 Check 1: XSS Vulnerability - dangerouslySetInnerHTML"
if ! grep -q "dangerouslySetInnerHTML" components/CulturalHistorySection.tsx; then
  echo -e "${GREEN}✅ PASS${NC} - No dangerouslySetInnerHTML found"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}❌ FAIL${NC} - dangerouslySetInnerHTML still present!"
  grep -n "dangerouslySetInnerHTML" components/CulturalHistorySection.tsx
  ((CHECKS_FAILED++))
fi
echo ""

# Check 2: .env.local in .gitignore
echo "📋 Check 2: Environment File Protection"
if grep -q "\.env\.local" .gitignore; then
  echo -e "${GREEN}✅ PASS${NC} - .env.local protected in .gitignore"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}❌ FAIL${NC} - .env.local NOT in .gitignore"
  echo "   Add this to .gitignore:"
  echo "   .env.local"
  echo "   .env.*.local"
  ((CHECKS_FAILED++))
fi
echo ""

# Check 3: No secrets in code
echo "📋 Check 3: Secrets Exposure Scan"
SECRETS_FOUND=$(grep -r "GEMINI_API_KEY\|password =\|secret =\|token =" components/ hooks/ i18n/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "test\|TEST" | wc -l)
if [ $SECRETS_FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ PASS${NC} - No hardcoded secrets found in code"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING${NC} - Potential secrets found:"
  grep -r "GEMINI_API_KEY\|password =\|secret =\|token =" components/ hooks/ i18n/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "test\|TEST"
  ((CHECKS_FAILED++))
fi
echo ""

# Check 4: Safe paragraph rendering
echo "📋 Check 4: CulturalHistorySection - Safe Rendering"
if grep -q "split.*map.*paragraph" components/CulturalHistorySection.tsx; then
  echo -e "${GREEN}✅ PASS${NC} - Using safe .split().map() rendering"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}❌ FAIL${NC} - Safe rendering not found"
  echo "   Expected: split('\\n').map((paragraph..."
  ((CHECKS_FAILED++))
fi
echo ""

# Check 5: Build succeeds
echo "📋 Check 5: Build Integrity"
if npm run build > /dev/null 2>&1; then
  echo -e "${GREEN}✅ PASS${NC} - Build succeeds without errors"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING${NC} - Build has issues (may be existing)"
  echo "   Run: npm run build"
  ((CHECKS_FAILED++))
fi
echo ""

# Check 6: Type checking
echo "📋 Check 6: TypeScript Integrity"
if npm run typecheck > /dev/null 2>&1; then
  echo -e "${GREEN}✅ PASS${NC} - TypeScript checks pass"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING${NC} - TypeScript has errors (may be existing)"
  echo "   Run: npm run typecheck"
  ((CHECKS_FAILED++))
fi
echo ""

# Summary
echo "=================================================="
echo "📊 SUMMARY"
echo "=================================================="
echo -e "Checks Passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Checks Failed: ${RED}$CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🟢 PROJECT SECURITY VERIFIED${NC}"
  echo "All critical security fixes are in place."
  exit 0
else
  echo -e "${RED}🔴 SECURITY ISSUES DETECTED${NC}"
  echo "Please review and fix the failures above."
  exit 1
fi
