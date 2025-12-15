// Script to add more missing English translations to en.ts (Part 2)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const missingTranslations = {
  // Twerk Page Translations
  twerkLevelsTitle: 'Our Twerk Levels',
  twerkLevelBeginnerTitle: 'Beginner',
  twerkLevelBeginnerDesc: 'Ideal for those starting from scratch. Learn the fundamentals of Twerk and basic hip movements.',
  twerkLevelInterTitle: 'Intermediate',
  twerkLevelInterDesc: 'Perfect your technique, learn choreographies and develop your own style.',
  twerkLevelAdvancedTitle: 'Advanced',
  twerkLevelAdvancedDesc: 'Complete Twerk mastery with complex choreographies, freestyle and performance.',
  twerkPrepareTitle: 'Prepare for your first Twerk class',
  twerkPrepareSubtitle: 'Everything you need to know before coming',
  twerkPrepareWhatToBring: 'What to bring:',
  twerkPrepareItem1: 'Leggings or short shorts that allow you to see glute movement',
  twerkPrepareItem2: 'Sports top or comfortable t-shirt',
  twerkPrepareItem3: 'Water bottle (minimum 500ml) - Twerk is intense',
  twerkPrepareItem4: 'Small towel for sweat',
  twerkPrepareItem5: 'Non-slip socks or light sneakers',
  twerkPrepareBefore: 'Before arriving:',
  twerkPrepareBeforeItem1: 'Arrive 10-15 minutes early to change and warm up',
  twerkPrepareBeforeItem2: 'Avoid eating heavy 2 hours before class',
  twerkPrepareBeforeItem3: 'Stay well hydrated throughout the day - you will work hard',
  twerkPrepareAvoid: 'Avoid:',
  twerkPrepareAvoidItem1: 'Jewelry, rings, bracelets or accessories that could bother you',
  twerkPrepareAvoidItem2: 'Baggy pants that prevent seeing your technique',
  twerkPrepareAvoidItem3: 'Street shoes in the room (there are changing rooms)',
  twerkPrepareTeacherTip: "Teacher's tip:",
  twerkPrepareTeacherQuote: "Twerk is for ALL bodies. It doesn't matter your shape, your weight or your experience. What matters is that you come wanting to move, laugh and discover your power.",
  twerkNearbyTitle: 'Twerk Classes Near You in Barcelona',
  twerkNearbyDesc: "We are the reference academy for Twerk classes in the Plaza España, Sants, Hostafrancs, Les Corts and Eixample Esquerra area. We also receive students from Poble Sec, Sant Antoni and L'Hospitalet looking for Twerk training with professional methodology and safe environment.",
  twerkNearbySearchText: 'If you search "Twerk classes near me" in Barcelona, we are at:',
  twerkNearbyMetro: 'Metro: Plaza España (L1, L3), Rocafort (L1) - 5 min walk, Entença (L5) - 5 min walk or Hostafrancs (L1) - 5 min walk.',
  twerkStatistics: 'Scientific studies on dance indicate that dancing improves coordination, proprioception and overall physical condition, in addition to reducing stress and improving mood, and Twerk benefits from these same effects due to its aerobic nature and lower body strength work.',

  // Afrobeat Page Translations
  afroLevelsTitle: 'Our Afrobeat Levels',
  afroLevelBasicTitle: 'Basic Afrobeat',
  afroLevelBasicDesc: 'Ideal for beginners. You will learn Afrobeats fundamentals: bounce, flow, basic Azonto and Shaku Shaku steps and African attitude. No prior experience needed.',
  afroLevelIntermediateTitle: 'Intermediate Afrobeat',
  afroLevelIntermediateDesc: 'For those who already master the basics. We work on more complex choreographies, style combinations (Ntcham, Amapiano, Legwork) and advanced musicality.',
  afroPrepareTitle: 'Prepare for your first Afrobeat class',
  afroPrepareSubtitle: 'Everything you need to know before coming',
  afroPrepareWhatToBring: 'What to bring:',
  afroPrepareItem1: 'Comfortable, loose clothing that allows you to move freely',
  afroPrepareItem2: 'Sneakers with good cushioning (lots of bouncing)',
  afroPrepareItem3: 'Water bottle (minimum 500ml) - Afrobeat is very energetic',
  afroPrepareItem4: 'Small towel for sweat',
  afroPrepareItem5: 'Positive attitude and desire to have a good time',
  afroPrepareBefore: 'Before arriving:',
  afroPrepareBeforeItem1: 'Arrive 10-15 minutes early to change and get in the mood',
  afroPrepareBeforeItem2: 'Avoid eating heavy 2 hours before class',
  afroPrepareBeforeItem3: 'Stay well hydrated throughout the day - you will sweat a lot',
  afroPrepareAvoid: 'Avoid:',
  afroPrepareAvoidItem1: 'Jewelry, rings, bracelets that could get caught or bother you',
  afroPrepareAvoidItem2: 'Very tight clothing that limits arm and leg movement',
  afroPrepareAvoidItem3: 'Street shoes in the room (there are changing rooms)',
  afroPrepareTeacherTip: "Teacher's tip:",
  afroPrepareTeacherQuote: "Afrobeat is pure joy. Don't come to do perfect steps, come to feel the music and let yourself go. African energy is contagious when you let loose.",
  afroNearbyTitle: 'Afrobeat Classes Near You in Barcelona',
  afroNearbyDesc: "We are the reference academy for Afrobeat classes in the Plaza España, Sants, Hostafrancs, Les Corts and Eixample Esquerra area. We also receive students from Poble Sec, Sant Antoni and L'Hospitalet looking for African dance training with specialized teachers.",
  afroNearbySearchText: 'If you search "Afrobeat classes near me" in Barcelona, we are at:',
  afroNearbyMetro: 'Metro: Plaza España (L1, L3), Rocafort (L1) - 5 min walk, Entença (L5) - 5 min walk or Hostafrancs (L1) - 5 min walk.',

  // Femmology Page Translations
  femLevelsTitle: 'Our Femmology Levels',
  femLevelBasicTitle: 'Femmology Initiation',
  femLevelBasicDesc: 'Perfect to start your journey. You will learn to walk in heels with elegance, work on basic posture, discover the use of hair as an expressive element and begin to connect with your femininity through movement.',
  femLevelIntermediateTitle: 'Advanced Femmology',
  femLevelIntermediateDesc: 'For those who already master the fundamentals. More complex choreographies, advanced floorwork, refined body dissociation, deeper emotional work and high-level heels technique.',
  femPrepareTitle: 'Prepare for your first Femmology class',
  femPrepareSubtitle: 'Everything you need to know before your transformation',
  femPrepareWhatToBring: 'What to bring:',
  femPrepareItem1: 'Heels with ankle strap (7-10 cm recommended for beginners)',
  femPrepareItem2: 'Comfortable, fitted clothing that allows you to see your body in the mirror',
  femPrepareItem3: 'Knee pads if your knees are sensitive (there will be floor work)',
  femPrepareItem4: 'Water bottle and small towel',
  femPrepareItem5: 'Open mind and desire to discover yourself',
  femPrepareBefore: 'Before arriving:',
  femPrepareBeforeItem1: 'Arrive 15 minutes early to change and prepare mentally',
  femPrepareBeforeItem2: 'Avoid eating heavy 2 hours before class',
  femPrepareBeforeItem3: "If it's your first time in heels, practice walking a bit at home",
  femPrepareAvoid: 'Avoid:',
  femPrepareAvoidItem1: 'Jewelry, rings or bracelets that could get caught or bother you',
  femPrepareAvoidItem2: "Very loose clothing that doesn't let you see your movements",
  femPrepareAvoidItem3: 'Shame or fear: this is a safe, judgment-free space',
  femPrepareTeacherTip: "Yunaisy's tip:",
  femPrepareTeacherQuote: "Femmology is not about being perfect, it's about being authentic. Come as you are, with your fears and your desires. Here we don't judge, here we transform. So you love yourself more every day, beautiful woman.",
  femNearbyTitle: 'Femmology Classes Near You in Barcelona',
  femNearbyDesc: "We are the reference academy for Femmology classes in the Plaza España, Sants, Hostafrancs, Les Corts and Eixample Esquerra area. We also receive students from Poble Sec, Sant Antoni and L'Hospitalet looking to reconnect with their femininity through movement.",
  femNearbySearchText: 'If you search "Femmology classes near me" in Barcelona, we are at:',
  femNearbyMetro: 'Metro: Plaza España (L1, L3), Rocafort (L1) - 5 min walk, Entença (L5) - 5 min walk or Hostafrancs (L1) - 5 min walk.',

  // Hip Hop Reggaeton Page Translations
  hhrLevelsTitle: 'Our Hip Hop Reggaeton Levels',
  hhrLevelBasicTitle: 'Basic Hip Hop Reggaeton',
  hhrLevelBasicDesc: 'For beginners. You will learn the fundamentals: groove, bounce, basic hip-hop and reggaeton steps, attitude and musicality. No prior experience needed.',
  hhrLevelIntermediateTitle: 'Intermediate Hip Hop Reggaeton',
  hhrLevelIntermediateDesc: 'For those who master the basics. Music video style choreographies, more complex combinations, improvisation and personal style development.',
  hhrPrepareTitle: 'Prepare for your first Hip Hop Reggaeton class',
  hhrPrepareSubtitle: 'Everything you need to know before coming',
  hhrPrepareWhatToBring: 'What to bring:',
  hhrPrepareItem1: 'Comfortable urban clothing (joggers, baggy pants, loose t-shirt)',
  hhrPrepareItem2: 'Sneakers with good soles (sneaker style)',
  hhrPrepareItem3: 'Water bottle (minimum 500ml) - you will sweat quite a bit',
  hhrPrepareItem4: 'Small towel for sweat',
  hhrPrepareItem5: 'Cap or accessories if you like the style (optional)',
  hhrPrepareBefore: 'Before arriving:',
  hhrPrepareBeforeItem1: 'Arrive 10-15 minutes early to change and warm up',
  hhrPrepareBeforeItem2: 'Avoid eating heavy 2 hours before class',
  hhrPrepareBeforeItem3: 'Listen to some urban music to come with energy',
  hhrPrepareAvoid: 'Avoid:',
  hhrPrepareAvoidItem1: 'Large jewelry or chains that could bother you',
  hhrPrepareAvoidItem2: 'Very tight clothing that limits your movement',
  hhrPrepareAvoidItem3: 'Street shoes in the room (there are changing rooms)',
  hhrPrepareTeacherTip: "Charlie Breezy's tip:",
  hhrPrepareTeacherQuote: "Hip Hop Reggaeton is attitude. Don't worry if it doesn't come out perfect at first, the important thing is that you come wanting to move and have a good time. The flow comes naturally.",
  hhrNearbyTitle: 'Hip Hop Reggaeton Classes Near You in Barcelona',
  hhrNearbyDesc: "We are the reference academy for Hip Hop and Reggaeton classes in the Plaza España, Sants, Hostafrancs, Les Corts and Eixample Esquerra area. We also receive students from Poble Sec, Sant Antoni and L'Hospitalet looking for urban dance training with professional methodology.",
  hhrNearbySearchText: 'If you search "Hip Hop Reggaeton classes near me" in Barcelona, we are at:',
  hhrNearbyMetro: 'Metro: Plaza España (L1, L3), Rocafort (L1) - 5 min walk, Entença (L5) - 5 min walk or Hostafrancs (L1) - 5 min walk.',

  // Reggaeton Cubano Page Translations
  rcbLevelsTitle: 'Our Cuban Reggaeton Levels',
  rcbLevelBasicTitle: 'Basic Cuban Reggaeton',
  rcbLevelBasicDesc: 'For beginners. You will learn the fundamentals: body dissociation, basic tembleque, Reparto steps and Cuban attitude. No prior experience needed.',
  rcbLevelIntermediateTitle: 'Intermediate Cuban Reggaeton',
  rcbLevelIntermediateDesc: 'For those who master the basics. Advanced improvisation, complex tembleque and dissociation, floor movements and Cuban personal style development.',
  rcbPrepareTitle: 'Prepare for your first Cuban Reggaeton class',
  rcbPrepareSubtitle: 'Everything you need to know before coming',
  rcbPrepareWhatToBring: 'What to bring:',
  rcbPrepareItem1: 'Comfortable clothing that allows free hip movement',
  rcbPrepareItem2: 'Sneakers with good cushioning',
  rcbPrepareItem3: 'Water bottle (minimum 500ml) - you will sweat a lot',
  rcbPrepareItem4: 'Small towel for sweat',
  rcbPrepareItem5: 'Open attitude to improvisation',
  rcbPrepareBefore: 'Before arriving:',
  rcbPrepareBeforeItem1: 'Arrive 10-15 minutes early to change and warm up',
  rcbPrepareBeforeItem2: 'Avoid eating heavy 2 hours before class',
  rcbPrepareBeforeItem3: 'Listen to some Cuban reggaeton to come with energy',
  rcbPrepareAvoid: 'Avoid:',
  rcbPrepareAvoidItem1: 'Jewelry or accessories that could bother you',
  rcbPrepareAvoidItem2: 'Very tight clothing that limits hip movement',
  rcbPrepareAvoidItem3: 'Street shoes in the room (there are changing rooms)',
  rcbPrepareTeacherTip: "Teacher's tip:",
  rcbPrepareTeacherQuote: "Cuban Reggaeton is pure feeling. Don't come to copy steps, come to feel the music and let your body improvise. That's what makes us Cubans unique.",
  rcbNearbyTitle: 'Cuban Reggaeton Classes Near You in Barcelona',
  rcbNearbyDesc: "We are the reference academy for Cuban Reggaeton classes in the Plaza España, Sants, Hostafrancs, Les Corts and Eixample Esquerra area. We also receive students from Poble Sec, Sant Antoni and L'Hospitalet looking for reparto and authentic Cuban reggaeton training.",
  rcbNearbySearchText: 'If you search "Cuban Reggaeton classes near me" in Barcelona, we are at:',
  rcbNearbyMetro: 'Metro: Plaza España (L1, L3), Rocafort (L1) - 5 min walk, Entença (L5) - 5 min walk or Hostafrancs (L1) - 5 min walk.',

  // Sexy Reggaeton Page Translations
  sxrLevelsTitle: 'Our Sexy Reggaeton Levels',
  sxrLevelBasicTitle: 'Basic Sexy Reggaeton',
  sxrLevelBasicDesc: 'For beginners. You will learn the fundamentals: body roll, basic perreo, hip movements and sensuality. No prior experience needed. Safe, judgment-free environment.',
  sxrLevelIntermediateTitle: 'Intermediate Sexy Reggaeton',
  sxrLevelIntermediateDesc: 'For those who master the basics. More sensual choreographies, floor drops, advanced combinations and development of your own style.',
  sxrPrepareTitle: 'Prepare for your first Sexy Reggaeton class',
  sxrPrepareSubtitle: 'Everything you need to know before coming',
  sxrPrepareWhatToBring: 'What to bring:',
  sxrPrepareItem1: 'Comfortable leggings or shorts that allow you to see your movement',
  sxrPrepareItem2: 'Sports top or fitted t-shirt',
  sxrPrepareItem3: 'Water bottle (minimum 500ml)',
  sxrPrepareItem4: 'Small towel for sweat',
  sxrPrepareItem5: 'Knee pads if you have sensitive knees (optional, for floorwork)',
  sxrPrepareBefore: 'Before arriving:',
  sxrPrepareBeforeItem1: 'Arrive 10-15 minutes early to change and relax',
  sxrPrepareBeforeItem2: 'Avoid eating heavy 2 hours before class',
  sxrPrepareBeforeItem3: 'Come with an open mind and desire to enjoy',
  sxrPrepareAvoid: 'Avoid:',
  sxrPrepareAvoidItem1: 'Jewelry that could bother or get caught',
  sxrPrepareAvoidItem2: 'Very baggy clothing that prevents seeing your technique',
  sxrPrepareAvoidItem3: 'Street shoes in the room (there are changing rooms)',
  sxrPrepareTeacherTip: "Teacher's tip:",
  sxrPrepareTeacherQuote: "Sexy Reggaeton is for everyone. It doesn't matter your body, your experience or your age. Here we celebrate every woman's sensuality. Come discover yourself.",
  sxrNearbyTitle: 'Sexy Reggaeton Classes Near You in Barcelona',
  sxrNearbyDesc: "We are the reference academy for Sexy Reggaeton classes in the Plaza España, Sants, Hostafrancs, Les Corts and Eixample Esquerra area. We also receive students from Poble Sec, Sant Antoni and L'Hospitalet looking for sensual dance training with safe and professional environment.",
  sxrNearbySearchText: 'If you search "Sexy Reggaeton classes near me" in Barcelona, we are at:',
  sxrNearbyMetro: 'Metro: Plaza España (L1, L3), Rocafort (L1) - 5 min walk, Entença (L5) - 5 min walk or Hostafrancs (L1) - 5 min walk.',

  // Sexy Style Page Translations
  sexystyleLevelsTitle: 'Our Sexy Style Levels',
  sexystyleLevelBasicTitle: 'Beginner Sexy Style',
  sexystyleLevelBasicDesc: 'Ideal to start without pressure. You will learn basic hip movements, body waves and attitude. Heels are optional: you can come with sneakers and progress at your own pace.',
  sexystyleLevelIntermediateTitle: 'Intermediate Sexy Style',
  sexystyleLevelIntermediateDesc: 'For those who already feel comfortable with the fundamentals. More elaborate choreographies, floorwork, fluid transitions and attitude and stage presence work.',
  sexystylePrepareTitle: 'Prepare for your first Sexy Style class',
  sexystylePrepareSubtitle: 'Everything you need for your first experience',
  sexystylePrepareWhatToBring: 'What to bring:',
  sexystylePrepareItem1: 'Comfortable, fitted clothing: leggings or shorts, top or t-shirt',
  sexystylePrepareItem2: 'Sneakers or heels (heels are optional)',
  sexystylePrepareItem3: 'Knee pads if you have sensitive knees (there will be floorwork)',
  sexystylePrepareItem4: 'Water bottle and small towel',
  sexystylePrepareItem5: 'Desire to have a good time and let loose',
  sexystylePrepareBefore: 'Before arriving:',
  sexystylePrepareBeforeItem1: 'Arrive 10-15 minutes early to change calmly',
  sexystylePrepareBeforeItem2: 'Avoid eating heavy 2 hours before class',
  sexystylePrepareBeforeItem3: 'Put on music that makes you feel good on the way',
  sexystylePrepareAvoid: 'Avoid:',
  sexystylePrepareAvoidItem1: 'Jewelry or accessories that could bother you when moving',
  sexystylePrepareAvoidItem2: "Very loose clothing that doesn't let you see your body in the mirror",
  sexystylePrepareAvoidItem3: 'Comparing yourself to others: every body has its own flow',
  sexystylePrepareTeacherTip: "Yasmina's tip:",
  sexystylePrepareTeacherQuote: "The most important thing is that you come wanting to enjoy. It doesn't matter if you've never danced or if you think you're not sexy. Here we all let loose, laugh and leave feeling more powerful. I'm waiting for you!",
  sexystyleNearbyTitle: 'Sexy Style Classes Near You in Barcelona',
  sexystyleNearbyDesc: "We are the reference academy for Sexy Style classes in the Plaza España, Sants, Hostafrancs, Les Corts and Eixample Esquerra area. We also receive students from Poble Sec, Sant Antoni and L'Hospitalet looking for sensual dance training with professional methodology and safe environment.",
  sexystyleNearbySearchText: 'If you search "Sexy Style classes near me" in Barcelona, we are at:',
  sexystyleNearbyMetro: 'Metro: Plaza España (L1, L3), Rocafort (L1) - 5 min walk, Entença (L5) - 5 min walk or Hostafrancs (L1) - 5 min walk.',
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
let newTranslations = '\n  // ===== DANCE STYLE PAGES TRANSLATIONS =====\n';
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
