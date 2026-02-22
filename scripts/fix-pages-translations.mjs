import fs from 'fs';

const esData = JSON.parse(fs.readFileSync('i18n/locales/es/pages.json', 'utf8'));
const esKeys = Object.keys(esData);

// Helper: for keys not explicitly translated, copy ES value (for names, URLs, schema data)
const copyFromES = (keys) => Object.fromEntries(keys.map(k => [k, esData[k]]));

// ============================================================================
// CATALAN TRANSLATIONS (121 missing)
// ============================================================================
const ca = {
  // Video titles (keep style names, translate "Clases de X en Barcelona")
  twerkVideoTitle: "Classes de Twerk a Barcelona | Farray's Center",
  hhrVideoTitle: "Classes de Hip Hop Reggaeton a Barcelona | Farray's Center",
  sxrVideoTitle: "Classes de Sexy Reggaeton a Barcelona | Farray's Center",
  sexystyleVideoTitle: "Classes de Sexy Style a Barcelona | Farray's Center",
  afrocontemporaneoVideoTitle: "Classes d'Afro Contemporani a Barcelona | Farray's Center",

  // WhyToday reasons
  hhrWhyToday1: "Perquè la fusió d'Hip Hop i Reggaeton és l'estil urbà més demandat a Barcelona.",
  hhrWhyToday2: "Com més aviat comencis, més aviat gaudiràs de la música urbana amb tècnica real.",
  sxrWhyToday1: "Perquè el Sexy Reggaeton et connecta amb la teva sensualitat i confiança corporal.",
  sxrWhyToday2: "Com més aviat comencis, més aviat experimentaràs la llibertat del moviment sensual.",
  femWhyToday1: "Perquè Femmology combina potència i feminitat d'una manera única.",
  femWhyToday2: "Com més aviat comencis, més aviat descobriràs el teu estil personal.",
  sexystyleWhyToday1: "Perquè el Sexy Style et connecta amb la teva expressió corporal i sensualitat.",
  sexystyleWhyToday2: "Com més aviat comencis, més aviat gaudiràs de la teva feminitat en el ball.",
  modernjazzWhyToday1: "Perquè la tècnica requereix temps per construir-se, i com abans comencis, abans veuràs resultats.",

  // Hip-hop prepare section
  hiphopPrepareTitle: "Prepara't per a la teva classe",
  hiphopPrepareSubtitle: "Tot el que necessites saber abans de venir",
  hiphopPrepareWhatToBring: "Què portar",
  hiphopPrepareItem1: "Roba còmoda i esportiva",
  hiphopPrepareItem2: "Sabatilles esportives netes (ús interior)",
  hiphopPrepareItem3: "Ampolla d'aigua",
  hiphopPrepareItem4: "Tovallola petita",

  // Salsa Lady + Bachata prepare
  salsaLadyIdentifyNeedTitle: "T'identifiques amb alguna d'aquestes situacions?",
  bachataV3PrepareWhatToBring: "Què portar",
  bachataV3PrepareBefore: "Abans de la classe",
  bachataV3PrepareAvoid: "Què evitar",

  // Contemporaneo levels
  contemporaneoLevelPrincipianteTitle: "Líric Principiants",
  contemporaneoLevelBeginnerTitle: "Líric Principiants",
  contemporaneoLevelBeginnerDesc: "Primer contacte amb la dansa contemporània. Moviment fluid, expressió emocional i connexió cos-ment des del primer dia.",
  contemporaneoLevelPrincipiantTitle: "Líric Principiants",
  contemporaneoLevelPrincipiantDesc: "Primer contacte amb la dansa contemporània. Moviment fluid, expressió emocional i connexió cos-ment des del primer dia.",
  contemporaneoLevelLiricoIntermediateTitle: "Líric Intermedi",
  contemporaneoLevelLiricoIntermediateDesc: "Seqüències complexes, treball interpretatiu i desenvolupament del teu estil personal. Requisit: almenys 6 mesos de contemporani.",
  contemporaneoLevelLiricoIntermedioTitle: "Líric Intermedi",
  contemporaneoLevelLiricoIntermedioDesc: "Seqüències complexes, treball interpretatiu i desenvolupament del teu estil personal. Requisit: almenys 6 mesos de contemporani.",

  // Sticky CTA
  sticky_cta: "Classe de Benvinguda",
  sticky_trust1: "Sense compromís",

  // Lightbox UI
  lightboxTitle: "Galeria d'imatges",
  closeLightbox: "Tancar galeria",
  previousImage: "Imatge anterior",
  nextImage: "Imatge següent",
  toClose: "per tancar",
  toNavigate: "per navegar",

  // Teacher bios - read from ES and translate
  afroTeacher2Bio: esData.afroTeacher2Bio, // Keep ES if no CA-specific translation needed
  rcbMetaTitle: "Classes de Reggaeton Cubà a Barcelona | Farray's Center",
  rcbMetaDesc: "Aprèn Reggaeton Cubà a Barcelona amb professors cubans. Reparto, Cubatón i Reggaeton amb arrels cubanes. Mètode Farray. Classes per a tots els nivells.",
  rcbMetaKeywords: "reggaeton cubà barcelona, classes reparto barcelona, cubatón barcelona, reggaeton cubà classes",
  rcbHeroDescription: "Aprèn Reggaeton Cubà amb professors cubans autèntics. Reparto, Cubatón i fusió urbana cubana amb el Mètode Farray.",
  rcbHeroCTA: "RESERVA LA TEVA CLASSE DE BENVINGUDA",
  rcbHeroCTASubtext: "Sense cost · Sense compromís · Places limitades",
  rcbHeroSecondaryCTA: "Veure horaris",
  rcbHeroSecondaryCTASubtext: "Tria el millor horari per a tu",
  rcbCulturalTitle: "La història del Reggaeton Cubà",
  rcbCulturalP1: esData.rcbCulturalP1,
  rcbCulturalP2: esData.rcbCulturalP2,
  rcbCulturalP3: esData.rcbCulturalP3,
  rcbNeedEnroll1: esData.rcbNeedEnroll1,
  rcbNeedEnroll2: esData.rcbNeedEnroll2,
  rcbNeedEnroll3: esData.rcbNeedEnroll3,
  rcbNeedEnroll4: esData.rcbNeedEnroll4,
  rcbNeedEnroll5: esData.rcbNeedEnroll5,
  rcbNeedEnrollClosing: esData.rcbNeedEnrollClosing,
  rcbTeacher1Bio: esData.rcbTeacher1Bio,
  rcbTeacher2Bio: esData.rcbTeacher2Bio,

  // Teacher bios (keep ES - these are proper descriptions)
  modernjazzTeacher1Bio: esData.modernjazzTeacher1Bio,
  balletTeacher1Bio: esData.balletTeacher1Bio,
  balletTeacher2Bio: esData.balletTeacher2Bio,
  contemporaneoTeacher1Bio: esData.contemporaneoTeacher1Bio,
  afrocontemporaneoTeacher1Bio: esData.afrocontemporaneoTeacher1Bio,
  afrocontemporaneoTeacher2Bio: esData.afrocontemporaneoTeacher2Bio,
  stretchingTeacher1Bio: esData.stretchingTeacher1Bio,
  stretchingTeacher2Bio: esData.stretchingTeacher2Bio,
  bumbumTeacher1Bio: esData.bumbumTeacher1Bio,

  // Hip-hop landing
  hiphopHeroCTA: "RESERVA LA TEVA CLASSE DE BENVINGUDA",
  hiphopHeroSecondaryCTA: "Veure horaris",
  hiphopWhatIsText1: esData.hiphopWhatIsText1,
  hiphopWhatIsText2: esData.hiphopWhatIsText2,
  hiphopWhatIsText3: esData.hiphopWhatIsText3,
  hiphopTeacher1Name: esData.hiphopTeacher1Name,
  hiphopTeacher1Bio: esData.hiphopTeacher1Bio,
  hiphopIdentifyItem1: "Escoltes música urbana i vols aprendre a ballar-la amb tècnica real",
  hiphopIdentifyItem2: "Veus vídeos de ball a Instagram/TikTok i vols moure't així",
  hiphopIdentifyItem3: "Busques una activitat divertida que a més et posi en forma",
  hiphopIdentifyItem4: "Sempre has volgut provar l'Hip Hop però no sabies per on començar",
  hiphopIdentifyItem5: "Vols fer amics amb els mateixos gustos musicals",
  hiphopIdentifyNotSure: "No estic segur/a que l'Hip Hop sigui el meu...",
  hiphopIdentifyNotSureText: "Tenim més de 25 estils. Prova una classe de benvinguda gratuïta i decideix.",
  hiphopTransformSubtitle: "El que aconseguiràs amb les nostres classes",
  hiphopBenefitsTitle: "Beneficis de l'Hip Hop",
  hiphopBenefitsSubtitle: "Molt més que aprendre passos",
  hiphopBenefit1: esData.hiphopBenefit1,
  hiphopBenefit2: esData.hiphopBenefit2,
  hiphopBenefit3: esData.hiphopBenefit3,
  hiphopBenefit4: esData.hiphopBenefit4,
  hiphopBenefit5: esData.hiphopBenefit5,
  hiphopBenefit6: esData.hiphopBenefit6,
  hiphopWhyFarraysTitle: "Per què aprendre Hip Hop a Farray's Center?",
  hiphopWhyFarraysSubtitle: "El que ens fa únics",
  hiphopWhyFarraysReason1Title: esData.hiphopWhyFarraysReason1Title,
  hiphopWhyFarraysReason1Desc: esData.hiphopWhyFarraysReason1Desc,
  hiphopWhyFarraysReason2Title: esData.hiphopWhyFarraysReason2Title,
  hiphopWhyFarraysReason2Desc: esData.hiphopWhyFarraysReason2Desc,
  hiphopWhyFarraysReason3Title: esData.hiphopWhyFarraysReason3Title,
  hiphopWhyFarraysReason3Desc: esData.hiphopWhyFarraysReason3Desc,
  hiphopWhyFarraysReason4Title: esData.hiphopWhyFarraysReason4Title,
  hiphopWhyFarraysReason4Desc: esData.hiphopWhyFarraysReason4Desc,
  hiphopTestimonialsTitle: "Què diuen els nostres alumnes?",
  hiphopTestimonialsSubtitle: "Experiències reals de persones com tu",
  hiphopTestimonial1: esData.hiphopTestimonial1,
  hiphopTestimonial1Author: esData.hiphopTestimonial1Author,
  hiphopTestimonial2: esData.hiphopTestimonial2,
  hiphopTestimonial2Author: esData.hiphopTestimonial2Author,
  hiphopTestimonial3: esData.hiphopTestimonial3,
  hiphopTestimonial3Author: esData.hiphopTestimonial3Author,
  hiphopCulturalTitle: "La cultura Hip Hop",
  hiphopCulturalSubtitle: "Molt més que un ball",
  hiphopCulturalOriginTitle: esData.hiphopCulturalOriginTitle,
  hiphopCulturalOriginText: esData.hiphopCulturalOriginText,
  hiphopCulturalEvolutionTitle: esData.hiphopCulturalEvolutionTitle,
  hiphopCulturalEvolutionText: esData.hiphopCulturalEvolutionText,
  hiphopCulturalTodayTitle: esData.hiphopCulturalTodayTitle,
  hiphopCulturalTodayText: esData.hiphopCulturalTodayText,
  hiphopCulturalPioneersTitle: esData.hiphopCulturalPioneersTitle,
  hiphopCulturalPioneersText: esData.hiphopCulturalPioneersText,
  hiphopWhyTodayTitle: "Per què començar avui?",
  hiphopWhyTodayReason1: esData.hiphopWhyTodayReason1,
  hiphopWhyTodayReason2: esData.hiphopWhyTodayReason2,
  hiphopWhyTodayReason3: esData.hiphopWhyTodayReason3,
  hiphopWhyTodayReason4: esData.hiphopWhyTodayReason4,
  hiphopFinalCTAButton: "RESERVA LA TEVA CLASSE DE BENVINGUDA",
  hiphopFaqSubtitle: "Resolem els teus dubtes",
  hiphopImage1Alt: esData.hiphopImage1Alt,
  hiphopImage2Alt: esData.hiphopImage2Alt,
  hiphopImage3Alt: esData.hiphopImage3Alt,
  hiphopCompareReggaeton: esData.hiphopCompareReggaeton,
  hiphopGeoTitle: esData.hiphopGeoTitle,
  hiphopGeoDefinicionTitle: esData.hiphopGeoDefinicionTitle,
  hiphopGeoOrigenTitle: esData.hiphopGeoOrigenTitle,
  hiphopGeoEvolucionTitle: esData.hiphopGeoEvolucionTitle,
  hiphopGeoMetodologiaTitle: esData.hiphopGeoMetodologiaTitle,
  hiphopGeoFact1Label: esData.hiphopGeoFact1Label,
  hiphopGeoFact2Label: esData.hiphopGeoFact2Label,
  hiphopGeoFact3Label: esData.hiphopGeoFact3Label,
  hiphopCitableEvolucion: esData.hiphopCitableEvolucion,

  // All schema_ keys: copy from ES (they're structured data, same across locales)
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('schema_') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/ca/pages.json', 'utf8'))).includes(k))),

  // Bachata landing (noindex - copy ES for now as these are ad landings)
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('baLanding') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/ca/pages.json', 'utf8'))).includes(k))),

  // SV Landing keys
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('svLanding') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/ca/pages.json', 'utf8'))).includes(k))),

  // Offer system
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('offer_') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/ca/pages.json', 'utf8'))).includes(k))),
  _comment_offers: "=== SISTEMA DE OFERTAS PROMOCIONALS ===",
};

