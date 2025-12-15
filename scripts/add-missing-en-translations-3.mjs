// Script to add more missing English translations to en.ts (Part 3 - Dancehall, Private Classes, Room Rental, Salsa)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const missingTranslations = {
  // Dancehall Page - Full translations
  dancehallPageTitle: "Dancehall Classes in Barcelona | Farray's International Dance Center",
  dancehallHeroTitle: 'Unleash the Fire: Dancehall in Barcelona',
  dancehallHeroSubtitle: "Experience the authentic energy and culture of Jamaican Dancehall. It's not just a class, it's a movement.",
  dancehallAboutTitle: 'What is Dancehall?',
  dancehallAboutDesc1: "Born in the vibrant streets of Kingston, Jamaica, Dancehall is more than a dance style: it's a cultural phenomenon. It's the rhythm of the people, a form of expression that embodies attitude, community and pure energy. From 'old school' steps to the latest 'new school' trends, Dancehall is constantly evolving, reflecting the pulse of the island.",
  dancehallAboutDesc2: "At FIDC, our Dancehall classes honor these roots while pushing creative boundaries. We focus on authentic technique, musicality ('riddim') and the powerful storytelling that makes Dancehall a global force. It's a high-intensity, full-body workout that will challenge you, boost your confidence and connect you with an incredible global community.",
  dancehallPillar1Title: 'Authentic Riddims',
  dancehallPillar1Desc: 'Learn the fundamental steps and cultural context from instructors passionate about Jamaican heritage.',
  dancehallPillar2Title: 'Total Workout',
  dancehallPillar2Desc: 'Develop endurance, coordination and strength with high-energy choreographies that work every muscle.',
  dancehallPillar3Title: 'Unleash Your Confidence',
  dancehallPillar3Desc: 'Embrace the attitude and self-expression at the core of Dancehall. Find your power on the dance floor.',
  dancehallClassesTitle: 'Our Dancehall Programs',
  dancehallClassesSubtitle: 'From absolute beginners to experienced dancers, we have a class that will challenge and inspire you.',
  dancehallLevelBeginnerTitle: 'Dancehall Fundamentals (Level 1)',
  dancehallLevelBeginnerDesc: 'New to Dancehall? Start here. We break down fundamental steps, grooves and the riddim of the music in a fun, supportive environment.',
  dancehallLevelInterTitle: 'Dynamic Dancehall (Level 2)',
  dancehallLevelInterDesc: 'For dancers with basic knowledge. This class focuses on more complex choreographies, musicality and developing your personal style.',
  dancehallLevelAdvancedTitle: 'Dancehall Pro (Level 3)',
  dancehallLevelAdvancedDesc: 'An intensive class for advanced dancers looking to perfect their technique, stage skills and dive into professional-level complex routines.',
  dancehallMetaDescription: 'Learn authentic Dancehall in Barcelona with expert teachers. From beginners to advanced. More than dance: energy, culture and transformation. Try 1 free class.',
  dancehallHeroTitleV2: 'Dancehall Classes in Barcelona',
  dancehallHeroSubtitleV2: "Pure Jamaican Dancehall at Farray's Center. Much more than dance, a way of living. Travel to Jamaica without leaving Barcelona | Classes from beginner to advanced, between Plaza España and Sants.",
  dancehallCTA1: 'Sign Up Now',
  dancehallCTA2: 'See Schedule',
  dancehallUrgency: 'Only 3 spots left this month',
  dancehallUrgency2: 'Offer valid only until Friday',
  dancehallProblemsTitle: 'Do You Identify With Any of These Situations?',
  dancehallProblem1Title: 'Do You Feel Stressed, Low Energy and Tired of Your Routine?',
  dancehallProblem1Desc: "You shouldn't let monotony dominate you. It's time to make a change and recover your vitality, motivation and desire to do things.",
  dancehallProblem2Title: 'Do You Feel You Could Show a More Confident Version of Yourself?',
  dancehallProblem2Desc: 'Those who appear confident today learned to overcome their fears. You can also discover the best version of yourself.',
  dancehallProblem3Title: 'Are You Tired of Boring Exercise Routines?',
  dancehallProblem3Desc: 'You should be able to stay fit in a fun, enjoyable and pleasant way, because always doing the same thing is what bores you.',
  dancehallProblem4Title: 'Do You Feel You Should Have More Fun and Socialize More?',
  dancehallProblem4Desc: 'You need a moment in your week to have fun, expand your circle of friends and do an activity that connects you with yourself and others.',
  dancehallProblem5Title: 'Do You Love Dancing But Need to Try Something Different and Fresh?',
  dancehallProblem5Desc: 'You need a breath of fresh air to awaken your creativity and reconnect with your body in a completely new way.',
  dancehallProblem6Title: 'Does the Essence of Jamaica and Its Culture Move You Inside?',
  dancehallProblem6Desc: 'If everything Jamaica represents inspires you, you should find ways to experience its culture without having to cross the ocean.',
  dancehallSolutionTitle: 'You Need to Sign Up for Dancehall Classes at a Dance Academy',
  dancehallSolutionDesc: "Dozens of people have already taken the step and experience it every week in our Dancehall classes in Barcelona, just 5 minutes from Plaza España and Sants Station. And when they leave... they are no longer the same. If you want to break out of routine, feel better about yourself, meet new people and get fit while having fun, this Caribbean style is for you.",
  dancehallCulturalTitle: 'What is Dancehall? Much More Than a Dance',
  dancehallCulturalShort: '**Dancehall was born in the ghettos of Kingston (Jamaica) in the late 70s as an evolution of reggae, driven by sound systems in streets and dancehalls, community spaces for dancing and releasing social tensions.**',
  dancehallBenefitsTitle: 'Why Will Signing Up for Dancehall Classes Improve Your Life?',
  dancehallBenefitsSubtitle: 'Imagine Your Before and After',
  dancehallBenefit1Title: 'You Recover Energy, Motivation and Desire',
  dancehallBenefit1Desc: 'Dancehall classes break the routine, help you release stress and bring back your desire to move and enjoy again.',
  dancehallBenefit2Title: 'You Gain Security, Confidence and Self-Esteem',
  dancehallBenefit2Desc: 'Dancing Dancehall allows you to boost your self-esteem, overcome fears, let go and discover a more confident and authentic version of yourself.',
  dancehallBenefit3Title: 'You Avoid Boring Exercise Routines',
  dancehallBenefit3Desc: 'Dancehall classes are dynamic, fun and always different. You get fit with a smile on your face and surprise yourself with every class.',
  dancehallBenefit4Title: 'You Have Fun, Meet New People and Socialize',
  dancehallBenefit4Desc: 'Dancehall classes are the perfect place to meet new people, laugh and create real connections while having fun.',
  dancehallBenefit5Title: 'You Learn New Steps and Avoid Monotony in Dance',
  dancehallBenefit5Desc: 'Dancing Dancehall will allow you to discover new movements and sensations, reconnect with your body and enjoy dancing again.',
  dancehallBenefit6Title: 'You Travel to Jamaica Without Leaving Barcelona',
  dancehallBenefit6Desc: 'You will connect with the essence and roots of Jamaica without having to leave Barcelona. Its style, joy and authenticity will be contagious.',
  dancehallBenefit7Title: 'You Discover New Rhythms and Train Your Ear',
  dancehallBenefit7Desc: 'You will learn new music and rhythms, exercise your coordination and memory, and improve your improvisation and musical interpretation skills.',
  dancehallMidCTATitle: 'Ready to Transform Your Life?',
  dancehallMidCTADesc: 'Talk to us on WhatsApp and book your free class right now. We respond in minutes!',
  dancehallHowItWorksTitle: 'How Do Our Dancehall Classes in Barcelona Work?',
  dancehallClassStructureTitle: 'Structure of Each Class (60 min)',
  dancehallClassStructureDesc: 'In our Dancehall classes in Barcelona we generally teach a choreographed sequence, but in practice Dancehall is an improvised dance. Each session is designed so you learn, have fun and express yourself.',
  dancehallLevelsTitle: 'Levels for Everyone',
  dancehallTeachersTitle: 'Meet Our Dancehall Teachers',
  dancehallTeachersSubtitle: 'Amazing Professionals, Better People',
  dancehallTeacher1Specialty: 'Dancehall Teacher | +5 years Experience',
  dancehallTeacher1Bio: "Isabel López is passionate about dancehall with over 5 years of experience as a specialized teacher in urban dance and reggaeton. Trained with Jamaican masters, her contagious energy and professional technique make her one of Farray's Center's most beloved instructors. Her classes mix old school moves (Willie Bounce, Nuh Linga) with the latest hits.",
  dancehallTeacher2Specialty: 'Dancehall and Twerk Teacher | +6 years Experience',
  dancehallTeacher2Bio: 'Sandra Gómez is a professional dancer with over 6 years of experience in dancehall and twerk. Her unique style fuses Twerk/Bootydance movements with Jamaican essence. Her impeccable technique and teaching methodology make her one of the most sought-after teachers. Energy, sensuality and pure femininity.',
  dancehallScheduleTitle: 'Our Dancehall Class Schedule in Barcelona',
  dancehallScheduleSubtitle: 'Classes available almost every day of the week',
  dancehallFaqTitle: 'Frequently Asked Questions About Our Dancehall School in Barcelona',
  dancehallFaqQ1: 'What exactly is dancehall?',
  dancehallFaqA1: 'Dancehall is a style of music and dance that originated in Jamaica in the 70s. It is characterized by energetic movements, powerful rhythms (riddims) and a bold, confident attitude. It is much more than just steps: it is a complete cultural expression with its own history, music and community. In our classes, you not only learn the movements but also the culture and context behind them.',
  dancehallFaqQ2: 'Is dancehall hard to learn?',
  dancehallFaqA2: 'No harder than any other dance style. Dancehall may seem intimidating at first because of its energy and rhythm, but our pedagogical approach breaks down each movement step by step. We start with fundamentals (grooves, basic riddims) and advance gradually. Most of our beginner students are dancing full choreographies within weeks. The most important thing is attitude and willingness to have fun.',
  dancehallFaqQ3: 'Do I need to be fit for dancehall classes?',
  dancehallFaqA3: 'You do not need to be specifically fit to start. Dancehall itself is an excellent cardiovascular and endurance workout, so you will improve your fitness with each class. We work at different intensities and you can always adapt movements to your current level. The important thing is to listen to your body and progress at your own pace.',
  dancehallFaqQ4: 'What should I bring to dancehall class?',
  dancehallFaqA4: 'Comfortable, sporty clothing that allows you to move freely. Many students wear sweatpants or leggings and a t-shirt. For footwear, clean sneakers with good soles are ideal. Bring a water bottle because you will sweat! Optional: a small towel and your best attitude.',
  dancehallFaqQ5: 'Where can I find Dancehall classes near Plaza España in Barcelona?',
  dancehallFaqA5: "Farray's Center is located at Calle Entença 100, Barcelona, just 5 minutes from Plaza España and Sants Station. We have teachers with extensive experience and a family atmosphere for all levels.",
  dancehallFaqQ6: 'Do you organize special Dancehall events or workshops?',
  dancehallFaqA6: 'Yes, we organize workshops, masterclasses and social events throughout the year. Follow us on social media or check our website to stay updated. We also participate in the best dance festivals around the world.',
  dancehallFaqQ7: 'Are the classes only for women or also for men?',
  dancehallFaqA7: 'Our classes are open to all people, regardless of gender or previous experience. Dancehall is for everyone! Diversity enriches the experience for all.',
  dancehallFinalCTATitle: 'Why Is Today the Best Time to Start?',
  dancehallFinalCTADesc: "Because every day you don't move, your body asks for a little more. Because you are just one class away from changing your routine. At Farray's we don't sell classes. We create experiences. We are waiting for you with great music, teachers with soul and an energy you won't find anywhere else in Barcelona.",
  dancehallPrepareTitle: 'Prepare for your first Dancehall class',
  dancehallPrepareSubtitle: 'Everything you need to know before coming',
  dancehallPrepareWhatToBring: 'What to bring:',
  dancehallPrepareItem1: 'Comfortable clothing that allows you to move freely (leggings, shorts, joggers)',
  dancehallPrepareItem2: 'T-shirt or top that does not limit arm movements',
  dancehallPrepareItem3: 'Water bottle (minimum 500ml) - Dancehall is intense',
  dancehallPrepareItem4: 'Small towel for sweat',
  dancehallPrepareItem5: 'Comfortable sneakers with good cushioning',
  dancehallPrepareBefore: 'Before arriving:',
  dancehallPrepareBeforeItem1: 'Arrive 10-15 minutes early to change and settle in',
  dancehallPrepareBeforeItem2: 'Avoid eating heavy 2 hours before class',
  dancehallPrepareBeforeItem3: 'Stay well hydrated throughout the day',
  dancehallPrepareAvoid: 'Avoid:',
  dancehallPrepareAvoidItem1: 'Jewelry, rings, bracelets or accessories that could get caught',
  dancehallPrepareAvoidItem2: 'Very tight clothing that prevents hip movement',
  dancehallPrepareAvoidItem3: 'Street shoes in the room (there are changing rooms)',
  dancehallPrepareTeacherTip: "Teacher's tip:",
  dancehallPrepareTeacherQuote: "Don't worry if the steps don't come out at first. Dancehall is feeling first, technique second. Come with a positive attitude and desire to have a good time.",
  dancehallNearbyTitle: 'Dancehall Classes Near You in Barcelona',
  dancehallNearbyDesc: "We are the reference academy for Dancehall classes in the Plaza España, Sants, Hostafrancs, Les Corts and Eixample Esquerra area. We also receive students from Poble Sec, Sant Antoni and L'Hospitalet looking for Jamaican Dancehall training with professional methodology.",
  dancehallNearbySearchText: 'If you search "Dancehall classes near me" in Barcelona, we are at:',
  dancehallNearbyMetro: 'Metro: Plaza España (L1, L3), Rocafort (L1) - 5 min walk, Entença (L5) - 5 min walk or Hostafrancs (L1) - 5 min walk.',
  dancehallCommunityTitle: 'Join the Most Active Dancehall Community in Barcelona',
  dancehallCommunitySubtitle: 'Take the Step',
  dancehallCommunityDesc: "Book your spot now and don't let them tell you about it... or dance it for you.",
  dancehallGalleryTitle: 'See the Vibe',
  dancehallVideoTitle: 'Live the Dancehall Experience',
  dancehallVideoDesc: 'Discover what our Dancehall classes in Barcelona are like',
  dancehallStatistics: 'Scientific studies on dance indicate that dancing improves coordination, proprioception and overall physical condition, in addition to reducing stress and improving mood, and Dancehall benefits from these effects due to its high energy and complete body work.',

  // Private Classes Page
  particularesPage_title: "Private Dance Classes in Barcelona | Personalized and at Your Pace | Farray's Center",
  particularesPage_description: 'Private dance classes in Barcelona 100% personalized. Exclusive teacher, flexible schedules, all styles. Learn 3x faster.',
  particularesPage_breadcrumb_home: 'Home',
  particularesPage_breadcrumb_current: 'Private Dance Classes',
  particularesPage_h1: 'Private Dance Classes in Barcelona',
  particularesPage_intro: 'Learn at your own pace with a teacher 100% dedicated to you. Flexible schedules, all dance styles, 3x faster progress. Your dance, your rules.',
  particularesPage_cta_primary: 'See Packs and Prices',
  particularesPage_cta_secondary: 'Check Availability',
  particularesPage_benefits_title: 'Why Choose Private Dance Classes?',
  particularesPage_benefits_subtitle: 'Discover the advantages that only private classes can offer you',
  particularesPage_benefit1_title: 'Teacher 100% Dedicated to You',
  particularesPage_benefit1_desc: 'The whole class focused on you: personalized corrections, adapted pace and exclusive attention to every movement.',
  particularesPage_benefit2_title: 'Learn 3x Faster',
  particularesPage_benefit2_desc: 'With exclusive teacher attention, you advance in 1 private class what would take 3-4 regular group classes.',
  particularesPage_benefit3_title: 'Totally Flexible Schedules',
  particularesPage_benefit3_desc: 'Choose the day and time that suits you best: mornings, afternoons, weekends. We adapt to your schedule.',
  particularesPage_benefit4_title: 'Record Your Class',
  particularesPage_benefit4_desc: 'Take the class with you: record to review at home, practice and not forget any step.',
  particularesPage_comparison_title: 'Which Modality Suits You Best?',
  particularesPage_particulares_title: 'Private Classes',
  particularesPage_particulares_subtitle: 'For 1-2 students maximum',
  particularesPage_premium_title: 'Premium Small Group Classes',
  particularesPage_premium_subtitle: 'Groups of 3 to 6 people',
  particularesPage_packs_title: 'Our Private Class Packs',
  particularesPage_packs_subtitle: 'Choose the pack that best suits your needs. All include 12-month validity.',
  particularesPage_pack_popular: 'Most Popular',
  particularesPage_pack1_name: '1 Class Pack',
  particularesPage_pack2_name: '5 Class Pack',
  particularesPage_pack3_name: '10 Class Pack',
  particularesPage_pack_cta: 'Book Now',
  particularesPage_faq_title: 'Frequently Asked Questions',
  particularesPage_faq_subtitle: 'Resolve all your doubts about private dance classes',

  // Room Rental Page
  roomRental_pageTitle: "Dance Room Rental in Barcelona | Farray's International Dance Center",
  roomRental_metaDescription: 'Rent fully equipped dance rooms in Barcelona, in the heart of the city, between Plaza España and Sants. Professional spaces for rehearsals, classes, workshops, castings, shoots and events.',
  roomRental_broadcast_title: 'New: Online Broadcast',
  roomRental_broadcast_subtitle: 'Want your event to reach further than the four walls of the room?',
  roomRental_broadcast_intro: "At Farray's you can organize your workshop or intensive at the academy and broadcast it live over the internet, with our professional broadcast service.",
  roomRental_broadcast_perfect_for: 'Perfect for:',
  roomRental_broadcast_item1: 'Launching online trainings',
  roomRental_broadcast_item2: 'Selling hybrid spots (in-person + online)',
  roomRental_broadcast_item3: 'Reaching students from other countries without leaving Barcelona',
  roomRental_broadcast_footer: '👉 Ask us about the broadcast service when requesting your quote.',
  roomRental_room2_title: 'Room 2',
  roomRental_room2_size: '120 m²',
  roomRental_room2_desc: 'Our largest room. Professional linoleum floor installed on floating wood with approximately 60% cushioning. Perfect for large classes, events, workshops, shoots and company rehearsals.',
  roomRental_cta_title: 'Want to Rent a Dance Room in Barcelona?',
  roomRental_cta_subtitle: 'Tell us what you need (day, time, type of activity and number of people) and we will respond with availability and rates.',
  roomRental_cta_contact: 'Contact Now',
  roomRental_cta_phone: 'Call: 933 25 96 44',
  roomRental_cta_location: '📍 Calle Entença 100, Barcelona (between Plaza España and Sants)',

  // Salsa Cubana Blue Ocean Section
  salsaCubanaBlueOceanTitle: 'Why did thousands of Barcelona residents choose to learn Cuban salsa with us?',
  salsaCubanaBlueOceanIntro: 'Spoiler: They did not come (just) to learn figures.',
  salsaCubanaBlueOcean1Title: 'For those who need to disconnect',
  salsaCubanaBlueOcean1P1: 'After 8 hours in front of a screen, your body asks for something more than a gym.',
  salsaCubanaBlueOcean1P2: 'It asks for rhythm. It asks for music. It asks for movement that is not mechanical.',
  salsaCubanaBlueOcean2Title: 'For those tired of swiping',
  salsaCubanaBlueOcean2P1: "Tinder gives you matches. Farray's gives you real looks, real conversations, real laughs.",
  salsaCubanaBlueOcean3Title: 'For couples who want to reconnect',
  salsaCubanaBlueOcean3P1: "How long has it been since you did something together where you look into each other's eyes, touch and laugh?",
  salsaCubanaBlueOcean4Title: 'For those who "don\'t know how to dance"',
  salsaCubanaFinalCTATitle: 'Your first Cuban salsa class is waiting',
  salsaCubanaHeroTitle: 'Cuban Salsa Classes in Barcelona',
  salsaCubanaHeroSubtitle: 'Learn to dance for real, not just repeat figures',
  salsaCubanaIdentifyTitle: 'Who are our Cuban Salsa classes designed for?',
  salsaCubanaTeacher4Name: 'Lia Valdes',
  salsaCubanaTeacher4Specialty: 'Cuban Salsa Teacher • Farray Method®',
  salsaCubanaWhatIsQuestionTitle: 'Do you wonder if it is for you?',
  salsaCubanaWhatIsQuestionAnswer: 'Yes, it is.',

  // Salsa Lady Style Teachers Section
  salsaLadyTeachersTitle: 'Your Salsa Lady Style Masters',
  salsaLadyTeachersSubtitle: 'Learn with the best dance masters in Europe',
  salsaLadyTeacherTitle: 'Your Salsa Lady Style master',
  salsaLadyTeacherSubtitle: 'Learn with one of the best dance masters in Europe',
  salsaLadyCompareTitle: 'Salsa Lady Style vs other styles',
  salsaLadyCompareSubtitle: 'Discover what makes Lady Style unique',
  salsaLadyCompareFeature: 'Feature',
  salsaLadyCompareRow1: 'Arm technique',
  salsaLadyCompareRow2: 'Hip movements',
  salsaLadyCompareRow3: 'Heels usage',
  salsaLadyCompareRow4: 'Musicality',
  salsaLadyCompareRow5: 'Partner connection',
  salsaLadyCompareRow6: 'Feminine body expression',
  salsaLadyCompareRow7: 'Rhythm and speed',
  salsaLadyCompareRow8: 'Elegance and style',
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
let newTranslations = '\n  // ===== DANCEHALL, PRIVATE CLASSES, ROOM RENTAL, SALSA TRANSLATIONS =====\n';
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
