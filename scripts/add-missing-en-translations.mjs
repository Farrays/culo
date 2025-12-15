// Script to add missing English translations to en.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const missingTranslations = {
  // Home Categories - Bullets and Styles
  home_categories_danza_bullets:
    'Classical and contemporary technique, Ballet, Jazz, Afro Contemporary, From beginner to advanced',
  home_categories_danza_styles_afro_contemporaneo:
    'Unique fusion of Afro-Caribbean movements with contemporary technique',
  home_categories_danza_styles_afro_jazz:
    'Jazz with Afro-Caribbean roots and Cuban technique that makes you vibrate',
  home_categories_danza_styles_ballet:
    'Classical ballet with internationally recognized Cuban methodology',
  home_categories_danza_styles_contemporaneo:
    'Lyrical technique, floor work, improvisation and contemporary flow',
  home_categories_danza_styles_modern_jazz:
    'Modern jazz with dynamism, clean technique and vibrant stage personality',
  home_categories_salsa_bullets:
    'Cuban Salsa, Bachata, Son, Timba, Lady Style, Mens Style, From beginner to advanced',
  home_categories_salsa_styles_bachata: 'Sensual Caribbean dance that connects you with your partner',
  home_categories_salsa_styles_lady_style:
    'Individual female technique: spins, arm work, feminine attitude',
  home_categories_salsa_styles_salsa_cubana:
    'Authentic Cuban salsa with circular flavor, joyful and social',
  home_categories_salsa_styles_son_cubano:
    'The father of salsa: elegant, classic and full of tradition',
  home_categories_salsa_styles_timba:
    'Modern Cuban salsa: fast, energetic and full of explosive attitude',
  home_categories_urbano_bullets:
    'Hip Hop, Dancehall, Reggaeton, Twerk, Afrobeat, Heels, From beginner to advanced',
  home_categories_urbano_styles_afrobeat:
    'Pure African energy with rhythms from Ghana and Nigeria',
  home_categories_urbano_styles_dancehall:
    'The most energetic urban style born in Kingston, Jamaica',
  home_categories_urbano_styles_heels:
    'Female technique in heels that fuses sensuality and elegance',
  home_categories_urbano_styles_hip_hop:
    'The base of all urban dances born in the Bronx, New York',
  home_categories_urbano_styles_reggaeton:
    'Authentic reggaeton from Havana: Cuban flow and Caribbean flavor',
  home_categories_urbano_styles_twerk:
    'Strengthen and tone glutes with real twerk technique',

  // Dance Classes Hub - Style Descriptions
  danceClassesHub_style_afro_contemporaneo_desc:
    'Unique fusion of Afro-Caribbean movements with contemporary technique, creating a rich and expressive dance language. Combines the energy and rhythm of Afro dances with the fluidity and freedom of contemporary. Develop your musicality, connection with the floor and stage presence through this vibrant and powerful blend.',
  danceClassesHub_style_afro_jazz_desc:
    'Jazz with Afro-Caribbean roots and Cuban technique that makes you vibrate from the first movement. Learn steps with African cultural influence, complex polyrhythms and dynamic movements. Ideal for those seeking jazz technique with flavor, tropical energy and authentic cultural expression.',
  danceClassesHub_style_ballet_clasico_desc:
    'Classical ballet with internationally recognized Cuban methodology. Impeccable technique, refined elegance and unique expressiveness that characterizes the Cuban School of Ballet. Learn fluid port de bras, rigorous barre work, clean turns and controlled jumps with teachers trained at the National School of Arts of Cuba.',
  danceClassesHub_style_danza_contemporanea_desc:
    'Explore your artistic expression with lyrical technique, floor work, improvisation and contemporary flow. Develop your organic movement vocabulary, emotional connection with music and bodily freedom. Classes combining Graham, Limón, release and contact techniques for dancers of all levels.',
  danceClassesHub_style_modern_jazz_desc:
    'Modern jazz with dynamism, clean technique and vibrant stage personality. Learn precise isolations, fluid level changes, controlled turns and fast sequences full of energy. Develop musicality, theatrical expression and stage presence with modern choreographies that fuse classical technique with contemporary aesthetics.',
  danceClassesHub_style_afrobeat_desc:
    'Pure African energy with rhythms from Ghana and Nigeria that make you vibrate from head to toe. Learn explosive movements of chest, shoulders and hips with contemporary afrobeats. Develop physical power, complex coordination and cultural connection while burning calories dancing to Burna Boy, Wizkid and Davido.',
  danceClassesHub_style_dancehall_desc:
    'The most energetic urban style born in Kingston, Jamaica, combining Caribbean flow with intense cardio and unstoppable attitude. Learn authentic steps like Wacky Dip, Willy Bounce, Log On and World Dance while developing hip groove, reggae musicality and stage presence. For all levels, from beginner to advanced.',
  danceClassesHub_style_femmology_heels_desc:
    'Female technique in heels that fuses sensuality, elegance and strength in every movement. Learn precise isolations, body control, hip isolations and stage presence while strengthening legs and core. Develop confidence, femininity and attitude with safe and professional heels technique.',
  danceClassesHub_style_hip_hop_desc:
    'The base of all urban dances born in the Bronx, New York. Learn the fundamentals of street dance: bounce, groove, isolations, popping, locking and old school. Develop your own flow, urban musicality and personal style with the authentic roots of Hip Hop.',
  danceClassesHub_style_hip_hop_reggaeton_desc:
    'Explosive fusion of American Hip Hop and Latin Reggaeton combining urban groove, bounce and Caribbean flow in one class. Develop versatility, intense cardio and complete rhythm while learning to fuse two urban worlds with technique, musicality and attitude.',
  danceClassesHub_style_reggaeton_cubano_desc:
    'Authentic reggaeton from Havana: Cuban flow, reparto, musicality and Caribbean flavor straight from Cuba. Learn the original essence of Cubatón with technique, clave, real hip movement and barrio attitude. Reggaeton as it was born in Havana solares.',
  danceClassesHub_style_sexy_reggaeton_desc:
    'Sensual reggaeton with female technique combining perreo, dembow and fluid hip movements. Develop sensuality with control, body confidence and urban Latin rhythm while toning glutes and core with Caribbean attitude and powerful femininity.',
  danceClassesHub_style_sexy_style_desc:
    'Urban femininity with attitude combining sensuality, strength and powerful stage presence. Learn heels technique, sensual isolations, hip control and sexy expression without losing respect. Develop elegance, confidence and authentic feminine expression.',
  danceClassesHub_style_twerk_desc:
    'Strengthen and tone glutes with real twerk technique. Beyond the cliché, learn precise isolations, selective muscle control, impact movements and controlled bounce. Demanding physical training that improves core strength, hip isolation and body self-esteem.',
  danceClassesHub_style_commercial_dance_desc:
    'Dance for music videos, advertising and social media that fuses Hip Hop, Jazz Funk and Heels with viral aesthetics. Learn polished choreographies, camera presence, commercial formations and professional performance technique. Perfect for aspiring professional dancers and content creators.',
  danceClassesHub_style_k_pop_desc:
    'Korean commercial dance with precision choreographies inspired by BTS, Blackpink, Stray Kids and your favorite groups. Learn perfect synchronization, group formations, facial details, characteristic gestures and K-Pop energy. Ideal for K-Pop lovers and Asian commercial dance.',
  danceClassesHub_style_heels_barcelona_desc:
    'Hub for heels dance classes in Barcelona: Femmology (dance therapy + elite technique with Yunaisy Farray) and Sexy Style (fun + expression with Yasmina Fernández). Learn to dance in heels safely, develop femininity, sensuality, posture and confidence. For all levels.',
  danceClassesHub_style_salsa_cubana_desc:
    'Authentic Cuban salsa with circular, joyful and social flavor. Learn Rueda de Casino, guapeo, traditional Cuban steps and partner connection with the original Havana technique. Perfect partner dance for parties, socials and international congresses. Learn to dance salsa with Cuban teachers trained in the real tradition.',
  danceClassesHub_style_bachata_desc:
    'Sensual Caribbean dance from the Dominican Republic that connects you with your partner through body waves, fluid movements and romantic rhythm. Learn partner connection, hip technique, smooth turns and bachata musicality. From traditional to modern sensual, for all levels.',
  danceClassesHub_style_timba_cubana_desc:
    'Modern Cuban salsa: fast, energetic and full of explosive attitude. Learn despelotes, vacilones, complex steps and advanced musicality with accelerated rhythm and unstoppable energy. The highest level of Cuban salsa for dancers seeking technical challenge and authentic flavor.',
  danceClassesHub_style_folklore_cubano_desc:
    'Deep Afro-Cuban roots: Rumba Guaguancó, Yambú, Columbia and ritual dances of the Orishas (Yemayá, Oshún, Changó). Learn the African body language in Cuba, percussion polyrhythms, floor movements and spiritual cultural connection with Yoruba and Bantú traditions.',
  danceClassesHub_style_salsa_lady_style_desc:
    "Individual female technique of Cuban salsa: multiple spins, fluid arm work, feminine attitude and powerful stage presence. Learn to shine alone on the floor without depending on a partner. Develop musicality, grace, spin speed and personal expression with authentic Cuban technique.",
  danceClassesHub_style_salsa_lady_timba_desc:
    'Lady Style with the explosive energy of modern Cuban Timba. Combines individual female technique with accelerated rhythm, despelotes, vacilones and unstoppable attitude. For advanced dancers seeking technical challenge, extreme speed and high-impact stage presence.',
  danceClassesHub_style_son_cubano_desc:
    'The father of salsa: elegant, classic and full of authentic Cuban tradition from the 40s-50s. Learn the original base of all Latin dances with traditional steps, refined elegance, classic partner connection and son montuno musicality. The pure essence of Cuban dance.',
  danceClassesHub_style_men_style_salsa_desc:
    'Individual male technique of Cuban salsa: complex footwork, leader attitude, powerful stage presence and advanced musicality. Learn to dance alone with impeccable technique, develop your own masculine style, master casino steps, despelotes and spins while improving your leading ability in partner.',
  danceClassesHub_style_otras_danzas_desc:
    'Explore unique dances from around the world and exotic styles that do not fit traditional categories. From African dances to experimental styles, special workshops and rotating classes of in-demand styles. Perfect for curious dancers looking to expand their movement vocabulary with unconventional dances.',
  danceClassesHub_style_salsa_bachata_desc:
    'Latin partner dances combining passion, rhythm and connection. Cuban salsa with authentic Caribbean flavor and Bachata with Dominican sensuality. Classes for all levels where you will learn technique, leading/following and musicality.',
  danceClassesHub_style_entrenamiento_desc:
    'Specific physical preparation for dancers. Strengthening, flexibility, endurance and injury prevention. The perfect complement to improve your performance in any dance style.',
  danceClassesHub_style_bum_bum_gluteos_desc:
    'Train and tone glutes in a fun way with vibrant Brazilian music. Combines specific glute exercises with Latin dance movements that strengthen, lift and sculpt while having fun. Fitness class oriented to dancers with functional exercises, squats, lunges and muscle resistance work.',
  danceClassesHub_style_bum_bum_fit_desc:
    'Complete body training combining muscle toning, cardio and flexibility with Latin rhythms. Work your entire body from glutes to core, arms and legs while dancing. Perfect for dancers looking to complement their technique with functional strength and cardiovascular endurance.',
  danceClassesHub_style_body_conditioning_desc:
    'Specific physical conditioning for dancers combining muscle strengthening, deep stretching and joint mobility. Develop functional strength in core, legs and arms, prevent injuries and improve your performance in any dance style. Sessions focused on physical preparation for professional dancers.',
  danceClassesHub_style_dance_barre_desc:
    'Ballet-inspired barre training combining classical technique with isometric toning exercises. Strengthen legs, glutes, core and arms while improving balance, posture and movement elegance. Perfect for dancers seeking controlled muscle strength with ballet aesthetics.',
  danceClassesHub_style_pilates_desc:
    'Pilates method oriented to dancers with focus on core control, postural alignment, flexibility and deep strength. Learn conscious breathing, powerhouse activation and controlled movements that improve your dance technique, prevent injuries and increase your body awareness. Mat sessions adapted to all levels.',
  danceClassesHub_style_kizomba_desc:
    'Sensual Angolan partner dance combining deep connection, fluid hip movements and intimate embrace with soft African music. Learn partner technique, leading/following, body waves and kizomba musicality. Perfect social dance for lovers of authentic connection and contemporary African rhythms.',
  danceClassesHub_style_semba_desc:
    'The father of Kizomba: traditional Angolan dance, joyful and festive with quick steps, jumps and dynamic spins. Learn the African essence of Angola with partner technique, semba musicality and traditional steps. Energetic social dance that connects you with authentic African roots before the kizomba fusion.',
  danceClassesHub_style_kompa_desc:
    'Sensual Haitian partner dance with slow Caribbean rhythm and hypnotic hip movements. Learn deep connection, partner technique, fluid body waves and kompa musicality with French Caribbean flavor. Similar to kizomba but with unique Haitian identity and characteristic rhythm.',
  danceClassesHub_style_flamenco_desc:
    'Passionate Andalusian art combining dance, singing and guitar with duende and intense emotional expression. Learn zapateado, braceo, palmas, flamenco spins and authentic flamenco attitude. Traditional Spanish technique with gypsy roots that develops leg strength, complex musicality and powerful stage presence.',
  danceClassesHub_style_sevillanas_desc:
    'Traditional Andalusian festive partner dance performed at fairs, pilgrimages and celebrations. Learn the four traditional coplas, elegant braceo, coordinated turns and partner technique with characteristic palm clapping. Spanish social dance perfect for parties, Feria de Abril and Andalusian celebrations.',
  danceClassesHub_style_telas_aereas_desc:
    'Circus aerial dance on suspended silk fabrics combining strength, flexibility, elegance and vertical acrobatics. Learn wraps, controlled drops, aerial figures and choreographic sequences suspended in the air. Develop full-body strength, confidence, aerial grace and artistic expression at heights.',
  danceClassesHub_style_acro_yoga_desc:
    'Fusion of yoga, acrobatics and Thai massage practiced in pairs or groups. Learn bases, flyers, aerial poses, acrobatic balance and body confidence while developing strength, flexibility and human connection. Playful practice combining fitness, body art and community.',
  danceClassesHub_cta_member: 'Become a Member Now',
  danceClassesHub_cta_trial: 'Book Your Trial Class',

  // How It Works Section
  howItWorksTitle: 'How Do Our Dancehall Classes in Barcelona Work?',
  howItWorksIntro:
    'In our Dancehall classes in Barcelona we generally teach a choreographed sequence, but in practice Dancehall is an improvised dance.',
  howItWorksPillar1Title: 'Levels for EVERYONE',
  howItWorksPillar1Desc:
    'From beginner to advanced. Every student finds their space to grow at their own pace, with classes adapted to each experience level.',
  howItWorksPillar2Title: 'CLEAR Methodology',
  howItWorksPillar2Desc:
    'Structured content to facilitate learning. We follow a progressive system that allows you to advance with confidence and solidity.',
  howItWorksPillar3Title: 'AUTHENTIC Style',
  howItWorksPillar3Desc:
    'We respect the roots and bring the Jamaican essence to every class. You will know the true spirit of Dancehall.',

  // Session Structure
  sessionStructureTitle: 'EACH SESSION LASTS 1 HOUR AND INCLUDES:',
  sessionItem1Title: 'Warm-up',
  sessionItem1Desc:
    'Prepare your body with specific exercises to avoid injuries and improve your technique.',
  sessionItem2Title: 'Choreography',
  sessionItem2Desc:
    'Learn dynamic sequences combining traditional and modern Dancehall steps.',
  sessionItem3Title: 'Improvisation',
  sessionItem3Desc:
    'We work on improvisation to stimulate your creative abilities so you can take your dance to an informal, sensual and daring level.',

  // General Dance Terms
  advancedLevelDesc: 'Designed for those who want to take their level to the maximum and their style to the next level.',
  basedOn: 'based on',
  basicIntermediateLevel: 'Basic/Intermediate',
  beginnerLevelDesc: 'Ideal for students who want to start from scratch, learning step by step with good vibes.',
  choreographyDesc: 'Learn dynamic sequences combining traditional and modern Dancehall steps.',
  choreographyTitle: 'Choreography',
  danceTechnique: 'Dance Technique',
  improvisationDesc:
    'We work on improvisation to stimulate your creative abilities and take your dance to an informal, sensual and daring level.',
  improvisationTitle: 'Improvisation',
  intermediateLevelDesc: 'For students who want to improve technique, coordination and expression with more complex steps.',
  reviews: 'reviews',
  thankYouForLove: 'Thank You For So Much Love',
  trialClassCTA: 'Try a Free Class',
  warmupDesc: 'Prepare your body with specific exercises to avoid injuries and improve your technique.',
  warmupTitle: 'Warm-up',
  whatsappCTA: 'Message Us on WhatsApp',

  // Facilities Page
  facilitiesPageTitle: "Dance Facilities in Barcelona | Professional Studios | Farray's Center",
  facilitiesMetaDescription:
    'Discover our 700m² professional dance facilities in Barcelona. 3 studios with sprung floors, changing rooms, air conditioning. 5 min from Plaza España.',
  facilitiesH1: 'Our Dance Facilities in Barcelona',
  facilitiesIntro:
    "At Farray's International Dance Center we have created a space designed by and for dancers. 700 m² of first-class facilities in the heart of Barcelona, between Plaza España and Sants station.",
  facilitiesRoom1Title: 'Studio 1 - Main Hall',
  facilitiesRoom1Desc:
    'Our largest studio (150m²) with professional sprung floor, full mirrors, air conditioning and professional sound system. Perfect for large groups, workshops and events.',
  facilitiesRoom2Title: 'Studio 2 - Versatile Hall',
  facilitiesRoom2Desc:
    'Versatile studio (80m²) ideal for regular classes, private lessons and small group rehearsals. Equipped with mirrors, professional flooring and A/C.',
  facilitiesRoom3Title: 'Studio 3 - Intimate Hall',
  facilitiesRoom3Desc:
    'Cozy studio (50m²) perfect for private classes, small workshops and recording sessions. Full equipment with intimate atmosphere.',
  facilitiesAmenities: 'General Amenities',
  facilitiesAmenity1: 'Changing rooms with lockers',
  facilitiesAmenity2: 'Hot showers',
  facilitiesAmenity3: 'Air conditioning in all studios',
  facilitiesAmenity4: 'Professional sound systems',
  facilitiesAmenity5: 'Full-wall mirrors',
  facilitiesAmenity6: 'Professional sprung floors',
  facilitiesAmenity7: 'Rest area with vending machines',
  facilitiesAmenity8: 'Free WiFi',
  facilitiesLocation: 'Privileged Location',
  facilitiesLocationDesc:
    'We are located at Calle Entença 100, Barcelona. Just 5 minutes walk from Plaza España (L1, L3) and Sants station. Easy access by metro, bus, train and car with nearby parking.',

  // Contemporaneo Stats
  contemporaneoTechniqueStat: 'Technique',
  contemporaneoEmpowerment: 'Expression',
  contemporaneoConfidenceGuaranteed: 'Own language guaranteed',
  contemporaneoCaloriesStat: 'Calories Burned',
  contemporaneoDanceStat: 'Dance',
  contemporaneoLevelsTitle: 'What type of Contemporary suits you?',
  contemporaneoLevelsSubtitle: 'Three modalities for different objectives and sensibilities',

  // Gift Dance Page
  regalaBaile_page_title: "Gift Dance | Dance Experience Vouchers | Farray's Center Barcelona",
  regalaBaile_meta_description:
    'Gift an unforgettable dance experience in Barcelona. Dance class vouchers for all levels and styles. The perfect original gift.',
  regalaBaile_benefit1_title: 'Original and Memorable Gift',
  regalaBaile_faq1_q: 'How does the dance gift voucher work?',
};