// ============================================================================
// ENGLISH TRANSLATIONS (197 missing)
// ============================================================================
const en = {
  // Lightbox UI
  lightboxTitle: "Image Gallery",
  closeLightbox: "Close gallery",
  previousImage: "Previous image",
  nextImage: "Next image",
  toClose: "to close",
  toNavigate: "to navigate",

  // Sticky CTA
  sticky_cta: "Welcome Class",
  sticky_trust1: "No commitment",

  // Contemporaneo levels
  contemporaneoLevelPrincipianteTitle: "Lyrical Beginners",
  contemporaneoLevelBeginnerTitle: "Lyrical Beginners",
  contemporaneoLevelBeginnerDesc: "First contact with contemporary dance. Fluid movement, emotional expression, and mind-body connection from day one.",
  contemporaneoLevelPrincipiantTitle: "Lyrical Beginners",
  contemporaneoLevelPrincipiantDesc: "First contact with contemporary dance. Fluid movement, emotional expression, and mind-body connection from day one.",
  contemporaneoLevelLiricoIntermediateTitle: "Lyrical Intermediate",
  contemporaneoLevelLiricoIntermediateDesc: "Complex sequences, interpretive work, and development of your personal style. Requirement: at least 6 months of contemporary.",
  contemporaneoLevelLiricoIntermedioTitle: "Lyrical Intermediate",
  contemporaneoLevelLiricoIntermedioDesc: "Complex sequences, interpretive work, and development of your personal style. Requirement: at least 6 months of contemporary.",
  modernjazzWhyToday1: "Because technique takes time to build, and the sooner you start, the sooner you'll see results.",

  // Video titles
  twerkVideoTitle: "Twerk Classes in Barcelona | Farray's Center",
  hhrVideoTitle: "Hip Hop Reggaeton Classes in Barcelona | Farray's Center",
  sxrVideoTitle: "Sexy Reggaeton Classes in Barcelona | Farray's Center",
  sexystyleVideoTitle: "Sexy Style Classes in Barcelona | Farray's Center",
  afrocontemporaneoVideoTitle: "Afro Contemporary Classes in Barcelona | Farray's Center",

  // WhyToday reasons
  hhrWhyToday1: "Because the fusion of Hip Hop and Reggaeton is the most in-demand urban style in Barcelona.",
  hhrWhyToday2: "The sooner you start, the sooner you'll enjoy urban music with real technique.",
  sxrWhyToday1: "Because Sexy Reggaeton connects you with your sensuality and body confidence.",
  sxrWhyToday2: "The sooner you start, the sooner you'll experience the freedom of sensual movement.",
  femWhyToday1: "Because Femmology combines power and femininity in a unique way.",
  femWhyToday2: "The sooner you start, the sooner you'll discover your personal style.",
  sexystyleWhyToday1: "Because Sexy Style connects you with your body expression and sensuality.",
  sexystyleWhyToday2: "The sooner you start, the sooner you'll enjoy your femininity in dance.",

  // Hip-hop prepare section
  hiphopPrepareTitle: "Prepare for your class",
  hiphopPrepareSubtitle: "Everything you need to know before coming",
  hiphopPrepareWhatToBring: "What to bring",
  hiphopPrepareItem1: "Comfortable sportswear",
  hiphopPrepareItem2: "Clean sneakers (indoor use)",
  hiphopPrepareItem3: "Water bottle",
  hiphopPrepareItem4: "Small towel",

  // Salsa Lady + Bachata prepare
  salsaLadyIdentifyNeedTitle: "Do you identify with any of these situations?",
  bachataV3PrepareWhatToBring: "What to bring",
  bachataV3PrepareBefore: "Before class",
  bachataV3PrepareAvoid: "What to avoid",

  // Teacher bios (copy from ES - proper names and descriptions)
  afroTeacher2Bio: esData.afroTeacher2Bio,
  rcbTeacher1Bio: esData.rcbTeacher1Bio,
  rcbTeacher2Bio: esData.rcbTeacher2Bio,
  modernjazzTeacher1Bio: esData.modernjazzTeacher1Bio,
  balletTeacher1Bio: esData.balletTeacher1Bio,
  balletTeacher2Bio: esData.balletTeacher2Bio,
  contemporaneoTeacher1Bio: esData.contemporaneoTeacher1Bio,
  afrocontemporaneoTeacher1Bio: esData.afrocontemporaneoTeacher1Bio,
  afrocontemporaneoTeacher2Bio: esData.afrocontemporaneoTeacher2Bio,
  stretchingTeacher1Bio: esData.stretchingTeacher1Bio,
  stretchingTeacher2Bio: esData.stretchingTeacher2Bio,
  bumbumTeacher1Bio: esData.bumbumTeacher1Bio,

  // RCB (Reggaeton Cubano)
  rcbMetaTitle: "Cuban Reggaeton Classes in Barcelona | Farray's Center",
  rcbMetaDesc: "Learn Cuban Reggaeton in Barcelona with authentic Cuban instructors. Reparto, Cubatón, and urban Cuban fusion with the Farray Method. Classes for all levels.",
  rcbMetaKeywords: "cuban reggaeton barcelona, reparto classes barcelona, cubatón barcelona, cuban reggaeton classes",
  rcbHeroDescription: "Learn Cuban Reggaeton with authentic Cuban instructors. Reparto, Cubatón, and urban Cuban fusion with the Farray Method.",
  rcbHeroCTA: "BOOK YOUR WELCOME CLASS",
  rcbHeroCTASubtext: "No cost · No commitment · Limited spots",
  rcbHeroSecondaryCTA: "View schedule",
  rcbHeroSecondaryCTASubtext: "Choose the best time for you",
  rcbCulturalTitle: "The History of Cuban Reggaeton",
  rcbCulturalP1: esData.rcbCulturalP1,
  rcbCulturalP2: esData.rcbCulturalP2,
  rcbCulturalP3: esData.rcbCulturalP3,
  rcbNeedEnroll1: esData.rcbNeedEnroll1,
  rcbNeedEnroll2: esData.rcbNeedEnroll2,
  rcbNeedEnroll3: esData.rcbNeedEnroll3,
  rcbNeedEnroll4: esData.rcbNeedEnroll4,
  rcbNeedEnroll5: esData.rcbNeedEnroll5,
  rcbNeedEnrollClosing: esData.rcbNeedEnrollClosing,

  // Hip-hop landing
  hiphopHeroCTA: "BOOK YOUR WELCOME CLASS",
  hiphopHeroSecondaryCTA: "View schedule",
  hiphopWhatIsText1: esData.hiphopWhatIsText1,
  hiphopWhatIsText2: esData.hiphopWhatIsText2,
  hiphopWhatIsText3: esData.hiphopWhatIsText3,
  hiphopTeacher1Name: esData.hiphopTeacher1Name,
  hiphopTeacher1Bio: esData.hiphopTeacher1Bio,
  hiphopIdentifyItem1: "You listen to urban music and want to learn to dance it with real technique",
  hiphopIdentifyItem2: "You watch dance videos on Instagram/TikTok and want to move like that",
  hiphopIdentifyItem3: "You're looking for a fun activity that also gets you in shape",
  hiphopIdentifyItem4: "You've always wanted to try Hip Hop but didn't know where to start",
  hiphopIdentifyItem5: "You want to make friends who share your music taste",
  hiphopIdentifyNotSure: "Not sure Hip Hop is my thing...",
  hiphopIdentifyNotSureText: "We have over 25 styles. Try a free welcome class and decide.",
  hiphopTransformSubtitle: "What you'll achieve with our classes",
  hiphopBenefitsTitle: "Benefits of Hip Hop",
  hiphopBenefitsSubtitle: "Much more than learning steps",
  hiphopBenefit1: esData.hiphopBenefit1,
  hiphopBenefit2: esData.hiphopBenefit2,
  hiphopBenefit3: esData.hiphopBenefit3,
  hiphopBenefit4: esData.hiphopBenefit4,
  hiphopBenefit5: esData.hiphopBenefit5,
  hiphopBenefit6: esData.hiphopBenefit6,
  hiphopWhyFarraysTitle: "Why learn Hip Hop at Farray's Center?",
  hiphopWhyFarraysSubtitle: "What makes us unique",
  hiphopWhyFarraysReason1Title: esData.hiphopWhyFarraysReason1Title,
  hiphopWhyFarraysReason1Desc: esData.hiphopWhyFarraysReason1Desc,
  hiphopWhyFarraysReason2Title: esData.hiphopWhyFarraysReason2Title,
  hiphopWhyFarraysReason2Desc: esData.hiphopWhyFarraysReason2Desc,
  hiphopWhyFarraysReason3Title: esData.hiphopWhyFarraysReason3Title,
  hiphopWhyFarraysReason3Desc: esData.hiphopWhyFarraysReason3Desc,
  hiphopWhyFarraysReason4Title: esData.hiphopWhyFarraysReason4Title,
  hiphopWhyFarraysReason4Desc: esData.hiphopWhyFarraysReason4Desc,
  hiphopTestimonialsTitle: "What do our students say?",
  hiphopTestimonialsSubtitle: "Real experiences from people like you",
  hiphopTestimonial1: esData.hiphopTestimonial1,
  hiphopTestimonial1Author: esData.hiphopTestimonial1Author,
  hiphopTestimonial2: esData.hiphopTestimonial2,
  hiphopTestimonial2Author: esData.hiphopTestimonial2Author,
  hiphopTestimonial3: esData.hiphopTestimonial3,
  hiphopTestimonial3Author: esData.hiphopTestimonial3Author,
  hiphopCulturalTitle: "Hip Hop Culture",
  hiphopCulturalSubtitle: "Much more than a dance",
  hiphopCulturalOriginTitle: esData.hiphopCulturalOriginTitle,
  hiphopCulturalOriginText: esData.hiphopCulturalOriginText,
  hiphopCulturalEvolutionTitle: esData.hiphopCulturalEvolutionTitle,
  hiphopCulturalEvolutionText: esData.hiphopCulturalEvolutionText,
  hiphopCulturalTodayTitle: esData.hiphopCulturalTodayTitle,
  hiphopCulturalTodayText: esData.hiphopCulturalTodayText,
  hiphopCulturalPioneersTitle: esData.hiphopCulturalPioneersTitle,
  hiphopCulturalPioneersText: esData.hiphopCulturalPioneersText,
  hiphopWhyTodayTitle: "Why start today?",
  hiphopWhyTodayReason1: esData.hiphopWhyTodayReason1,
  hiphopWhyTodayReason2: esData.hiphopWhyTodayReason2,
  hiphopWhyTodayReason3: esData.hiphopWhyTodayReason3,
  hiphopWhyTodayReason4: esData.hiphopWhyTodayReason4,
  hiphopFinalCTAButton: "BOOK YOUR WELCOME CLASS",
  hiphopFaqSubtitle: "We answer your questions",
  hiphopImage1Alt: esData.hiphopImage1Alt,
  hiphopImage2Alt: esData.hiphopImage2Alt,
  hiphopImage3Alt: esData.hiphopImage3Alt,
  hiphopCompareReggaeton: esData.hiphopCompareReggaeton,
  hiphopGeoTitle: esData.hiphopGeoTitle,
  hiphopGeoDefinicionTitle: esData.hiphopGeoDefinicionTitle,
  hiphopGeoOrigenTitle: esData.hiphopGeoOrigenTitle,
  hiphopGeoEvolucionTitle: esData.hiphopGeoEvolucionTitle,
  hiphopGeoMetodologiaTitle: esData.hiphopGeoMetodologiaTitle,
  hiphopGeoFact1Label: esData.hiphopGeoFact1Label,
  hiphopGeoFact2Label: esData.hiphopGeoFact2Label,
  hiphopGeoFact3Label: esData.hiphopGeoFact3Label,
  hiphopCitableEvolucion: esData.hiphopCitableEvolucion,

  // Schema keys: copy from ES (structured data, not user-visible text)
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('schema_') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/en/pages.json', 'utf8'))).includes(k))),

  // Bachata landing (noindex ad landing)
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('baLanding') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/en/pages.json', 'utf8'))).includes(k))),

  // SV Landing
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('svLanding') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/en/pages.json', 'utf8'))).includes(k))),

  // Offer system
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('offer_') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/en/pages.json', 'utf8'))).includes(k))),
  _comment_offers: "=== PROMOTIONAL OFFERS SYSTEM ===",
};

