/**
 * Country data for international phone input
 * Includes flag emoji, dial code, and ISO code for libphonenumber-js validation
 */

import type { CountryCode } from 'libphonenumber-js';

export interface Country {
  code: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
  priority?: number; // Higher = shown first
}

/**
 * Comprehensive list of countries
 * Prioritized for European dance school context
 */
export const COUNTRIES: Country[] = [
  // Priority countries (Europe + Americas + common)
  { code: 'ES', name: 'España', dialCode: '+34', flag: '🇪🇸', priority: 100 },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', priority: 90 },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', priority: 85 },
  { code: 'DE', name: 'Deutschland', dialCode: '+49', flag: '🇩🇪', priority: 80 },
  { code: 'IT', name: 'Italia', dialCode: '+39', flag: '🇮🇹', priority: 75 },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', priority: 70 },
  { code: 'NL', name: 'Nederland', dialCode: '+31', flag: '🇳🇱', priority: 65 },
  { code: 'BE', name: 'België/Belgique', dialCode: '+32', flag: '🇧🇪', priority: 60 },
  { code: 'CH', name: 'Schweiz/Suisse', dialCode: '+41', flag: '🇨🇭', priority: 55 },
  { code: 'AT', name: 'Österreich', dialCode: '+43', flag: '🇦🇹', priority: 50 },

  // Latin America (important for dance)
  { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽', priority: 45 },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', priority: 44 },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', priority: 43 },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺', priority: 42 },
  { code: 'BR', name: 'Brasil', dialCode: '+55', flag: '🇧🇷', priority: 41 },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', priority: 40 },
  { code: 'PE', name: 'Perú', dialCode: '+51', flag: '🇵🇪', priority: 39 },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪', priority: 38 },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨', priority: 37 },
  { code: 'DO', name: 'República Dominicana', dialCode: '+1809', flag: '🇩🇴', priority: 36 },
  { code: 'PR', name: 'Puerto Rico', dialCode: '+1787', flag: '🇵🇷', priority: 35 },

  // North America
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', priority: 34 },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', priority: 33 },

  // Rest of Europe (alphabetical by name)
  { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩', priority: 10 },
  { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱', priority: 10 },
  { code: 'BA', name: 'Bosnia', dialCode: '+387', flag: '🇧🇦', priority: 10 },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬', priority: 10 },
  { code: 'BY', name: 'Belarus', dialCode: '+375', flag: '🇧🇾', priority: 10 },
  { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾', priority: 10 },
  { code: 'CZ', name: 'Česká republika', dialCode: '+420', flag: '🇨🇿', priority: 10 },
  { code: 'DK', name: 'Danmark', dialCode: '+45', flag: '🇩🇰', priority: 10 },
  { code: 'EE', name: 'Eesti', dialCode: '+372', flag: '🇪🇪', priority: 10 },
  { code: 'FI', name: 'Suomi', dialCode: '+358', flag: '🇫🇮', priority: 10 },
  { code: 'GR', name: 'Ελλάδα', dialCode: '+30', flag: '🇬🇷', priority: 10 },
  { code: 'HR', name: 'Hrvatska', dialCode: '+385', flag: '🇭🇷', priority: 10 },
  { code: 'HU', name: 'Magyarország', dialCode: '+36', flag: '🇭🇺', priority: 10 },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', priority: 10 },
  { code: 'IS', name: 'Ísland', dialCode: '+354', flag: '🇮🇸', priority: 10 },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: '🇱🇮', priority: 10 },
  { code: 'LT', name: 'Lietuva', dialCode: '+370', flag: '🇱🇹', priority: 10 },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺', priority: 10 },
  { code: 'LV', name: 'Latvija', dialCode: '+371', flag: '🇱🇻', priority: 10 },
  { code: 'MC', name: 'Monaco', dialCode: '+377', flag: '🇲🇨', priority: 10 },
  { code: 'MD', name: 'Moldova', dialCode: '+373', flag: '🇲🇩', priority: 10 },
  { code: 'ME', name: 'Crna Gora', dialCode: '+382', flag: '🇲🇪', priority: 10 },
  { code: 'MK', name: 'Македонија', dialCode: '+389', flag: '🇲🇰', priority: 10 },
  { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹', priority: 10 },
  { code: 'NO', name: 'Norge', dialCode: '+47', flag: '🇳🇴', priority: 10 },
  { code: 'PL', name: 'Polska', dialCode: '+48', flag: '🇵🇱', priority: 10 },
  { code: 'RO', name: 'România', dialCode: '+40', flag: '🇷🇴', priority: 10 },
  { code: 'RS', name: 'Србија', dialCode: '+381', flag: '🇷🇸', priority: 10 },
  { code: 'RU', name: 'Россия', dialCode: '+7', flag: '🇷🇺', priority: 10 },
  { code: 'SE', name: 'Sverige', dialCode: '+46', flag: '🇸🇪', priority: 10 },
  { code: 'SI', name: 'Slovenija', dialCode: '+386', flag: '🇸🇮', priority: 10 },
  { code: 'SK', name: 'Slovensko', dialCode: '+421', flag: '🇸🇰', priority: 10 },
  { code: 'UA', name: 'Україна', dialCode: '+380', flag: '🇺🇦', priority: 10 },

  // Asia
  { code: 'AE', name: 'الإمارات', dialCode: '+971', flag: '🇦🇪', priority: 5 },
  { code: 'CN', name: '中国', dialCode: '+86', flag: '🇨🇳', priority: 5 },
  { code: 'HK', name: '香港', dialCode: '+852', flag: '🇭🇰', priority: 5 },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', priority: 5 },
  { code: 'IL', name: 'ישראל', dialCode: '+972', flag: '🇮🇱', priority: 5 },
  { code: 'IN', name: 'भारत', dialCode: '+91', flag: '🇮🇳', priority: 5 },
  { code: 'JP', name: '日本', dialCode: '+81', flag: '🇯🇵', priority: 5 },
  { code: 'KR', name: '대한민국', dialCode: '+82', flag: '🇰🇷', priority: 5 },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', priority: 5 },
  { code: 'PH', name: 'Pilipinas', dialCode: '+63', flag: '🇵🇭', priority: 5 },
  { code: 'SA', name: 'السعودية', dialCode: '+966', flag: '🇸🇦', priority: 5 },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', priority: 5 },
  { code: 'TH', name: 'ประเทศไทย', dialCode: '+66', flag: '🇹🇭', priority: 5 },
  { code: 'TR', name: 'Türkiye', dialCode: '+90', flag: '🇹🇷', priority: 5 },
  { code: 'TW', name: '台灣', dialCode: '+886', flag: '🇹🇼', priority: 5 },
  { code: 'VN', name: 'Việt Nam', dialCode: '+84', flag: '🇻🇳', priority: 5 },

  // Africa
  { code: 'DZ', name: 'الجزائر', dialCode: '+213', flag: '🇩🇿', priority: 3 },
  { code: 'EG', name: 'مصر', dialCode: '+20', flag: '🇪🇬', priority: 3 },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', priority: 3 },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', priority: 3 },
  { code: 'MA', name: 'المغرب', dialCode: '+212', flag: '🇲🇦', priority: 3 },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', priority: 3 },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳', priority: 3 },
  { code: 'TN', name: 'تونس', dialCode: '+216', flag: '🇹🇳', priority: 3 },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', priority: 3 },

  // Oceania
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', priority: 5 },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', priority: 5 },

  // Central America & Caribbean
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷', priority: 3 },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹', priority: 3 },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳', priority: 3 },
  { code: 'JM', name: 'Jamaica', dialCode: '+1876', flag: '🇯🇲', priority: 3 },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮', priority: 3 },
  { code: 'PA', name: 'Panamá', dialCode: '+507', flag: '🇵🇦', priority: 3 },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻', priority: 3 },

  // South America continued
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴', priority: 3 },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾', priority: 3 },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾', priority: 3 },
];