// Read current en.ts
const enPath = path.join(__dirname, '..', 'i18n', 'locales', 'en.ts');
let content = fs.readFileSync(enPath, 'utf-8');

// Check which keys are already present
const existingKeys = new Set();
const keyRegex = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
let match;
while ((match = keyRegex.exec(content)) !== null) {
  existingKeys.add(match[1]);
}

// Filter only keys that don't exist
const keysToAdd = Object.entries(missingTranslations).filter(([key]) => !existingKeys.has(key));

if (keysToAdd.length === 0) {
  console.log('All keys already exist in en.ts!');
  process.exit(0);
}

console.log(`Found ${keysToAdd.length} missing keys to add...`);

// Generate the new translations string
let newTranslations = '\n  // ===== ADDITIONAL TRANSLATIONS =====\n';
for (const [key, value] of keysToAdd) {
  // Escape single quotes in value
  const escapedValue = value.replace(/'/g, "\\'");
  newTranslations += `  ${key}: '${escapedValue}',\n`;
}

// Find the closing }; and insert before it
const closingIndex = content.lastIndexOf('};');
if (closingIndex === -1) {
  console.error('Could not find closing }; in en.ts');
  process.exit(1);
}

content = content.slice(0, closingIndex) + newTranslations + content.slice(closingIndex);

// Write back
fs.writeFileSync(enPath, content, 'utf-8');

console.log(`Successfully added ${keysToAdd.length} translations to en.ts!`);
console.log('Added keys:', keysToAdd.map(([k]) => k).join(', '));