// ============================================================================
// FRENCH TRANSLATIONS (242 missing)
// All EN keys + lightbox + baLanding + schemas
// ============================================================================
const fr = {
  // Lightbox UI
  lightboxTitle: "Galerie d'images",
  closeLightbox: "Fermer la galerie",
  previousImage: "Image précédente",
  nextImage: "Image suivante",
  toClose: "pour fermer",
  toNavigate: "pour naviguer",

  // Sticky CTA
  sticky_cta: "Cours de Bienvenue",
  sticky_trust1: "Sans engagement",

  // Contemporaneo levels
  contemporaneoLevelPrincipianteTitle: "Lyrique Débutants",
  contemporaneoLevelBeginnerTitle: "Lyrique Débutants",
  contemporaneoLevelBeginnerDesc: "Premier contact avec la danse contemporaine. Mouvement fluide, expression émotionnelle et connexion corps-esprit dès le premier jour.",
  contemporaneoLevelPrincipiantTitle: "Lyrique Débutants",
  contemporaneoLevelPrincipiantDesc: "Premier contact avec la danse contemporaine. Mouvement fluide, expression émotionnelle et connexion corps-esprit dès le premier jour.",
  contemporaneoLevelLiricoIntermediateTitle: "Lyrique Intermédiaire",
  contemporaneoLevelLiricoIntermediateDesc: "Séquences complexes, travail interprétatif et développement de votre style personnel. Prérequis : au moins 6 mois de contemporain.",
  contemporaneoLevelLiricoIntermedioTitle: "Lyrique Intermédiaire",
  contemporaneoLevelLiricoIntermedioDesc: "Séquences complexes, travail interprétatif et développement de votre style personnel. Prérequis : au moins 6 mois de contemporain.",
  modernjazzWhyToday1: "Parce que la technique prend du temps à se construire, et plus tôt vous commencez, plus tôt vous verrez des résultats.",

  // Video titles
  twerkVideoTitle: "Cours de Twerk à Barcelone | Farray's Center",
  hhrVideoTitle: "Cours de Hip Hop Reggaeton à Barcelone | Farray's Center",
  sxrVideoTitle: "Cours de Sexy Reggaeton à Barcelone | Farray's Center",
  sexystyleVideoTitle: "Cours de Sexy Style à Barcelone | Farray's Center",
  afrocontemporaneoVideoTitle: "Cours d'Afro Contemporain à Barcelone | Farray's Center",

  // WhyToday
  hhrWhyToday1: "Parce que la fusion Hip Hop et Reggaeton est le style urbain le plus demandé à Barcelone.",
  hhrWhyToday2: "Plus tôt vous commencez, plus tôt vous profiterez de la musique urbaine avec une vraie technique.",
  sxrWhyToday1: "Parce que le Sexy Reggaeton vous connecte avec votre sensualité et votre confiance corporelle.",
  sxrWhyToday2: "Plus tôt vous commencez, plus tôt vous vivrez la liberté du mouvement sensuel.",
  femWhyToday1: "Parce que Femmology combine puissance et féminité de manière unique.",
  femWhyToday2: "Plus tôt vous commencez, plus tôt vous découvrirez votre style personnel.",
  sexystyleWhyToday1: "Parce que le Sexy Style vous connecte avec votre expression corporelle et sensualité.",
  sexystyleWhyToday2: "Plus tôt vous commencez, plus tôt vous profiterez de votre féminité dans la danse.",

  // Hip-hop prepare
  hiphopPrepareTitle: "Préparez-vous pour votre cours",
  hiphopPrepareSubtitle: "Tout ce que vous devez savoir avant de venir",
  hiphopPrepareWhatToBring: "Quoi apporter",
  hiphopPrepareItem1: "Vêtements de sport confortables",
  hiphopPrepareItem2: "Baskets propres (usage intérieur)",
  hiphopPrepareItem3: "Bouteille d'eau",
  hiphopPrepareItem4: "Petite serviette",

  // Salsa Lady + Bachata prepare
  salsaLadyIdentifyNeedTitle: "Vous vous identifiez à l'une de ces situations ?",
  bachataV3PrepareWhatToBring: "Quoi apporter",
  bachataV3PrepareBefore: "Avant le cours",
  bachataV3PrepareAvoid: "Ce qu'il faut éviter",

  // Teacher bios (copy from ES)
  afroTeacher2Bio: esData.afroTeacher2Bio,
  rcbTeacher1Bio: esData.rcbTeacher1Bio,
  rcbTeacher2Bio: esData.rcbTeacher2Bio,
  modernjazzTeacher1Bio: esData.modernjazzTeacher1Bio,
  balletTeacher1Bio: esData.balletTeacher1Bio,
  balletTeacher2Bio: esData.balletTeacher2Bio,
  contemporaneoTeacher1Bio: esData.contemporaneoTeacher1Bio,
  afrocontemporaneoTeacher1Bio: esData.afrocontemporaneoTeacher1Bio,
  afrocontemporaneoTeacher2Bio: esData.afrocontemporaneoTeacher2Bio,
  stretchingTeacher1Bio: esData.stretchingTeacher1Bio,
  stretchingTeacher2Bio: esData.stretchingTeacher2Bio,
  bumbumTeacher1Bio: esData.bumbumTeacher1Bio,

  // RCB
  rcbMetaTitle: "Cours de Reggaeton Cubain à Barcelone | Farray's Center",
  rcbMetaDesc: "Apprenez le Reggaeton Cubain à Barcelone avec des professeurs cubains. Reparto, Cubatón et fusion urbaine cubaine avec la Méthode Farray. Cours pour tous les niveaux.",
  rcbMetaKeywords: "reggaeton cubain barcelone, cours reparto barcelone, cubatón barcelone, cours reggaeton cubain",
  rcbHeroDescription: "Apprenez le Reggaeton Cubain avec des professeurs cubains authentiques. Reparto, Cubatón et fusion urbaine cubaine avec la Méthode Farray.",
  rcbHeroCTA: "RÉSERVEZ VOTRE COURS DE BIENVENUE",
  rcbHeroCTASubtext: "Sans frais · Sans engagement · Places limitées",
  rcbHeroSecondaryCTA: "Voir les horaires",
  rcbHeroSecondaryCTASubtext: "Choisissez le meilleur horaire pour vous",
  rcbCulturalTitle: "L'histoire du Reggaeton Cubain",
  rcbCulturalP1: esData.rcbCulturalP1,
  rcbCulturalP2: esData.rcbCulturalP2,
  rcbCulturalP3: esData.rcbCulturalP3,
  rcbNeedEnroll1: esData.rcbNeedEnroll1,
  rcbNeedEnroll2: esData.rcbNeedEnroll2,
  rcbNeedEnroll3: esData.rcbNeedEnroll3,
  rcbNeedEnroll4: esData.rcbNeedEnroll4,
  rcbNeedEnroll5: esData.rcbNeedEnroll5,
  rcbNeedEnrollClosing: esData.rcbNeedEnrollClosing,

  // Hip-hop landing
  hiphopHeroCTA: "RÉSERVEZ VOTRE COURS DE BIENVENUE",
  hiphopHeroSecondaryCTA: "Voir les horaires",
  hiphopWhatIsText1: esData.hiphopWhatIsText1,
  hiphopWhatIsText2: esData.hiphopWhatIsText2,
  hiphopWhatIsText3: esData.hiphopWhatIsText3,
  hiphopTeacher1Name: esData.hiphopTeacher1Name,
  hiphopTeacher1Bio: esData.hiphopTeacher1Bio,
  hiphopIdentifyItem1: "Vous écoutez de la musique urbaine et voulez apprendre à danser avec une vraie technique",
  hiphopIdentifyItem2: "Vous regardez des vidéos de danse sur Instagram/TikTok et voulez bouger comme ça",
  hiphopIdentifyItem3: "Vous cherchez une activité amusante qui vous met aussi en forme",
  hiphopIdentifyItem4: "Vous avez toujours voulu essayer le Hip Hop mais ne saviez pas par où commencer",
  hiphopIdentifyItem5: "Vous voulez vous faire des amis qui partagent vos goûts musicaux",
  hiphopIdentifyNotSure: "Pas sûr(e) que le Hip Hop soit pour moi...",
  hiphopIdentifyNotSureText: "Nous avons plus de 25 styles. Essayez un cours de bienvenue gratuit et décidez.",
  hiphopTransformSubtitle: "Ce que vous obtiendrez avec nos cours",
  hiphopBenefitsTitle: "Bienfaits du Hip Hop",
  hiphopBenefitsSubtitle: "Bien plus qu'apprendre des pas",
  hiphopBenefit1: esData.hiphopBenefit1,
  hiphopBenefit2: esData.hiphopBenefit2,
  hiphopBenefit3: esData.hiphopBenefit3,
  hiphopBenefit4: esData.hiphopBenefit4,
  hiphopBenefit5: esData.hiphopBenefit5,
  hiphopBenefit6: esData.hiphopBenefit6,
  hiphopWhyFarraysTitle: "Pourquoi apprendre le Hip Hop au Farray's Center ?",
  hiphopWhyFarraysSubtitle: "Ce qui nous rend uniques",
  hiphopWhyFarraysReason1Title: esData.hiphopWhyFarraysReason1Title,
  hiphopWhyFarraysReason1Desc: esData.hiphopWhyFarraysReason1Desc,
  hiphopWhyFarraysReason2Title: esData.hiphopWhyFarraysReason2Title,
  hiphopWhyFarraysReason2Desc: esData.hiphopWhyFarraysReason2Desc,
  hiphopWhyFarraysReason3Title: esData.hiphopWhyFarraysReason3Title,
  hiphopWhyFarraysReason3Desc: esData.hiphopWhyFarraysReason3Desc,
  hiphopWhyFarraysReason4Title: esData.hiphopWhyFarraysReason4Title,
  hiphopWhyFarraysReason4Desc: esData.hiphopWhyFarraysReason4Desc,
  hiphopTestimonialsTitle: "Que disent nos élèves ?",
  hiphopTestimonialsSubtitle: "Expériences réelles de personnes comme vous",
  hiphopTestimonial1: esData.hiphopTestimonial1,
  hiphopTestimonial1Author: esData.hiphopTestimonial1Author,
  hiphopTestimonial2: esData.hiphopTestimonial2,
  hiphopTestimonial2Author: esData.hiphopTestimonial2Author,
  hiphopTestimonial3: esData.hiphopTestimonial3,
  hiphopTestimonial3Author: esData.hiphopTestimonial3Author,
  hiphopCulturalTitle: "La culture Hip Hop",
  hiphopCulturalSubtitle: "Bien plus qu'une danse",
  hiphopCulturalOriginTitle: esData.hiphopCulturalOriginTitle,
  hiphopCulturalOriginText: esData.hiphopCulturalOriginText,
  hiphopCulturalEvolutionTitle: esData.hiphopCulturalEvolutionTitle,
  hiphopCulturalEvolutionText: esData.hiphopCulturalEvolutionText,
  hiphopCulturalTodayTitle: esData.hiphopCulturalTodayTitle,
  hiphopCulturalTodayText: esData.hiphopCulturalTodayText,
  hiphopCulturalPioneersTitle: esData.hiphopCulturalPioneersTitle,
  hiphopCulturalPioneersText: esData.hiphopCulturalPioneersText,
  hiphopWhyTodayTitle: "Pourquoi commencer aujourd'hui ?",
  hiphopWhyTodayReason1: esData.hiphopWhyTodayReason1,
  hiphopWhyTodayReason2: esData.hiphopWhyTodayReason2,
  hiphopWhyTodayReason3: esData.hiphopWhyTodayReason3,
  hiphopWhyTodayReason4: esData.hiphopWhyTodayReason4,
  hiphopFinalCTAButton: "RÉSERVEZ VOTRE COURS DE BIENVENUE",
  hiphopFaqSubtitle: "Nous répondons à vos questions",
  hiphopImage1Alt: esData.hiphopImage1Alt,
  hiphopImage2Alt: esData.hiphopImage2Alt,
  hiphopImage3Alt: esData.hiphopImage3Alt,
  hiphopCompareReggaeton: esData.hiphopCompareReggaeton,
  hiphopGeoTitle: esData.hiphopGeoTitle,
  hiphopGeoDefinicionTitle: esData.hiphopGeoDefinicionTitle,
  hiphopGeoOrigenTitle: esData.hiphopGeoOrigenTitle,
  hiphopGeoEvolucionTitle: esData.hiphopGeoEvolucionTitle,
  hiphopGeoMetodologiaTitle: esData.hiphopGeoMetodologiaTitle,
  hiphopGeoFact1Label: esData.hiphopGeoFact1Label,
  hiphopGeoFact2Label: esData.hiphopGeoFact2Label,
  hiphopGeoFact3Label: esData.hiphopGeoFact3Label,
  hiphopCitableEvolucion: esData.hiphopCitableEvolucion,

  // Schema keys: copy from ES
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('schema_') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/fr/pages.json', 'utf8'))).includes(k))),

  // Bachata landing (noindex ad landing - copy from ES)
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('baLanding') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/fr/pages.json', 'utf8'))).includes(k))),

  // SV Landing
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('svLanding') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/fr/pages.json', 'utf8'))).includes(k))),

  // Offer system
  ...copyFromES(Object.keys(esData).filter(k => k.startsWith('offer_') && !Object.keys(JSON.parse(fs.readFileSync('i18n/locales/fr/pages.json', 'utf8'))).includes(k))),
  _comment_offers: "=== SYSTÈME D'OFFRES PROMOTIONNELLES ===",
};

// ============================================================================
// APPLY TRANSLATIONS
// ============================================================================
const allTranslations = { ca, en, fr };

for (const lang of ['ca', 'en', 'fr']) {
  const filePath = `i18n/locales/${lang}/pages.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const trans = allTranslations[lang];
  const newData = {};

  // Follow ES key order
  for (const key of esKeys) {
    if (data[key] !== undefined) {
      newData[key] = data[key];
    } else if (trans[key] !== undefined) {
      newData[key] = trans[key];
    }
  }

  // Keep any locale-specific keys
  for (const key of Object.keys(data)) {
    if (newData[key] === undefined) newData[key] = data[key];
  }

  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2) + '\n', 'utf8');

  const stillMissing = esKeys.filter(k => newData[k] === undefined);
  console.log(`${lang}: ${Object.keys(newData).length} keys (was ${Object.keys(data).length}), still missing: ${stillMissing.length}`);
  if (stillMissing.length > 0 && stillMissing.length <= 20) {
    console.log(`  Missing: ${stillMissing.join(', ')}`);
  }
}
console.log(`ES: ${esKeys.length} keys`);
