/**
 * ServicePageTemplate Types
 * Enterprise-grade TypeScript interfaces for service page generation
 *
 * Follows:
 * - Schema.org LocalBusiness + Service specifications
 * - SEO 2025 best practices
 * - WCAG 2.2 accessibility requirements
 * - LLM optimization for citability
 */

import type { IconName } from '../Icon';
import type { DanceCategory } from '../../constants/reviews-data';

// =============================================================================
// CORE TYPES
// =============================================================================

export interface BreadcrumbItem {
  name: string;
  url: string;
  isActive?: boolean;
}

export interface FAQ {
  id: string;
  questionKey: string;
  answerKey: string;
}

// =============================================================================
// SERVICE FEATURES
// =============================================================================

export interface ServiceFeature {
  id: string;
  titleKey: string;
  descriptionKey: string;
  iconName: IconName;
  /** Optional link to more details */
  linkUrl?: string;
  /** Optional highlight for popular features */
  isHighlighted?: boolean;
}

// =============================================================================
// BENEFITS (VALUE PILLARS)
// =============================================================================

export interface ServiceBenefit {
  id: string;
  titleKey: string;
  descriptionKey: string;
  iconName: IconName;
}

// =============================================================================
// PROCESS STEPS (HOW IT WORKS)
// =============================================================================

export interface ProcessStep {
  id: string;
  stepNumber: number;
  titleKey: string;
  descriptionKey: string;
  iconName?: IconName;
}

// =============================================================================
// TARGET AUDIENCE (IDEAL FOR)
// =============================================================================

export interface IdealForItem {
  id: string;
  textKey: string;
  iconName?: IconName;
}

// =============================================================================
// SERVICE PACKAGES
// =============================================================================

export interface ServicePackage {
  id: string;
  titleKey: string;
  descriptionKey: string;
  /** Translation keys for feature list items */
  featureKeys: string[];
  /** Indicative price display (e.g., "desde 150€") */
  priceKey?: string;
  /** Badge for popular/recommended packages */
  badgeKey?: string;
  /** Is this the highlighted/recommended package */
  isPopular?: boolean;
  /** CTA button key */
  ctaKey?: string;
}

// =============================================================================
// STATS
// =============================================================================

export interface ServiceStat {
  id: string;
  value: number;
  suffix?: string;
  labelKey: string;
}

// =============================================================================
// RELATED SERVICES
// =============================================================================

export interface RelatedService {
  id: string;
  titleKey: string;
  descriptionKey: string;
  url: string;
  imageSrc: string;
  imageAlt: string;
}

// =============================================================================
// SUMMARY TABLE (LLM CITABILITY)
// =============================================================================

export interface SummaryTableRow {
  serviceKey: string;
  durationKey?: string;
  idealForKey: string;
  priceKey?: string;
}

// =============================================================================
// TRUST SIGNALS (E-E-A-T)
// =============================================================================

export interface TrustSignal {
  id: string;
  /** Icon to display */
  iconName?: IconName;
  /** Main text (e.g., "4.9★") */
  valueKey: string;
  /** Label (e.g., "en Google") */
  labelKey: string;
}

// =============================================================================
// SCHEMA OPTIONS
// =============================================================================

export interface ServiceSchemaOptions {
  /** Schema.org serviceType (e.g., "Team Building Dance Workshop") */
  serviceType: string;
  /** Service name for schema */
  serviceName: string;
  /** Service description for schema */
  serviceDescription: string;
  /** Area served (default: Barcelona) */
  areaServed?: string;
  /** Optional price range for schema */
  priceRange?: string;
  /** Optional offers/catalog for schema */
  hasOfferCatalog?: boolean;
}

// =============================================================================
// MAIN TEMPLATE PROPS
// =============================================================================

export interface ServicePageTemplateProps {
  // === IDENTIFICATION ===
  /** Unique service identifier (e.g., 'team-building', 'eventos') */
  serviceId: string;

  // === SEO ===
  /** i18n key for page <title> */
  pageTitleKey: string;
  /** i18n key for meta description */
  metaDescriptionKey: string;
  /** Keywords for SEO */
  keywords: string[];
  /** Canonical path (e.g., '/team-building-barcelona') */
  canonicalPath: string;
  /** OG image path */
  ogImage?: string;

  // === HERO ===
  /** i18n key for H1 title */
  heroTitleKey: string;
  /** i18n key for subtitle (optional) */
  heroSubtitleKey?: string;
  /** i18n key for intro paragraph (LLM-optimized) */
  heroIntroKey: string;
  /** Tailwind gradient classes (e.g., "from-purple-900/30") */
  heroGradient: string;
  /** Optional hero background image */
  heroImage?: string;
  /** Show phone button in hero (default: true) */
  heroShowPhoneButton?: boolean;

  // === TRUST BAR (E-E-A-T) ===
  /** Trust signals to display (rating, certifications, stats) */
  trustSignals?: TrustSignal[];

  // === PROBLEM/SOLUTION ===
  /** Enable problem/solution section */
  problemSectionEnabled?: boolean;
  /** i18n key for problem title */
  problemTitleKey?: string;
  /** i18n key for problem description */
  problemDescKey?: string;
  /** i18n key for solution title */
  solutionTitleKey?: string;
  /** i18n key for solution description */
  solutionDescKey?: string;

