// Script to add missing translations to ca.ts and fr.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Catalan translations
const caTranslations = {
  // Home Categories - Bullets and Styles
  home_categories_danza_bullets:
    'Tècnica clàssica i contemporània, Ballet, Jazz, Afro Contemporani, Des de principiant fins a avançat',
  home_categories_danza_styles_afro_contemporaneo:
    'Fusió única de moviments afrocaribenyos amb tècnica contemporània',
  home_categories_danza_styles_afro_jazz:
    'Jazz amb arrels afrocaribenyos i tècnica cubana que et fa vibrar',
  home_categories_danza_styles_ballet:
    'Ballet clàssic amb metodologia cubana reconeguda internacionalment',
  home_categories_danza_styles_contemporaneo:
    'Tècnica lírica, treball de terra, improvisació i flow contemporani',
  home_categories_danza_styles_modern_jazz:
    'Jazz modern amb dinamisme, tècnica neta i personalitat escènica vibrant',
  home_categories_salsa_bullets:
    'Salsa Cubana, Bachata, Son, Timba, Lady Style, Mens Style, Des de principiant fins a avançat',
  home_categories_salsa_styles_bachata: 'Ball sensual caribeny que et connecta amb la teva parella',
  home_categories_salsa_styles_lady_style:
    'Tècnica femenina individual: girs, treball de braços, actitud femenina',
  home_categories_salsa_styles_salsa_cubana:
    'Salsa cubana autèntica amb sabor circular, alegre i social',
  home_categories_salsa_styles_son_cubano:
    'El pare de la salsa: elegant, clàssic i ple de tradició',
  home_categories_salsa_styles_timba:
    'Salsa cubana moderna: ràpida, enèrgica i plena d\'actitud explosiva',
  home_categories_urbano_bullets:
    'Hip Hop, Dancehall, Reggaeton, Twerk, Afrobeat, Heels, Des de principiant fins a avançat',
  home_categories_urbano_styles_afrobeat:
    'Energia africana pura amb ritmes de Ghana i Nigèria',
  home_categories_urbano_styles_dancehall:
    'L\'estil urbà més energètic nascut a Kingston, Jamaica',
  home_categories_urbano_styles_heels:
    'Tècnica femenina en talons que fusiona sensualitat i elegància',
  home_categories_urbano_styles_hip_hop:
    'La base de tots els balls urbans nascut al Bronx, Nova York',
  home_categories_urbano_styles_reggaeton:
    'Reggaeton autèntic de l\'Havana: flow cubà i sabor caribeny',
  home_categories_urbano_styles_twerk:
    'Enforteix i tonifica glutis amb tècnica real de twerk',

  // How It Works Section
  howItWorksTitle: 'Com Funcionen les Nostres Classes de Dancehall a Barcelona?',
  howItWorksIntro:
    'A les nostres classes de Dancehall a Barcelona generalment s\'ensenya una seqüència coreografiada, però a la pràctica el Dancehall és un ball improvisat.',
  howItWorksPillar1Title: 'Nivells per a TOTHOM',
  howItWorksPillar1Desc:
    'Des d\'iniciació fins a avançat. Cada alumne troba el seu espai per créixer al seu ritme, amb classes adaptades a cada nivell d\'experiència.',
  howItWorksPillar2Title: 'Metodologia CLARA',
  howItWorksPillar2Desc:
    'Contingut estructurat per facilitar l\'aprenentatge. Seguim un sistema progressiu que et permet avançar amb confiança i solidesa.',
  howItWorksPillar3Title: 'Estil AUTÈNTIC',
  howItWorksPillar3Desc:
    'Respectem les arrels i portem l\'essència jamaicana a cada classe. Coneixeràs el veritable esperit del Dancehall.',

  // Session Structure
  sessionStructureTitle: 'CADA SESSIÓ DURA 1 HORA I INCLOU:',
  sessionItem1Title: 'Escalfament',
  sessionItem1Desc:
    'Prepara el teu cos amb exercicis específics per evitar lesions i millorar la teva tècnica.',
  sessionItem2Title: 'Coreografia',
  sessionItem2Desc:
    'Aprèn seqüències dinàmiques que combinen passos tradicionals i moderns del Dancehall.',
  sessionItem3Title: 'Improvisació',
  sessionItem3Desc:
    'Treballem la improvisació per estimular les teves capacitats creatives perquè puguis portar el teu ball a un nivell informal, sensual i atrevit.',

  // General Dance Terms
  advancedLevelDesc: 'Pensat per a qui vol portar el seu nivell al màxim i el seu estil al següent nivell.',
  basedOn: 'basat en',
  basicIntermediateLevel: 'Bàsic/Intermedi',
  beginnerLevelDesc: 'Ideal per a estudiants que volen començar des de zero, aprenent pas a pas amb bon rotllo.',
  choreographyDesc: 'Aprèn seqüències dinàmiques que combinen passos tradicionals i moderns del Dancehall.',
  choreographyTitle: 'Coreografia',
  danceTechnique: 'Tècnica de Dansa',
  improvisationDesc:
    'Treballem la improvisació per estimular les teves capacitats creatives i portar el teu ball a un nivell informal, sensual i atrevit.',
  improvisationTitle: 'Improvisació',
  intermediateLevelDesc: 'Per a estudiants que volen millorar tècnica, coordinació i expressió amb passos més complexos.',
  reviews: 'ressenyes',
  thankYouForLove: 'Gràcies per Tant d\'Amor',
  trialClassCTA: 'Prova una Classe Gratuïta',
  warmupDesc: 'Prepara el teu cos amb exercicis específics per evitar lesions i millorar la teva tècnica.',
  warmupTitle: 'Escalfament',
  whatsappCTA: 'Escriu-nos per WhatsApp',

  // Facilities Page
  facilitiesPageTitle: 'Instal·lacions de Dansa a Barcelona | Estudis Professionals | Farray\'s Center',
  facilitiesMetaDescription:
    'Descobreix les nostres instal·lacions professionals de dansa de 700m² a Barcelona. 3 estudis amb terra flotant, vestidors, aire condicionat. 5 min de Plaça Espanya.',
  facilitiesH1: 'Les Nostres Instal·lacions de Dansa a Barcelona',
  facilitiesIntro:
    'A Farray\'s International Dance Center hem creat un espai dissenyat per i per a balladors. 700 m² d\'instal·lacions de primera classe al cor de Barcelona, entre Plaça Espanya i estació de Sants.',
  facilitiesRoom1Title: 'Estudi 1 - Sala Principal',
  facilitiesRoom1Desc:
    'El nostre estudi més gran (150m²) amb terra flotant professional, miralls complets, aire condicionat i sistema de so professional. Perfecte per a grups grans, workshops i esdeveniments.',
  facilitiesRoom2Title: 'Estudi 2 - Sala Versàtil',
  facilitiesRoom2Desc:
    'Estudi versàtil (80m²) ideal per a classes regulars, classes privades i assajos de grups reduïts. Equipat amb miralls, terra professional i A/C.',
  facilitiesRoom3Title: 'Estudi 3 - Sala Íntima',
  facilitiesRoom3Desc:
    'Estudi acollidor (50m²) perfecte per a classes privades, petits workshops i sessions de gravació. Equipament complet amb ambient íntim.',
  facilitiesAmenities: 'Comoditats Generals',
  facilitiesAmenity1: 'Vestidors amb taquilles',
  facilitiesAmenity2: 'Dutxes amb aigua calenta',
  facilitiesAmenity3: 'Aire condicionat a tots els estudis',
  facilitiesAmenity4: 'Sistemes de so professionals',
  facilitiesAmenity5: 'Miralls de paret completa',
  facilitiesAmenity6: 'Terres flotants professionals',
  facilitiesAmenity7: 'Àrea de descans amb màquines expenedores',
  facilitiesAmenity8: 'WiFi gratuït',
  facilitiesLocation: 'Ubicació Privilegiada',
  facilitiesLocationDesc:
    'Som al carrer Entença 100, Barcelona. A només 5 minuts caminant de Plaça Espanya (L1, L3) i estació de Sants. Fàcil accés en metro, autobús, tren i cotxe amb aparcament proper.',

  // Contemporaneo Stats
  contemporaneoTechniqueStat: 'Tècnica',
  contemporaneoEmpowerment: 'Expressió',
  contemporaneoConfidenceGuaranteed: 'Llenguatge propi garantit',
  contemporaneoCaloriesStat: 'Calories Cremades',
  contemporaneoDanceStat: 'Dansa',
  contemporaneoLevelsTitle: 'Quin tipus de Contemporani va amb tu?',
  contemporaneoLevelsSubtitle: 'Tres modalitats per a diferents objectius i sensibilitats',

  // CTA translations
  danceClassesHub_cta_member: 'Fes-te Soci Ara',
  danceClassesHub_cta_trial: 'Reserva la Teva Classe de Prova',

  // Gift Dance Page
  regalaBaile_page_title: 'Regala Ball | Vals d\'Experiència de Dansa | Farray\'s Center Barcelona',
  regalaBaile_meta_description:
    'Regala una experiència de ball inoblidable a Barcelona. Vals de classes de ball per a tots els nivells i estils. El regal original perfecte.',
  regalaBaile_benefit1_title: 'Regal Original i Memorable',
  regalaBaile_faq1_q: 'Com funciona el val regal de ball?',
};

