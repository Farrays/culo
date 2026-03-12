/**
 * SEO Meta Keys - Single Source of Truth
 *
 * Maps page keys (used in routes and prerender.mjs) to i18n translation keys
 * for meta titles, descriptions, and their namespace.
 *
 * Used by:
 * - prerender.mjs (build time) — generates static HTML meta tags
 * - SEO.tsx (runtime) — React Helmet meta tags
 *
 * Both consumers read from the SAME i18n files, ensuring consistency
 * between pre-rendered HTML and client-side React.
 */

export const SEO_META_KEYS = {
  // ═══════════════════════════════════════════════════════════════
  // MAIN PAGES
  // ═══════════════════════════════════════════════════════════════
  home:                { titleKey: 'pageTitle',                    descKey: 'metaDescription',                     ns: 'common' },
  classes:             { titleKey: 'danceClassesHub_h1',           descKey: 'danceClassesHub_description',         ns: 'classes' },
  classesHub:          { titleKey: 'danceClassesHub_h1',           descKey: 'danceClassesHub_description',         ns: 'classes' },
  horariosPrecio:      { titleKey: 'pricing_page_title',           descKey: 'pricing_page_description',            ns: 'pages' },
  horariosClases:      { titleKey: 'horariosV2_page_title',        descKey: 'horariosV2_page_description',         ns: 'schedule' },
  preciosClases:       { titleKey: 'pricingV2_page_title',         descKey: 'pricingV2_page_description',          ns: 'pages' },

  // ═══════════════════════════════════════════════════════════════
  // DANCE CLASS CATEGORY PAGES
  // ═══════════════════════════════════════════════════════════════
  danza:               { titleKey: 'danzaBarcelona_title',         descKey: 'danzaBarcelona_description',          ns: 'pages' },
  salsaBachata:        { titleKey: 'salsaBachataBarcelona_title',  descKey: 'salsaBachataBarcelona_description',   ns: 'pages' },
  danzasUrbanas:       { titleKey: 'danzasUrbanas_title',          descKey: 'danzasUrbanas_description',           ns: 'pages' },
  heelsBarcelona:      { titleKey: 'heelsBarcelona_title',         descKey: 'heelsBarcelona_description',          ns: 'pages' },

  // ═══════════════════════════════════════════════════════════════
  // INDIVIDUAL DANCE CLASS PAGES
  // ═══════════════════════════════════════════════════════════════
  salsaCubana:         { titleKey: 'salsaCubanaPageTitle',         descKey: 'salsaCubanaMetaDescription',          ns: 'pages' },
  salsaLadyStyle:      { titleKey: 'salsaLadyPageTitle',           descKey: 'salsaLadyMetaDescription',            ns: 'pages' },
  bachataSensual:      { titleKey: 'bachataV3PageTitle',           descKey: 'bachataV3MetaDescription',            ns: 'pages' },
  bachataLadyStyle:    { titleKey: 'bachataLadyPageTitle',         descKey: 'bachataLadyMetaDescription',          ns: 'pages' },
  folkloreCubano:      { titleKey: 'folklorePageTitle',            descKey: 'folkloreMetaDescription',             ns: 'pages' },
  timba:               { titleKey: 'timbaPageTitle',               descKey: 'timbaMetaDescription',                ns: 'pages' },
  dancehall:           { titleKey: 'dhV3PageTitle',                descKey: 'dhV3MetaDescription',                 ns: 'pages' },
  twerk:               { titleKey: 'twerkPageTitle',               descKey: 'twerkMetaDescription',                ns: 'pages' },
  afrobeat:            { titleKey: 'afroPageTitle',                descKey: 'afroMetaDescription',                 ns: 'pages' },
  hipHopReggaeton:     { titleKey: 'hhrPageTitle',                 descKey: 'hhrMetaDescription',                  ns: 'pages' },
  hipHop:              { titleKey: 'hiphopPageTitle',              descKey: 'hiphopMetaDescription',               ns: 'pages' },
  sexyReggaeton:       { titleKey: 'sxrPageTitle',                 descKey: 'sxrMetaDescription',                  ns: 'pages' },
  reggaetonCubano:     { titleKey: 'rcbPageTitle',                 descKey: 'rcbMetaDescription',                  ns: 'pages' },
  femmology:           { titleKey: 'femPageTitle',                 descKey: 'femMetaDescription',                  ns: 'pages' },
  sexyStyle:           { titleKey: 'sexystylePageTitle',           descKey: 'sexystyleMetaDescription',            ns: 'pages' },
  modernJazz:          { titleKey: 'modernjazzPageTitle',          descKey: 'modernjazzMetaDescription',           ns: 'pages' },
  ballet:              { titleKey: 'balletPageTitle',              descKey: 'balletMetaDescription',               ns: 'pages' },
  contemporaneo:       { titleKey: 'contemporaneoPageTitle',       descKey: 'contemporaneoMetaDescription',        ns: 'pages' },
  afroContemporaneo:   { titleKey: 'afrocontemporaneoPageTitle',   descKey: 'afrocontemporaneoMetaDescription',    ns: 'pages' },
  afroJazz:            { titleKey: 'afrojazzPageTitle',            descKey: 'afrojazzMetaDescription',             ns: 'pages' },
  stretching:          { titleKey: 'stretchingPageTitle',          descKey: 'stretchingMetaDescription',           ns: 'pages' },
  kpop:                { titleKey: 'kpopPageTitle',                descKey: 'kpopMetaDescription',                 ns: 'pages' },
  commercial:          { titleKey: 'commercialPageTitle',          descKey: 'commercialMetaDescription',           ns: 'pages' },
  kizomba:             { titleKey: 'kizombaPageTitle',             descKey: 'kizombaMetaDescription',              ns: 'pages' },
  bumBum:              { titleKey: 'bumbumPageTitle',              descKey: 'bumbumMetaDescription',               ns: 'pages' },

  // ═══════════════════════════════════════════════════════════════
  // FITNESS & TRAINING PAGES
  // ═══════════════════════════════════════════════════════════════
  cuerpoFit:           { titleKey: 'cuerpofitPageTitle',           descKey: 'cuerpofitMetaDescription',            ns: 'pages' },
  cuerpoFitPage:       { titleKey: 'fullBodyCardioPageTitle',      descKey: 'fullBodyCardioMetaDescription',       ns: 'pages' },
  baileManananas:      { titleKey: 'bailemanananasPageTitle',      descKey: 'bailemanananasMetaDescription',       ns: 'pages' },
  entrenamientoBailarines: { titleKey: 'prepFisica_title',         descKey: 'prepFisica_description',              ns: 'pages' },

  // ═══════════════════════════════════════════════════════════════
  // SERVICES & FACILITIES
  // ═══════════════════════════════════════════════════════════════
  clasesParticulares:  { titleKey: 'particularesPage_title',       descKey: 'particularesPage_description',        ns: 'pages' },
  alquilerSalas:       { titleKey: 'roomRental_pageTitle',         descKey: 'roomRental_metaDescription',          ns: 'pages' },
  estudioGrabacion:    { titleKey: 'estudioGrabacion_h1',          descKey: 'estudioGrabacion_meta_description',   ns: 'pages' },
  regalaBaile:         { titleKey: 'regalaBaile_page_title',       descKey: 'regalaBaile_meta_description',        ns: 'pages' },
  merchandising:       { titleKey: 'merchandising_page_title',     descKey: 'merchandising_page_description',      ns: 'pages' },
  facilities:          { titleKey: 'facilitiesPageTitle',          descKey: 'facilitiesMetaDescription',           ns: 'pages' },
  servicios:           { titleKey: 'serviciosBaile_pageTitle',     descKey: 'serviciosBaile_metaDescription',      ns: 'pages' },
  serviciosBaile:      { titleKey: 'serviciosBaile_pageTitle',     descKey: 'serviciosBaile_metaDescription',      ns: 'pages' },
  teamBuilding:        { titleKey: 'teamBuilding_page_title',      descKey: 'teamBuilding_metaDescription',        ns: 'pages' },

  // ═══════════════════════════════════════════════════════════════
  // ABOUT / INSTITUTIONAL
  // ═══════════════════════════════════════════════════════════════
  about:               { titleKey: 'about_page_title',             descKey: 'about_description',                   ns: 'about' },
  yunaisy:             { titleKey: 'yunaisyFarray_page_title',     descKey: 'yunaisyFarray_meta_description',      ns: 'about' },
  metodoFarray:        { titleKey: 'metodoFarray_page_title',      descKey: 'metodoFarray_meta_description',       ns: 'about' },
  profesores:          { titleKey: 'teachersPageTitle',            descKey: 'teachersPageMetaDescription',         ns: 'pages' },
  contact:             { titleKey: 'contact_page_title',           descKey: 'contact_page_description',            ns: 'contact' },
  faq:                 { titleKey: 'faq_page_title',               descKey: 'faq_page_description',                ns: 'faq' },
  ubicacion:           { titleKey: 'ubicacion_pageTitle',          descKey: 'ubicacion_pageDescription',           ns: 'pages' },
  calendario:          { titleKey: 'calendar_page_title',          descKey: 'calendar_page_description',           ns: 'calendar' },

  // ═══════════════════════════════════════════════════════════════
  // BOOKING & MEMBERSHIP
  // ═══════════════════════════════════════════════════════════════
  reservas:            { titleKey: 'booking_page_title',           descKey: 'booking_meta_description',            ns: 'booking' },
  hazteSocio:          { titleKey: 'hazteSocio_page_title',        descKey: 'hazteSocio_meta_description',         ns: 'pages' },

  // ═══════════════════════════════════════════════════════════════
  // INTERNAL / ADMIN PAGES (noindex)
  // ═══════════════════════════════════════════════════════════════
  yrProject:           { titleKey: 'yr_page_title',                descKey: 'yr_meta_description',                 ns: 'pages' },
  miReserva:           { titleKey: 'miReserva_page_title',         descKey: 'miReserva_meta_description',          ns: 'pages' },
  fichaje:             { titleKey: 'fichaje_page_title',           descKey: 'fichaje_meta_description',            ns: 'pages' },
  fichajeResumen:      { titleKey: 'fichajeResumen_page_title',    descKey: 'fichajeResumen_meta_description',     ns: 'pages' },
  adminFichajes:       { titleKey: 'adminFichajes_page_title',     descKey: 'adminFichajes_meta_description',      ns: 'pages' },
  adminReservas:       { titleKey: 'adminReservas_page_title',     descKey: 'adminReservas_meta_description',      ns: 'pages' },
  feedbackGracias:     { titleKey: 'feedbackGracias_page_title',   descKey: 'feedbackGracias_meta_description',    ns: 'pages' },
  feedbackComentario:  { titleKey: 'feedbackComentario_page_title',descKey: 'feedbackComentario_meta_description', ns: 'pages' },
  asistenciaConfirmada:{ titleKey: 'asistencia_page_title',        descKey: 'asistencia_meta_description',         ns: 'pages' },
  notFound:            { titleKey: 'notFound_seo_title',           descKey: 'notFound_seo_description',            ns: 'common' },

  // ═══════════════════════════════════════════════════════════════
  // LEGAL PAGES
  // ═══════════════════════════════════════════════════════════════
  termsConditions:     { titleKey: 'terms_page_title',             descKey: 'terms_page_description',              ns: 'pages' },
  legalNotice:         { titleKey: 'legalNotice_page_title',       descKey: 'legalNotice_page_description',        ns: 'common' },
  privacyPolicy:       { titleKey: 'privacy_page_title',           descKey: 'privacy_page_description',            ns: 'pages' },
  cookiePolicy:        { titleKey: 'cookies_page_title',           descKey: 'cookies_page_description',            ns: 'pages' },

  // ═══════════════════════════════════════════════════════════════
  // BLOG - MAIN & CATEGORIES
  // ═══════════════════════════════════════════════════════════════
  blog:                { titleKey: 'blog_pageTitle',               descKey: 'blog_metaDescription',                ns: 'blog' },
  blogLifestyle:       { titleKey: 'blog_category_lifestyle',      descKey: 'blog_category_lifestyle_desc',        ns: 'blog' },
  blogHistoria:        { titleKey: 'blog_category_historia',       descKey: 'blog_category_historia_desc',         ns: 'blog' },
  blogTutoriales:      { titleKey: 'blog_category_tutoriales',     descKey: 'blog_category_tutoriales_desc',       ns: 'blog' },
  blogTips:            { titleKey: 'blog_category_tips',           descKey: 'blog_category_tips_desc',             ns: 'blog' },
  blogFitness:         { titleKey: 'blog_category_fitness',        descKey: 'blog_category_fitness_desc',          ns: 'blog' },

  // ═══════════════════════════════════════════════════════════════
  // BLOG - ARTICLES
  // ═══════════════════════════════════════════════════════════════
  blogBeneficiosSalsa: { titleKey: 'blogBeneficiosSalsa_title',    descKey: 'blogBeneficiosSalsa_metaDescription', ns: 'blog' },
  blogHistoriaSalsa:   { titleKey: 'blogHistoriaSalsa_title',      descKey: 'blogHistoriaSalsa_metaDescription',   ns: 'blog' },
  blogHistoriaBachata: { titleKey: 'blogHistoriaBachata_title',    descKey: 'blogHistoriaBachata_metaDescription', ns: 'blog' },
  blogSalsaRitmo:      { titleKey: 'blogSalsaRitmo_title',         descKey: 'blogSalsaRitmo_metaDescription',      ns: 'blog' },
  blogSalsaVsBachata:  { titleKey: 'blogSalsaVsBachata_title',     descKey: 'blogSalsaVsBachata_metaDescription',  ns: 'blog' },
  blogClasesSalsaBarcelona: { titleKey: 'blogClasesSalsaBarcelona_title', descKey: 'blogClasesSalsaBarcelona_metaDescription', ns: 'blog' },
  blogClasesPrincipiantes: { titleKey: 'blogClasesPrincipiantes_title', descKey: 'blogClasesPrincipiantes_metaDescription', ns: 'blog' },
  blogAcademiaDanza:   { titleKey: 'blogAcademiaDanza_title',      descKey: 'blogAcademiaDanza_metaDescription',   ns: 'blog' },
  blogBalletAdultos:   { titleKey: 'blogBalletAdultos_title',      descKey: 'blogBalletAdultos_metaDescription',   ns: 'blog' },
  blogDanzaContemporaneaVsJazzBallet: { titleKey: 'blog_danzaContemporaneaVsJazzBallet_title', descKey: 'blog_danzaContemporaneaVsJazzBallet_metaDescription', ns: 'blog' },
  blogDanzasUrbanas:   { titleKey: 'blogDanzasUrbanas_title',      descKey: 'blogDanzasUrbanas_metaDescription',   ns: 'blog' },
  blogModernJazz:      { titleKey: 'blogModernJazz_title',         descKey: 'blogModernJazz_metaDescription',      ns: 'blog' },
  blogPerderMiedoBailar: { titleKey: 'blogPerderMiedoBailar_title', descKey: 'blogPerderMiedoBailar_metaDescription', ns: 'blog' },
  blogBaileSaludMental:{ titleKey: 'blogBaileSaludMental_title',   descKey: 'blogBaileSaludMental_metaDescription',ns: 'blog' },
  blogBachata:         { titleKey: 'blogBachata_title',            descKey: 'blogBachata_metaDescription',         ns: 'blog' },
  blogReggaeton:       { titleKey: 'blogReggaeton_title',          descKey: 'blogReggaeton_metaDescription',       ns: 'blog' },
  blogHeels:           { titleKey: 'blogHeels_title',              descKey: 'blogHeels_metaDescription',           ns: 'blog' },
  blogStretching:      { titleKey: 'blogStretching_title',         descKey: 'blogStretching_metaDescription',      ns: 'blog' },

  // ═══════════════════════════════════════════════════════════════
  // PROMO / LANDING PAGES
  // ═══════════════════════════════════════════════════════════════
  promoClaseGratis:    { titleKey: 'fbLandingPageTitle',           descKey: 'fbLandingPageDescription',            ns: 'pages' },
  promoSexyReggaeton:  { titleKey: 'sxrLandingPageTitle',          descKey: 'sxrLandingPageDescription',           ns: 'pages' },
};