  // === FEATURES GRID ===
  /** i18n key for features section title */
  featuresTitleKey: string;
  /** Service features to display */
  features: ServiceFeature[];
  /** Grid columns (default: 3) */
  featuresColumns?: 2 | 3 | 4;

  // === BENEFITS (VALUE PILLARS) ===
  /** i18n key for benefits section title (default: whyTitle) */
  benefitsTitleKey?: string;
  /** Benefits/value propositions */
  benefits: ServiceBenefit[];

  // === PROCESS (HOW IT WORKS) ===
  /** Enable process section */
  processSectionEnabled?: boolean;
  /** i18n key for process section title */
  processTitleKey?: string;
  /** Process steps */
  processSteps?: ProcessStep[];

  // === IDEAL FOR (TARGET AUDIENCE) ===
  /** Enable "ideal for" section */
  idealForEnabled?: boolean;
  /** i18n key for "ideal for" section title */
  idealForTitleKey?: string;
  /** Target audience items */
  idealForItems?: IdealForItem[];

  // === PACKAGES/PRICING ===
  /** Enable packages section */
  packagesEnabled?: boolean;
  /** i18n key for packages section title */
  packagesTitleKey?: string;
  /** Service packages */
  packages?: ServicePackage[];

  // === STATS ===
  /** Statistics to display with AnimatedCounter */
  stats: ServiceStat[];

  // === SUMMARY TABLE (LLM CITABILITY) ===
  /** Enable summary table for LLM citability */
  summaryTableEnabled?: boolean;
  /** i18n key for summary table title */
  summaryTableTitleKey?: string;
  /** Summary table column headers */
  summaryTableHeaders?: {
    serviceKey: string;
    durationKey?: string;
    idealForKey: string;
    priceKey?: string;
  };
  /** Summary table rows */
  summaryTableRows?: SummaryTableRow[];

  // === REVIEWS ===
  /** Reviews category filter */
  reviewsCategory?: DanceCategory;
  /** Number of reviews to display (default: 6) */
  reviewsLimit?: number;

  // === FAQ ===
  /** i18n key for FAQ section title */
  faqTitleKey: string;
  /** FAQ items */
  faqs: FAQ[];

  // === RELATED SERVICES ===
  /** Enable related services section */
  relatedServicesEnabled?: boolean;
  /** i18n key for related services title */
  relatedServicesTitleKey?: string;
  /** Related services to display */
  relatedServices?: RelatedService[];

  // === FINAL CTA ===
  /** i18n key for CTA title */
  ctaTitleKey: string;
  /** i18n key for CTA description */
  ctaDescKey: string;
  /** i18n key for CTA button text */
  ctaButtonKey?: string;
  /** Phone number for direct contact CTA */
  ctaPhone?: string;
  /** WhatsApp number (with country code, no +) */
  ctaWhatsApp?: string;
  /** Email for contact */
  ctaEmail?: string;
  /** Show contact info below CTA button (default: true) */
  ctaShowContactInfo?: boolean;

  // === SCHEMA OPTIONS ===
  /** Service schema configuration */
  schemaOptions: ServiceSchemaOptions;

  // === CUSTOM SCHEMAS ===
  /** Additional custom JSON-LD schemas */
  customSchemas?: object[];
}

// =============================================================================
// SECTION COMPONENT PROPS (INTERNAL)
// =============================================================================

export interface ServiceHeroProps {
  gradient: string;
  titleKey: string;
  subtitleKey?: string;
  introKey: string;
  breadcrumbItems: BreadcrumbItem[];
  heroImage?: string;
  showPhoneButton?: boolean;
  ctaPhone?: string;
  ctaWhatsApp?: string;
}

export interface TrustBarProps {
  signals: TrustSignal[];
}

export interface ProblemSolutionProps {
  problemTitleKey: string;
  problemDescKey: string;
  solutionTitleKey: string;
  solutionDescKey: string;
}

export interface FeaturesGridProps {
  titleKey: string;
  features: ServiceFeature[];
  columns: 2 | 3 | 4;
}

export interface BenefitsSectionProps {
  titleKey: string;
  benefits: ServiceBenefit[];
}

export interface ProcessSectionProps {
  titleKey: string;
  steps: ProcessStep[];
}

export interface IdealForSectionProps {
  titleKey: string;
  items: IdealForItem[];
}

export interface PackagesSectionProps {
  titleKey: string;
  packages: ServicePackage[];
}

export interface StatsSectionProps {
  stats: ServiceStat[];
}

export interface SummaryTableProps {
  titleKey: string;
  headers: {
    serviceKey: string;
    durationKey?: string;
    idealForKey: string;
    priceKey?: string;
  };
  rows: SummaryTableRow[];
}

export interface RelatedServicesSectionProps {
  titleKey: string;
  services: RelatedService[];
}

export interface FinalCTAProps {
  gradient: string;
  titleKey: string;
  descKey: string;
  buttonKey?: string;
  phone?: string;
  whatsApp?: string;
  email?: string;
  showContactInfo?: boolean;
}
