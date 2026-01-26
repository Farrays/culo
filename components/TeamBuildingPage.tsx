/**
 * TeamBuildingPage - Team Building Dance Services
 *
 * Enterprise-grade service page for Team Building activities
 * using the ServicePageTemplate.
 *
 * SEO Target: "Team Building Barcelona", "actividades team building baile"
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import ServicePageTemplate from './templates/ServicePageTemplate';
import type {
  ServiceFeature,
  ServiceBenefit,
  ProcessStep,
  IdealForItem,
  ServicePackage,
  ServiceStat,
  FAQ,
  TrustSignal,
  SummaryTableRow,
  RelatedService,
} from './templates/ServicePageTemplate.types';

const TeamBuildingPage: React.FC = () => {
  const { t } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);

  // Trust signals (E-E-A-T)
  const trustSignals: TrustSignal[] = [
    {
      id: 'rating',
      valueKey: 'teamBuilding_trust_rating',
      labelKey: 'teamBuilding_trust_rating_label',
    },
    {
      id: 'unesco',
      iconName: 'badge-check',
      valueKey: 'teamBuilding_trust_unesco',
      labelKey: 'teamBuilding_trust_unesco_label',
    },
    {
      id: 'years',
      iconName: 'calendar',
      valueKey: 'teamBuilding_trust_years',
      labelKey: 'teamBuilding_trust_years_label',
    },
    {
      id: 'events',
      iconName: 'users',
      valueKey: 'teamBuilding_trust_events',
      labelKey: 'teamBuilding_trust_events_label',
    },
  ];

  // Service features
  const features: ServiceFeature[] = [
    {
      id: 'workshops',
      titleKey: 'teamBuilding_feature_workshops_title',
      descriptionKey: 'teamBuilding_feature_workshops_desc',
      iconName: 'users',
      isHighlighted: true,
    },
    {
      id: 'choreography',
      titleKey: 'teamBuilding_feature_choreography_title',
      descriptionKey: 'teamBuilding_feature_choreography_desc',
      iconName: 'sparkles',
    },
    {
      id: 'competitions',
      titleKey: 'teamBuilding_feature_competitions_title',
      descriptionKey: 'teamBuilding_feature_competitions_desc',
      iconName: 'trophy',
    },
    {
      id: 'videoclip',
      titleKey: 'teamBuilding_feature_videoclip_title',
      descriptionKey: 'teamBuilding_feature_videoclip_desc',
      iconName: 'star',
    },
    {
      id: 'flashmob',
      titleKey: 'teamBuilding_feature_flashmob_title',
      descriptionKey: 'teamBuilding_feature_flashmob_desc',
      iconName: 'globe',
    },
    {
      id: 'custom',
      titleKey: 'teamBuilding_feature_custom_title',
      descriptionKey: 'teamBuilding_feature_custom_desc',
      iconName: 'gift',
    },
  ];

  // Benefits (why choose us)
  const benefits: ServiceBenefit[] = [
    {
      id: 'experience',
      titleKey: 'teamBuilding_benefit_experience_title',
      descriptionKey: 'teamBuilding_benefit_experience_desc',
      iconName: 'trophy',
    },
    {
      id: 'professionals',
      titleKey: 'teamBuilding_benefit_professionals_title',
      descriptionKey: 'teamBuilding_benefit_professionals_desc',
      iconName: 'academic-cap',
    },
    {
      id: 'flexibility',
      titleKey: 'teamBuilding_benefit_flexibility_title',
      descriptionKey: 'teamBuilding_benefit_flexibility_desc',
      iconName: 'clock',
    },
    {
      id: 'results',
      titleKey: 'teamBuilding_benefit_results_title',
      descriptionKey: 'teamBuilding_benefit_results_desc',
      iconName: 'chart-bar',
    },
    {
      id: 'fun',
      titleKey: 'teamBuilding_benefit_fun_title',
      descriptionKey: 'teamBuilding_benefit_fun_desc',
      iconName: 'heart',
    },
    {
      id: 'location',
      titleKey: 'teamBuilding_benefit_location_title',
      descriptionKey: 'teamBuilding_benefit_location_desc',
      iconName: 'map-pin',
    },
  ];

  // Process steps
  const processSteps: ProcessStep[] = [
    {
      id: 'step1',
      stepNumber: 1,
      titleKey: 'teamBuilding_process_step1_title',
      descriptionKey: 'teamBuilding_process_step1_desc',
    },
    {
      id: 'step2',
      stepNumber: 2,
      titleKey: 'teamBuilding_process_step2_title',
      descriptionKey: 'teamBuilding_process_step2_desc',
    },
    {
      id: 'step3',
      stepNumber: 3,
      titleKey: 'teamBuilding_process_step3_title',
      descriptionKey: 'teamBuilding_process_step3_desc',
    },
    {
      id: 'step4',
      stepNumber: 4,
      titleKey: 'teamBuilding_process_step4_title',
      descriptionKey: 'teamBuilding_process_step4_desc',
    },
  ];

  // Ideal for
  const idealForItems: IdealForItem[] = [
    { id: 'corporate', textKey: 'teamBuilding_idealFor_corporate' },
    { id: 'startups', textKey: 'teamBuilding_idealFor_startups' },
    { id: 'departments', textKey: 'teamBuilding_idealFor_departments' },
    { id: 'incentives', textKey: 'teamBuilding_idealFor_incentives' },
    { id: 'conventions', textKey: 'teamBuilding_idealFor_conventions' },
    { id: 'celebrations', textKey: 'teamBuilding_idealFor_celebrations' },
  ];

  // Packages
  const packages: ServicePackage[] = [
    {
      id: 'express',
      titleKey: 'teamBuilding_package_express_title',
      descriptionKey: 'teamBuilding_package_express_desc',
      priceKey: 'teamBuilding_package_express_price',
      featureKeys: [
        'teamBuilding_package_express_feature1',
        'teamBuilding_package_express_feature2',
        'teamBuilding_package_express_feature3',
        'teamBuilding_package_express_feature4',
      ],
      isPopular: false,
    },
    {
      id: 'premium',
      titleKey: 'teamBuilding_package_premium_title',
      descriptionKey: 'teamBuilding_package_premium_desc',
      priceKey: 'teamBuilding_package_premium_price',
      badgeKey: 'teamBuilding_package_popular_badge',
      featureKeys: [
        'teamBuilding_package_premium_feature1',
        'teamBuilding_package_premium_feature2',
        'teamBuilding_package_premium_feature3',
        'teamBuilding_package_premium_feature4',
        'teamBuilding_package_premium_feature5',
      ],
      isPopular: true,
    },
    {
      id: 'full',
      titleKey: 'teamBuilding_package_full_title',
      descriptionKey: 'teamBuilding_package_full_desc',
      priceKey: 'teamBuilding_package_full_price',
      featureKeys: [
        'teamBuilding_package_full_feature1',
        'teamBuilding_package_full_feature2',
        'teamBuilding_package_full_feature3',
        'teamBuilding_package_full_feature4',
        'teamBuilding_package_full_feature5',
        'teamBuilding_package_full_feature6',
      ],
      isPopular: false,
    },
  ];

  // Stats
  const stats: ServiceStat[] = [
    { id: 'years', value: 8, suffix: '+', labelKey: 'yearsExperience' },
    { id: 'events', value: 500, suffix: '+', labelKey: 'teamBuilding_stat_events' },
    { id: 'participants', value: 15000, suffix: '+', labelKey: 'teamBuilding_stat_participants' },
    { id: 'rating', value: 4.9, labelKey: 'teamBuilding_stat_rating' },
  ];

  // Summary table for LLM citability
  const summaryTableRows: SummaryTableRow[] = [
    {
      serviceKey: 'teamBuilding_table_workshop',
      durationKey: 'teamBuilding_table_workshop_duration',
      idealForKey: 'teamBuilding_table_workshop_ideal',
      priceKey: 'teamBuilding_table_workshop_price',
    },
    {
      serviceKey: 'teamBuilding_table_choreography',
      durationKey: 'teamBuilding_table_choreography_duration',
      idealForKey: 'teamBuilding_table_choreography_ideal',
      priceKey: 'teamBuilding_table_choreography_price',
    },
    {
      serviceKey: 'teamBuilding_table_videoclip',
      durationKey: 'teamBuilding_table_videoclip_duration',
      idealForKey: 'teamBuilding_table_videoclip_ideal',
      priceKey: 'teamBuilding_table_videoclip_price',
    },
    {
      serviceKey: 'teamBuilding_table_flashmob',
      durationKey: 'teamBuilding_table_flashmob_duration',
      idealForKey: 'teamBuilding_table_flashmob_ideal',
      priceKey: 'teamBuilding_table_flashmob_price',
    },
  ];

  // FAQs
  const faqs: FAQ[] = [
    {
      id: 'faq1',
      questionKey: 'teamBuilding_faq1_question',
      answerKey: 'teamBuilding_faq1_answer',
    },
    {
      id: 'faq2',
      questionKey: 'teamBuilding_faq2_question',
      answerKey: 'teamBuilding_faq2_answer',
    },
    {
      id: 'faq3',
      questionKey: 'teamBuilding_faq3_question',
      answerKey: 'teamBuilding_faq3_answer',
    },
    {
      id: 'faq4',
      questionKey: 'teamBuilding_faq4_question',
      answerKey: 'teamBuilding_faq4_answer',
    },
    {
      id: 'faq5',
      questionKey: 'teamBuilding_faq5_question',
      answerKey: 'teamBuilding_faq5_answer',
    },
    {
      id: 'faq6',
      questionKey: 'teamBuilding_faq6_question',
      answerKey: 'teamBuilding_faq6_answer',
    },
    {
      id: 'faq7',
      questionKey: 'teamBuilding_faq7_question',
      answerKey: 'teamBuilding_faq7_answer',
    },
  ];

  // Related services
  const relatedServices: RelatedService[] = [
    {
      id: 'eventos',
      titleKey: 'teamBuilding_related_eventos_title',
      descriptionKey: 'teamBuilding_related_eventos_desc',
      url: '/agencia-eventos-barcelona',
      imageSrc: '/images/servicios-eventos.jpg',
      imageAlt: 'Agencia de Eventos Barcelona',
    },
    {
      id: 'fiestas',
      titleKey: 'teamBuilding_related_fiestas_title',
      descriptionKey: 'teamBuilding_related_fiestas_desc',
      url: '/fiestas-despedidas-baile',
      imageSrc: '/images/servicios-fiestas.jpg',
      imageAlt: 'Fiestas y Despedidas con Baile',
    },
    {
      id: 'particulares',
      titleKey: 'teamBuilding_related_particulares_title',
      descriptionKey: 'teamBuilding_related_particulares_desc',
      url: '/clases-particulares-baile',
      imageSrc: '/images/clases-particulares.jpg',
      imageAlt: 'Clases Particulares de Baile',
    },
  ];

  return (
    <ServicePageTemplate
      // Identification
      serviceId="team-building"
      // SEO
      pageTitleKey="teamBuilding_pageTitle"
      metaDescriptionKey="teamBuilding_metaDescription"
      keywords={[
        'team building barcelona',
        'team building con baile',
        'actividades team building empresas',
        'team building corporativo',
        'team building dance',
        'actividades corporativas barcelona',
        'eventos empresa barcelona',
        'team building original',
        'workshops baile empresas',
      ]}
      canonicalPath="/team-building-barcelona"
      ogImage="/images/og-image.jpg"
      // Hero
      heroTitleKey="teamBuilding_heroTitle"
      heroSubtitleKey="teamBuilding_heroSubtitle"
      heroIntroKey="teamBuilding_heroIntro"
      heroGradient="from-purple-900/40"
      heroShowPhoneButton={false}
      // Trust Bar
      trustSignals={trustSignals}
      // Problem/Solution
      problemSectionEnabled={true}
      problemTitleKey="teamBuilding_problem_title"
      problemDescKey="teamBuilding_problem_desc"
      solutionTitleKey="teamBuilding_solution_title"
      solutionDescKey="teamBuilding_solution_desc"
      // Features
      featuresTitleKey="teamBuilding_features_title"
      features={features}
      featuresColumns={3}
      // Benefits
      benefitsTitleKey="teamBuilding_benefits_title"
      benefits={benefits}
      // Process
      processSectionEnabled={true}
      processTitleKey="teamBuilding_process_title"
      processSteps={processSteps}
      // Ideal For
      idealForEnabled={true}
      idealForTitleKey="teamBuilding_idealFor_title"
      idealForItems={idealForItems}
      // Packages
      packagesEnabled={true}
      packagesTitleKey="teamBuilding_packages_title"
      packages={packages}
      // Stats
      stats={stats}
      // Summary Table
      summaryTableEnabled={true}
      summaryTableTitleKey="teamBuilding_summaryTable_title"
      summaryTableHeaders={{
        serviceKey: 'teamBuilding_table_header_service',
        durationKey: 'teamBuilding_table_header_duration',
        idealForKey: 'teamBuilding_table_header_ideal',
        priceKey: 'teamBuilding_table_header_price',
      }}
      summaryTableRows={summaryTableRows}
      // Reviews
      reviewsCategory="general"
      reviewsLimit={6}
      // FAQ
      faqTitleKey="teamBuilding_faq_title"
      faqs={faqs}
      // Related Services
      relatedServicesEnabled={true}
      relatedServicesTitleKey="teamBuilding_related_title"
      relatedServices={relatedServices}
      // Final CTA
      ctaTitleKey="teamBuilding_cta_title"
      ctaDescKey="teamBuilding_cta_desc"
      ctaButtonKey="teamBuilding_cta_button"
      ctaShowContactInfo={false}
      // Schema
      schemaOptions={{
        serviceType: 'Team Building Dance Workshop',
        serviceName: t('teamBuilding_schema_name'),
        serviceDescription: t('teamBuilding_schema_description'),
        areaServed: 'Barcelona',
        priceRange: '$$',
      }}
    />
  );
};

export default TeamBuildingPage;