// French translations
const frTranslations = {
  // Home Categories - Bullets and Styles
  home_categories_danza_bullets:
    'Technique classique et contemporaine, Ballet, Jazz, Afro Contemporain, Du débutant à avancé',
  home_categories_danza_styles_afro_contemporaneo:
    'Fusion unique de mouvements afro-caribéens avec technique contemporaine',
  home_categories_danza_styles_afro_jazz:
    'Jazz aux racines afro-caribéennes et technique cubaine qui vous fait vibrer',
  home_categories_danza_styles_ballet:
    'Ballet classique avec méthodologie cubaine reconnue internationalement',
  home_categories_danza_styles_contemporaneo:
    'Technique lyrique, travail au sol, improvisation et flow contemporain',
  home_categories_danza_styles_modern_jazz:
    'Jazz moderne avec dynamisme, technique propre et personnalité scénique vibrante',
  home_categories_salsa_bullets:
    'Salsa Cubaine, Bachata, Son, Timba, Lady Style, Mens Style, Du débutant à avancé',
  home_categories_salsa_styles_bachata: 'Danse sensuelle caribéenne qui vous connecte à votre partenaire',
  home_categories_salsa_styles_lady_style:
    'Technique féminine individuelle: tours, travail des bras, attitude féminine',
  home_categories_salsa_styles_salsa_cubana:
    'Salsa cubaine authentique avec saveur circulaire, joyeuse et sociale',
  home_categories_salsa_styles_son_cubano:
    'Le père de la salsa: élégant, classique et plein de tradition',
  home_categories_salsa_styles_timba:
    'Salsa cubaine moderne: rapide, énergique et pleine d\'attitude explosive',
  home_categories_urbano_bullets:
    'Hip Hop, Dancehall, Reggaeton, Twerk, Afrobeat, Heels, Du débutant à avancé',
  home_categories_urbano_styles_afrobeat:
    'Énergie africaine pure avec rythmes du Ghana et du Nigeria',
  home_categories_urbano_styles_dancehall:
    'Le style urbain le plus énergique né à Kingston, Jamaïque',
  home_categories_urbano_styles_heels:
    'Technique féminine en talons fusionnant sensualité et élégance',
  home_categories_urbano_styles_hip_hop:
    'La base de toutes les danses urbaines née dans le Bronx, New York',
  home_categories_urbano_styles_reggaeton:
    'Reggaeton authentique de La Havane: flow cubain et saveur caribéenne',
  home_categories_urbano_styles_twerk:
    'Renforcez et tonifiez les fessiers avec vraie technique de twerk',

  // How It Works Section
  howItWorksTitle: 'Comment Fonctionnent Nos Cours de Dancehall à Barcelone?',
  howItWorksIntro:
    'Dans nos cours de Dancehall à Barcelone, nous enseignons généralement une séquence chorégraphiée, mais en pratique le Dancehall est une danse improvisée.',
  howItWorksPillar1Title: 'Niveaux pour TOUS',
  howItWorksPillar1Desc:
    'De l\'initiation à avancé. Chaque élève trouve son espace pour grandir à son rythme, avec des cours adaptés à chaque niveau d\'expérience.',
  howItWorksPillar2Title: 'Méthodologie CLAIRE',
  howItWorksPillar2Desc:
    'Contenu structuré pour faciliter l\'apprentissage. Nous suivons un système progressif qui vous permet d\'avancer avec confiance et solidité.',
  howItWorksPillar3Title: 'Style AUTHENTIQUE',
  howItWorksPillar3Desc:
    'Nous respectons les racines et apportons l\'essence jamaïcaine à chaque cours. Vous connaîtrez le véritable esprit du Dancehall.',

  // Session Structure
  sessionStructureTitle: 'CHAQUE SESSION DURE 1 HEURE ET COMPREND:',
  sessionItem1Title: 'Échauffement',
  sessionItem1Desc:
    'Préparez votre corps avec des exercices spécifiques pour éviter les blessures et améliorer votre technique.',
  sessionItem2Title: 'Chorégraphie',
  sessionItem2Desc:
    'Apprenez des séquences dynamiques combinant pas traditionnels et modernes du Dancehall.',
  sessionItem3Title: 'Improvisation',
  sessionItem3Desc:
    'Nous travaillons l\'improvisation pour stimuler vos capacités créatives afin que vous puissiez amener votre danse à un niveau informel, sensuel et audacieux.',

  // General Dance Terms
  advancedLevelDesc: 'Conçu pour ceux qui veulent porter leur niveau au maximum et leur style au niveau supérieur.',
  basedOn: 'basé sur',
  basicIntermediateLevel: 'Basique/Intermédiaire',
  beginnerLevelDesc: 'Idéal pour les étudiants qui veulent commencer à zéro, apprenant pas à pas avec bonne humeur.',
  choreographyDesc: 'Apprenez des séquences dynamiques combinant pas traditionnels et modernes du Dancehall.',
  choreographyTitle: 'Chorégraphie',
  danceTechnique: 'Technique de Danse',
  improvisationDesc:
    'Nous travaillons l\'improvisation pour stimuler vos capacités créatives et amener votre danse à un niveau informel, sensuel et audacieux.',
  improvisationTitle: 'Improvisation',
  intermediateLevelDesc: 'Pour les étudiants qui veulent améliorer technique, coordination et expression avec des pas plus complexes.',
  reviews: 'avis',
  thankYouForLove: 'Merci pour Tant d\'Amour',
  trialClassCTA: 'Essayez un Cours Gratuit',
  warmupDesc: 'Préparez votre corps avec des exercices spécifiques pour éviter les blessures et améliorer votre technique.',
  warmupTitle: 'Échauffement',
  whatsappCTA: 'Écrivez-nous sur WhatsApp',

  // Facilities Page
  facilitiesPageTitle: 'Installations de Danse à Barcelone | Studios Professionnels | Farray\'s Center',
  facilitiesMetaDescription:
    'Découvrez nos installations de danse professionnelles de 700m² à Barcelone. 3 studios avec planchers flottants, vestiaires, climatisation. 5 min de Plaça Espanya.',
  facilitiesH1: 'Nos Installations de Danse à Barcelone',
  facilitiesIntro:
    'Chez Farray\'s International Dance Center, nous avons créé un espace conçu par et pour les danseurs. 700 m² d\'installations de première classe au cœur de Barcelone, entre Plaça Espanya et la gare de Sants.',
  facilitiesRoom1Title: 'Studio 1 - Salle Principale',
  facilitiesRoom1Desc:
    'Notre plus grand studio (150m²) avec plancher flottant professionnel, miroirs complets, climatisation et système de son professionnel. Parfait pour grands groupes, workshops et événements.',
  facilitiesRoom2Title: 'Studio 2 - Salle Polyvalente',
  facilitiesRoom2Desc:
    'Studio polyvalent (80m²) idéal pour cours réguliers, cours privés et répétitions de petits groupes. Équipé de miroirs, sol professionnel et climatisation.',
  facilitiesRoom3Title: 'Studio 3 - Salle Intime',
  facilitiesRoom3Desc:
    'Studio confortable (50m²) parfait pour cours privés, petits workshops et sessions d\'enregistrement. Équipement complet avec atmosphère intime.',
  facilitiesAmenities: 'Équipements Généraux',
  facilitiesAmenity1: 'Vestiaires avec casiers',
  facilitiesAmenity2: 'Douches chaudes',
  facilitiesAmenity3: 'Climatisation dans tous les studios',
  facilitiesAmenity4: 'Systèmes de son professionnels',
  facilitiesAmenity5: 'Miroirs pleine paroi',
  facilitiesAmenity6: 'Planchers flottants professionnels',
  facilitiesAmenity7: 'Espace détente avec distributeurs',
  facilitiesAmenity8: 'WiFi gratuit',
  facilitiesLocation: 'Emplacement Privilégié',
  facilitiesLocationDesc:
    'Nous sommes situés au Carrer Entença 100, Barcelone. À seulement 5 minutes à pied de Plaça Espanya (L1, L3) et de la gare de Sants. Accès facile en métro, bus, train et voiture avec parking proche.',

  // Contemporaneo Stats
  contemporaneoTechniqueStat: 'Technique',
  contemporaneoEmpowerment: 'Expression',
  contemporaneoConfidenceGuaranteed: 'Langage propre garanti',
  contemporaneoCaloriesStat: 'Calories Brûlées',
  contemporaneoDanceStat: 'Danse',
  contemporaneoLevelsTitle: 'Quel type de Contemporain vous convient?',
  contemporaneoLevelsSubtitle: 'Trois modalités pour différents objectifs et sensibilités',

  // CTA translations
  danceClassesHub_cta_member: 'Devenez Membre Maintenant',
  danceClassesHub_cta_trial: 'Réservez Votre Cours d\'Essai',

  // Gift Dance Page
  regalaBaile_page_title: 'Offrez la Danse | Bons Expérience Danse | Farray\'s Center Barcelone',
  regalaBaile_meta_description:
    'Offrez une expérience de danse inoubliable à Barcelone. Bons de cours de danse pour tous niveaux et styles. Le cadeau original parfait.',
  regalaBaile_benefit1_title: 'Cadeau Original et Mémorable',
  regalaBaile_faq1_q: 'Comment fonctionne le bon cadeau de danse?',
};