/**
 * Get sorted countries list (by priority, then alphabetically)
 */
export function getSortedCountries(): Country[] {
  return [...COUNTRIES].sort((a, b) => {
    // First by priority (descending)
    if ((b.priority ?? 0) !== (a.priority ?? 0)) {
      return (b.priority ?? 0) - (a.priority ?? 0);
    }
    // Then alphabetically by name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get default country based on locale
 */
export function getDefaultCountry(locale: string): Country {
  const localeToCountry: Record<string, CountryCode> = {
    es: 'ES',
    ca: 'ES', // Catalan → Spain
    en: 'GB',
    fr: 'FR',
    de: 'DE',
    it: 'IT',
    pt: 'PT',
  };

  const countryCode = localeToCountry[locale] ?? 'ES';
  const found = COUNTRIES.find(c => c.code === countryCode);
  const fallback = COUNTRIES.find(c => c.code === 'ES');
  return (
    found ??
    fallback ??
    COUNTRIES[0] ??
    ({ code: 'ES', name: 'España', dialCode: '+34', flag: '🇪🇸' } as Country)
  );
}

/**
 * Find country by ISO code
 */
export function findCountryByCode(code: CountryCode): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}

/**
 * Search countries by name or dial code
 */
export function searchCountries(query: string): Country[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return getSortedCountries();

  return getSortedCountries().filter(
    country =>
      country.name.toLowerCase().includes(normalizedQuery) ||
      country.dialCode.includes(normalizedQuery) ||
      country.code.toLowerCase().includes(normalizedQuery)
  );
}