function addTranslationsToFile(filePath, translations, label) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check which keys are already present
  const existingKeys = new Set();
  const keyRegex = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
  let match;
  while ((match = keyRegex.exec(content)) !== null) {
    existingKeys.add(match[1]);
  }

  // Filter only keys that don't exist
  const keysToAdd = Object.entries(translations).filter(([key]) => !existingKeys.has(key));

  if (keysToAdd.length === 0) {
    console.log(`All keys already exist in ${label}!`);
    return 0;
  }

  console.log(`Found ${keysToAdd.length} missing keys to add to ${label}...`);

  // Generate the new translations string
  let newTranslations = `\n  // ===== ADDITIONAL ${label.toUpperCase()} TRANSLATIONS =====\n`;
  for (const [key, value] of keysToAdd) {
    // Escape single quotes in value
    const escapedValue = value.replace(/'/g, "\\'");
    newTranslations += `  ${key}: '${escapedValue}',\n`;
  }

  // Find the closing }; and insert before it
  const closingIndex = content.lastIndexOf('};');
  if (closingIndex === -1) {
    console.error(`Could not find closing }; in ${label}`);
    return 0;
  }

  content = content.slice(0, closingIndex) + newTranslations + content.slice(closingIndex);

  // Write back
  fs.writeFileSync(filePath, content, 'utf-8');

  console.log(`Successfully added ${keysToAdd.length} translations to ${label}!`);
  return keysToAdd.length;
}

// Process CA
const caPath = path.join(__dirname, '..', 'i18n', 'locales', 'ca.ts');
const caAdded = addTranslationsToFile(caPath, caTranslations, 'ca.ts');

// Process FR
const frPath = path.join(__dirname, '..', 'i18n', 'locales', 'fr.ts');
const frAdded = addTranslationsToFile(frPath, frTranslations, 'fr.ts');

console.log(`\nTotal: Added ${caAdded} to CA, ${frAdded} to FR`);
