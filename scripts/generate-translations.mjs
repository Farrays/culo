import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Read missing translations
const missingTranslations = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'missing_translations.json'), 'utf8')
);

console.log('Generating translations for', missingTranslations.length, 'keys...');

// Translation mappings - Spanish to English, Catalan, French
const translations = {
  // Navigation and general
  openLevel: { en: 'Open Level', ca: 'Nivell Obert', fr: 'Niveau Ouvert' },
  navBachataLadyStyle: { en: 'Bachata Lady Style', ca: 'Bachata Lady Style', fr: 'Bachata Lady Style' },
  navTimba: { en: 'Timba', ca: 'Timba', fr: 'Timba' },
  navPricing: { en: 'Pricing', ca: 'Preus', fr: 'Tarifs' },
  close: { en: 'Close', ca: 'Tancar', fr: 'Fermer' },
  members: { en: 'members', ca: 'membres', fr: 'membres' },
  years: { en: 'years', ca: 'anys', fr: 'ans' },

  // Dancehall V3 Compare Section
  dhV3CompareTitle: {
    en: "Why learn Dancehall at Farray's and not at another academy in Barcelona?",
    ca: "Per què aprendre Dancehall a Farray's i no en una altra acadèmia de Barcelona?",
    fr: "Pourquoi apprendre le Dancehall chez Farray's et pas dans une autre académie de Barcelone?"
  },
  dhV3CompareSubtitle: {
    en: "The difference is not marketing. It's facts.",
    ca: "La diferència no és màrqueting. Són fets.",
    fr: "La différence n'est pas du marketing. Ce sont des faits."
  },
  dhV3CompareColOthers: { en: 'Other academies', ca: 'Altres acadèmies', fr: 'Autres académies' },
  dhV3CompareColFarrays: { en: "Farray's Center", ca: "Farray's Center", fr: "Farray's Center" },
  dhV3CompareRow1Label: { en: 'Teacher training', ca: 'Formació del professorat', fr: 'Formation des professeurs' },
  dhV3CompareRow1Others: { en: 'Online or weekend courses', ca: 'Cursos online o de cap de setmana', fr: 'Cours en ligne ou de week-end' },
  dhV3CompareRow1Farrays: { en: 'Trained in Jamaica + Farray® Method', ca: 'Formades a Jamaica + Mètode Farray®', fr: 'Formées en Jamaïque + Méthode Farray®' },
  dhV3CompareRow2Label: { en: 'Teaching method', ca: "Mètode d'ensenyament", fr: "Méthode d'enseignement" },
  dhV3CompareRow2Others: { en: "You copy this month's choreography", ca: 'Copies la coreografia del mes', fr: 'Tu copies la chorégraphie du mois' },
  dhV3CompareRow2Farrays: { en: 'Technique + fundamentals + real progression', ca: 'Tècnica + fonaments + progressió real', fr: 'Technique + fondamentaux + progression réelle' },
  dhV3CompareRow3Label: { en: 'Level separation', ca: 'Separació per nivells', fr: 'Séparation par niveaux' },
  dhV3CompareRow3Others: { en: '"Open level" - everyone mixed', ca: '"Nivell obert" - tots barrejats', fr: '"Niveau ouvert" - tous mélangés' },
  dhV3CompareRow3Farrays: { en: 'Real Beginner, Intermediate and Advanced', ca: 'Iniciació, Intermedi i Avançat reals', fr: 'Initiation, Intermédiaire et Avancé réels' },
  dhV3CompareRow4Label: { en: 'Dancehall classes per week', ca: 'Classes de Dancehall per setmana', fr: 'Cours de Dancehall par semaine' },
  dhV3CompareRow4Others: { en: '1-2 classes', ca: '1-2 classes', fr: '1-2 cours' },
  dhV3CompareRow4Farrays: { en: '5 different classes to choose from', ca: '5 classes diferents per triar', fr: '5 cours différents à choisir' },
  dhV3CompareRow5Label: { en: 'Facilities', ca: 'Instal·lacions', fr: 'Installations' },
  dhV3CompareRow5Others: { en: 'Small or shared spaces', ca: 'Locals petits o compartits', fr: 'Locaux petits ou partagés' },
  dhV3CompareRow5Farrays: { en: '700m² with professional floor and climate control', ca: '700m² amb terra professional i climatització', fr: '700m² avec sol professionnel et climatisation' },
  dhV3CompareRow6Label: { en: 'Minimum commitment', ca: 'Permanència mínima', fr: 'Engagement minimum' },
  dhV3CompareRow6Others: { en: '3 to 12 month contracts', ca: 'Contractes de 3 a 12 mesos', fr: 'Contrats de 3 à 12 mois' },
  dhV3CompareRow6Farrays: { en: 'Month to month, leave when you want', ca: "Mes a mes, te'n vas quan vulguis", fr: 'Mois par mois, partez quand vous voulez' },
  dhV3CompareRow7Label: { en: 'Official recognition', ca: 'Reconeixement oficial', fr: 'Reconnaissance officielle' },
  dhV3CompareRow7Others: { en: 'None', ca: 'Cap', fr: 'Aucune' },
  dhV3CompareRow7Farrays: { en: 'Academy accredited by CID-UNESCO', ca: 'Acadèmia acreditada pel CID-UNESCO', fr: 'Académie accréditée par CID-UNESCO' },
  dhV3CompareRow8Label: { en: 'Community and events', ca: 'Comunitat i esdeveniments', fr: 'Communauté et événements' },
  dhV3CompareRow8Others: { en: 'You go to class and leave', ca: "Vas a classe i te'n vas", fr: 'Tu vas en cours et tu pars' },
  dhV3CompareRow8Farrays: { en: 'Free practices, events, real family', ca: 'Pràctiques lliures, esdeveniments, família real', fr: 'Pratiques libres, événements, vraie famille' },
  dhV3CompareMeaningTitle: { en: 'What does this mean for you?', ca: 'Què significa això per a tu?', fr: 'Qu\'est-ce que cela signifie pour toi ?' },
  dhV3CompareMeaning1Title: { en: "If you've never danced Dancehall:", ca: 'Si mai has ballat Dancehall:', fr: "Si tu n'as jamais dansé le Dancehall :" },
  dhV3CompareMeaning1Desc: { en: "You'll start with real fundamentals, not copying steps you don't understand. In 3 months you'll notice the difference.", ca: "Començaràs amb fonaments reals, no copiant passos que no entens. En 3 mesos notaràs la diferència.", fr: "Tu commenceras avec de vrais fondamentaux, pas en copiant des pas que tu ne comprends pas. En 3 mois, tu remarqueras la différence." },
  dhV3CompareMeaning2Title: { en: "If you've tried other academies:", ca: 'Si ja has provat altres acadèmies:', fr: "Si tu as déjà essayé d'autres académies :" },
  dhV3CompareMeaning2Desc: { en: "You'll finally understand the \"why\" behind each movement. It wasn't your fault you weren't progressing — it was the method.", ca: 'Per fi entendràs el "per què" de cada moviment. No era culpa teva no progressar — era el mètode.', fr: "Tu comprendras enfin le \"pourquoi\" de chaque mouvement. Ce n'était pas ta faute si tu ne progressais pas — c'était la méthode." },
  dhV3CompareMeaning3Title: { en: 'If you want flexibility:', ca: 'Si vols flexibilitat:', fr: 'Si tu veux de la flexibilité :' },
  dhV3CompareMeaning3Desc: { en: "5 classes per week means you train when YOU can. And if you can't come one month, no problem.", ca: '5 classes per setmana significa que entrenes quan TU puguis. I si un mes no pots venir, no passa res.', fr: "5 cours par semaine signifient que tu t'entraînes quand TU peux. Et si tu ne peux pas venir un mois, pas de problème." },
  dhV3CompareMeaning4Title: { en: 'If you seek community:', ca: 'Si busques comunitat:', fr: 'Si tu cherches une communauté :' },
  dhV3CompareMeaning4Desc: { en: "Here you're not a number. You'll meet people, go to practices, and have a real dance family.", ca: "Aquí no ets un número. Coneixeràs gent, aniràs a pràctiques, i tindràs una família de ball real.", fr: "Ici, tu n'es pas un numéro. Tu rencontreras des gens, iras aux pratiques, et auras une vraie famille de danse." },
  dhV3CompareCTA: { en: 'See for yourself: first trial class', ca: 'Comprova-ho: primera classe de prova', fr: 'Vérifie par toi-même : premier cours d\'essai' },
  dhV3CompareNote: { en: 'No commitment. No tricks. No pressure.', ca: 'Sense permanència. Sense trucs. Sense pressió.', fr: 'Sans engagement. Sans astuces. Sans pression.' },

  // Salsa Cubana
  salsaCubanaLevelBasicTitle: { en: 'Basic I, II and III', ca: 'Bàsic I, II i III', fr: 'Basique I, II et III' },
  salsaCubanaLevelBasicDesc: { en: 'Consolidate fundamentals, introduce first figures, work on fluidity and perfect lead/follow technique.', ca: 'Consolida els fonaments, introdueix les primeres figures, treballa la fluïdesa i perfecciona la tècnica de guia/seguiment.', fr: 'Consolider les fondamentaux, introduire les premières figures, travailler la fluidité et perfectionner la technique de guidage/suivi.' },
  salsaCubanaWhyChoose7Title: { en: 'Annual gala + salsa parties', ca: 'Gala anual + festes salseres', fr: 'Gala annuel + soirées salsa' },
  salsaCubanaWhyChoose7Desc: { en: "Shine on a professional stage, enjoy our themed parties and live experiences you won't find at any other school in Barcelona.", ca: "Brilla en un teatre professional, gaudeix de les nostres festes temàtiques i viu experiències que no trobaràs en cap altra escola de Barcelona.", fr: "Brille sur une scène professionnelle, profite de nos soirées à thème et vis des expériences que tu ne trouveras dans aucune autre école de Barcelone." },

  // Salsa Lady Teachers
  salsaLadyTeacher2Specialty: { en: 'Cuban International Master and Artist', ca: 'Mestra i Artista Internacional Cubana', fr: 'Maître et Artiste Internationale Cubaine' },
  salsaLadyTeacher2Bio: { en: "With over 20 years of artistic career, trained at Cuba's National School of Art (ENA). Lia Valdes is a world reference in Cabaret and Lady Style, bringing scenic elegance and impeccable technique to every class.", ca: "Amb més de 20 anys de carrera artística, formada a l'Escola Nacional d'Art de Cuba (ENA). Lia Valdes és referent mundial en Cabaret i Lady Style, aportant elegància escènica i tècnica impecable a cada classe.", fr: "Avec plus de 20 ans de carrière artistique, formée à l'École Nationale d'Art de Cuba (ENA). Lia Valdes est une référence mondiale en Cabaret et Lady Style, apportant élégance scénique et technique impeccable à chaque cours." },
  salsaLadyTeacher3Specialty: { en: 'Lady Style Instructor | Feminine Technique Specialist', ca: 'Instructora de Lady Style | Especialista en Tècnica Femenina', fr: 'Instructrice de Lady Style | Spécialiste en Technique Féminine' },
  salsaLadyTeacher3Bio: { en: "Yasmina Fernández is a passionate Lady Style instructor trained in the Farray® Method. With years of experience teaching feminine technique, she stands out for her ability to connect with students and transmit the elegance and sensuality of Latin dance.", ca: "Yasmina Fernández és una apassionada instructora de Lady Style formada en el Mètode Farray®. Amb anys d'experiència en l'ensenyament de la tècnica femenina, destaca per la seva capacitat de connectar amb les alumnes i transmetre l'elegància i sensualitat del ball llatí.", fr: "Yasmina Fernández est une instructrice passionnée de Lady Style formée à la Méthode Farray®. Avec des années d'expérience dans l'enseignement de la technique féminine, elle se distingue par sa capacité à connecter avec les élèves et à transmettre l'élégance et la sensualité de la danse latine." },

  // Salsa Lady V2 Page
  salsaLadyV2PageTitle: { en: 'Salsa Lady Style Classes in Barcelona | Farray® Method', ca: 'Classes de Salsa Lady Style a Barcelona | Mètode Farray®', fr: 'Cours de Salsa Lady Style à Barcelone | Méthode Farray®' },
  salsaLadyV2MetaDescription: { en: 'Master Lady Style with the Farray® Method. Arm technique, hips, turns and heels. Cuban masters from ENA. The only structured system in Barcelona.', ca: "Domina el Lady Style amb el Mètode Farray®. Tècnica de braços, malucs, girs i talons. Mestres cubanes de l'ENA. L'únic sistema estructurat de Barcelona.", fr: "Maîtrise le Lady Style avec la Méthode Farray®. Technique des bras, hanches, tours et talons. Maîtres cubaines de l'ENA. Le seul système structuré de Barcelone." },
  salsaLadyV2HeroTitle: { en: 'Salsa Lady Style', ca: 'Salsa Lady Style', fr: 'Salsa Lady Style' },
  salsaLadyV2HeroSubtitle: { en: 'The Method That Transforms Your Dance', ca: 'El Mètode que Transforma el teu Ball', fr: 'La Méthode qui Transforme ta Danse' },
  salsaLadyV2HeroDesc: { en: 'Stop improvising on shines. Learn real feminine technique with the only structured Lady Style system in Barcelona.', ca: "Deixa d'improvisar en els shines. Aprèn tècnica femenina real amb l'únic sistema estructurat de Lady Style a Barcelona.", fr: "Arrête d'improviser sur les shines. Apprends une vraie technique féminine avec le seul système structuré de Lady Style à Barcelone." },
  salsaLadyV2CTA1: { en: 'Book Your Trial Class', ca: 'Reserva la teva Classe de Prova', fr: "Réserve ton Cours d'Essai" },
  salsaLadyV2CTA2: { en: 'See the Farray® Method', ca: 'Veure el Mètode Farray®', fr: 'Voir la Méthode Farray®' },
  salsaLadyV2ProblemTitle: { en: 'The glass ceiling of Lady Style', ca: 'El sostre de vidre del Lady Style', fr: 'Le plafond de verre du Lady Style' },
  salsaLadyV2ProblemP1: { en: "You've been dancing salsa for months (or years).", ca: 'Portes mesos (o anys) ballant salsa.', fr: 'Tu danses la salsa depuis des mois (ou des années).' },
  salsaLadyV2ProblemP2: { en: "Your follow is correct. You understand the lead. You don't get lost in the music.", ca: 'El teu follow és correcte. Entens la guia. No et perds en la música.', fr: 'Ton follow est correct. Tu comprends le guidage. Tu ne te perds pas dans la musique.' },
  salsaLadyV2ProblemP3: { en: 'But when your partner releases you for a shine...', ca: "Però quan la teva parella et deixa anar per un shine...", fr: 'Mais quand ton partenaire te lâche pour un shine...' },
  salsaLadyV2ProblemTrigger: { en: 'What happens then?', ca: 'Què passa llavors?', fr: 'Que se passe-t-il alors ?' },
  salsaLadyV2Pain1: { en: "You don't know what to do with your arms", ca: 'No saps què fer amb els braços', fr: 'Tu ne sais pas quoi faire de tes bras' },
  salsaLadyV2Pain2: { en: 'Your hips freeze', ca: 'Els teus malucs es bloquegen', fr: 'Tes hanches se bloquent' },
  salsaLadyV2Pain3: { en: "You do \"something\" but you don't know if it's right", ca: 'Fas "alguna cosa" però no saps si està bé', fr: 'Tu fais "quelque chose" mais tu ne sais pas si c\'est bien' },
  salsaLadyV2Pain4: { en: 'You see other dancers shine and think: "how do they do it?"', ca: 'Veus altres balladores brillar i penses: "com ho fan?"', fr: 'Tu vois d\'autres danseuses briller et tu penses : "comment font-elles ?"' },
  salsaLadyV2ProblemNotYou: { en: "The problem isn't you.", ca: 'El problema no ets tu.', fr: "Le problème, ce n'est pas toi." },
  salsaLadyV2ProblemRealCause: { en: 'The problem is that no one taught you real feminine technique.', ca: "El problema és que ningú et va ensenyar tècnica femenina de veritat.", fr: "Le problème, c'est que personne ne t'a enseigné la vraie technique féminine." },
  salsaLadyV2DiagnosisTitle: { en: "Why your Lady Style isn't progressing", ca: 'Per què el teu Lady Style no progressa', fr: 'Pourquoi ton Lady Style ne progresse pas' },
  salsaLadyV2DiagnosisSubtitle: { en: "(And why it's not your fault)", ca: '(I per què no és culpa teva)', fr: "(Et pourquoi ce n'est pas ta faute)" },
  salsaLadyV2DiagnosisIntro: { en: "Most academies DON'T have a structured Lady Style system.", ca: "La majoria d'acadèmies NO tenen un sistema de Lady Style estructurat.", fr: "La plupart des académies N'ONT PAS un système de Lady Style structuré." },
  salsaLadyV2DiagnosisOthersTitle: { en: 'What other academies do:', ca: 'El que fan altres acadèmies:', fr: 'Ce que font les autres académies :' },
  salsaLadyV2DiagnosisBad1: { en: 'Standalone classes without logical progression', ca: 'Classes soltes sense progressió lògica', fr: 'Cours isolés sans progression logique' },
  salsaLadyV2DiagnosisBad2: { en: 'Teachers who teach "what they learned" without methodology', ca: 'Professores que ensenyen "el que van aprendre" sense metodologia', fr: 'Professeurs qui enseignent "ce qu\'elles ont appris" sans méthodologie' },
  salsaLadyV2DiagnosisBad3: { en: 'They mix beginners with advanced in the same class', ca: 'Barrejen principiants amb avançades a la mateixa classe', fr: 'Elles mélangent débutantes et avancées dans le même cours' },
  salsaLadyV2DiagnosisBad4: { en: 'They copy YouTube choreographies without teaching base technique', ca: 'Copien coreografies de YouTube sense ensenyar tècnica base', fr: 'Elles copient des chorégraphies YouTube sans enseigner la technique de base' },
  salsaLadyV2DiagnosisBad5: { en: 'They ignore musicality and expression', ca: "Ignoren la musicalitat i l'expressió", fr: "Elles ignorent la musicalité et l'expression" },
  salsaLadyV2DiagnosisBad6: { en: 'No clear levels or defined objectives', ca: 'No hi ha nivells clars ni objectius definits', fr: "Pas de niveaux clairs ni d'objectifs définis" },
  salsaLadyV2DiagnosisResult: { en: "The result: you've been at it for months and you're still doing the same basic movements.", ca: 'El resultat: portes mesos i segueixes fent els mateixos moviments bàsics.', fr: 'Le résultat : tu en es là depuis des mois et tu fais toujours les mêmes mouvements de base.' },
  salsaLadyV2DiagnosisFarrayTitle: { en: "At Farray's it's different. The Farray® Method is the only Lady Style system in Barcelona with:", ca: "A Farray's és diferent. El Mètode Farray® és l'únic sistema de Lady Style a Barcelona amb:", fr: "Chez Farray's, c'est différent. La Méthode Farray® est le seul système de Lady Style à Barcelone avec :" },
  salsaLadyV2DiagnosisGood1: { en: 'Proven teaching structure', ca: 'Estructura didàctica provada', fr: 'Structure pédagogique éprouvée' },
  salsaLadyV2DiagnosisGood2: { en: 'Clear levels with specific objectives', ca: 'Nivells clars amb objectius específics', fr: 'Niveaux clairs avec objectifs spécifiques' },
  salsaLadyV2DiagnosisGood3: { en: 'Measurable technical progression', ca: 'Progressió tècnica mesurable', fr: 'Progression technique mesurable' },
  salsaLadyV2DiagnosisGood4: { en: 'Cuban master trained at ENA', ca: "Mestra cubana formada a l'ENA", fr: "Maître cubaine formée à l'ENA" },
  salsaLadyV2WhatIsTitle: { en: 'What is Salsa Lady Style and why will it transform your dance?', ca: 'Què és el Salsa Lady Style i per què transformarà el teu ball?', fr: 'Qu\'est-ce que le Salsa Lady Style et pourquoi transformera-t-il ta danse ?' },
  salsaLadyV2WhatIsDesc: { en: 'Salsa Lady Style is the discipline that develops your feminine technique within salsa dancing. Unlike partner classes, Lady Style focuses 100% on you.', ca: "El Salsa Lady Style és la disciplina que desenvolupa la teva tècnica femenina dins del ball de salsa. A diferència de les classes en parella, el Lady Style s'enfoca 100% en tu.", fr: 'Le Salsa Lady Style est la discipline qui développe ta technique féminine dans la danse salsa. Contrairement aux cours en couple, le Lady Style se concentre 100% sur toi.' },
  salsaLadyV2Focus1: { en: 'Your elegance', ca: 'La teva elegància', fr: 'Ton élégance' },
  salsaLadyV2Focus2: { en: 'Your arm work', ca: 'El teu braceig', fr: 'Ton travail des bras' },
  salsaLadyV2Focus3: { en: 'Your way of walking', ca: 'La teva forma de caminar', fr: 'Ta façon de marcher' },
  salsaLadyV2Focus4: { en: 'Your turns', ca: 'Els teus girs', fr: 'Tes tours' },
  salsaLadyV2Focus5: { en: 'Your stage presence', ca: 'La teva presència escènica', fr: 'Ta présence scénique' },
  salsaLadyV2Focus6: { en: 'Your musical interpretation', ca: 'La teva interpretació musical', fr: 'Ton interprétation musicale' },
  salsaLadyV2Quote: { en: "It's not just about steps. It's about how you move, how you occupy space and how you transmit femininity in every movement.", ca: "No es tracta només de passos. Es tracta de com et mous, com ocupes l'espai i com transmets feminitat en cada moviment.", fr: "Ce n'est pas qu'une question de pas. C'est ta façon de bouger, d'occuper l'espace et de transmettre la féminité dans chaque mouvement." },
  salsaLadyV2PillarsTitle: { en: 'The Farray® Method: The 6 Pillars of Lady Style', ca: 'El Mètode Farray®: Els 6 Pilars del Lady Style', fr: 'La Méthode Farray® : Les 6 Piliers du Lady Style' },
  salsaLadyV2PillarsSubtitle: { en: 'The complete system that develops every aspect of your feminine technique', ca: 'El sistema complet que desenvolupa cada aspecte de la teva tècnica femenina', fr: 'Le système complet qui développe chaque aspect de ta technique féminine' },
  salsaLadyV2Pillar1Title: { en: 'Arm Technique', ca: 'Tècnica de Braceig', fr: 'Technique des Bras' },
  salsaLadyV2Pillar1Subtitle: { en: 'The art of expressive arms', ca: 'L\'art dels braços expressius', fr: 'L\'art des bras expressifs' },
  salsaLadyV2Pillar1Desc: { en: 'Learn to use your arms as an extension of your body, creating elegant lines and fluid movements that complement every step.', ca: 'Aprèn a utilitzar els teus braços com a extensió del teu cos, creant línies elegants i moviments fluids que complementen cada pas.', fr: 'Apprends à utiliser tes bras comme une extension de ton corps, créant des lignes élégantes et des mouvements fluides qui complètent chaque pas.' },
  salsaLadyV2Pillar1Item1: { en: 'Elegant and defined lines', ca: 'Línies elegants i definides', fr: 'Lignes élégantes et définies' },
  salsaLadyV2Pillar1Item2: { en: 'Arm-body coordination', ca: 'Coordinació braços-cos', fr: 'Coordination bras-corps' },
  salsaLadyV2Pillar1Item3: { en: 'Port de bras with Cuban technique', ca: 'Port de bras amb tècnica cubana', fr: 'Port de bras avec technique cubaine' },
  salsaLadyV2Pillar1Result: { en: 'From stiff arms to extensions that mesmerize.', ca: 'De braços rígids a extensions que hipnotitzen.', fr: 'De bras rigides à des extensions qui hypnotisent.' },
  salsaLadyV2Pillar2Title: { en: 'Hip Control', ca: 'Control de Malucs', fr: 'Contrôle des Hanches' },
  salsaLadyV2Pillar2Subtitle: { en: 'Movement with intention', ca: 'Moviment amb intenció', fr: 'Mouvement avec intention' },
  salsaLadyV2Pillar2Desc: { en: 'Master the hypnotic hip movement with authentic Cuban technique. Each movement has purpose and transmits femininity.', ca: 'Domina el moviment hipnòtic de malucs amb tècnica cubana autèntica. Cada moviment té propòsit i transmet feminitat.', fr: 'Maîtrise le mouvement hypnotique des hanches avec une technique cubaine authentique. Chaque mouvement a un but et transmet la féminité.' },
  salsaLadyV2Pillar2Item1: { en: 'Dissociation and isolation', ca: 'Dissociació i aïllació', fr: 'Dissociation et isolation' },
  salsaLadyV2Pillar2Item2: { en: 'Figure eights and circular movements', ca: 'Vuits i moviments circulars', fr: 'Huit et mouvements circulaires' },
  salsaLadyV2Pillar2Item3: { en: 'Controlled undulations', ca: 'Ondulacions controlades', fr: 'Ondulations contrôlées' },
  salsaLadyV2Pillar2Result: { en: 'From blocked hips to sensual and controlled movement.', ca: 'De malucs bloquejats a moviment sensual i controlat.', fr: 'De hanches bloquées à un mouvement sensuel et contrôlé.' },
  salsaLadyV2Pillar3Title: { en: 'Turns with Elegance', ca: 'Girs amb Elegància', fr: 'Tours avec Élégance' },
  salsaLadyV2Pillar3Subtitle: { en: 'Balance and fluidity', ca: 'Equilibri i fluïdesa', fr: 'Équilibre et fluidité' },
  salsaLadyV2Pillar3Desc: { en: 'Turn technique that combines balance, grace and control. From simple to multiple, always with elegance.', ca: 'Tècnica de girs que combina equilibri, gràcia i control. Des de simples fins a múltiples, sempre amb elegància.', fr: 'Technique de tours qui combine équilibre, grâce et contrôle. De simples à multiples, toujours avec élégance.' },
  salsaLadyV2Pillar3Item1: { en: 'Preparation, spot and entry', ca: 'Preparació, spot i entrada', fr: 'Préparation, spot et entrée' },
  salsaLadyV2Pillar3Item2: { en: 'Center control', ca: 'Control del centre', fr: 'Contrôle du centre' },
  salsaLadyV2Pillar3Item3: { en: 'Multiple turns with style', ca: 'Girs múltiples amb estil', fr: 'Tours multiples avec style' },
  salsaLadyV2Pillar3Result: { en: 'From wobbly turns to clean and elegant spins.', ca: 'De girs trontollants a voltes netes i elegants.', fr: 'De tours vacillants à des pirouettes nettes et élégantes.' },
  salsaLadyV2Pillar4Title: { en: 'Heel Mastery', ca: 'Domini de Talons', fr: 'Maîtrise des Talons' },
  salsaLadyV2Pillar4Subtitle: { en: 'Safety and style', ca: 'Seguretat i estil', fr: 'Sécurité et style' },
  salsaLadyV2Pillar4Desc: { en: 'Learn to walk, dance and turn in heels like a professional. Confidence in every step.', ca: 'Aprèn a caminar, ballar i girar amb talons com una professional. Confiança en cada pas.', fr: 'Apprends à marcher, danser et tourner en talons comme une professionnelle. Confiance à chaque pas.' },
  salsaLadyV2Pillar4Item1: { en: 'Walking elegantly on stilettos', ca: 'Caminar amb elegància sobre stilettos', fr: 'Marcher élégamment sur des stilettos' },
  salsaLadyV2Pillar4Item2: { en: 'Stability and balance', ca: 'Estabilitat i equilibri', fr: 'Stabilité et équilibre' },
  salsaLadyV2Pillar4Item3: { en: 'Heel and toe play', ca: 'Joc de taló i punta', fr: 'Jeu talon et pointe' },
  salsaLadyV2Pillar4Result: { en: 'From insecurity to total heel mastery.', ca: 'D\'inseguretat a domini total sobre els talons.', fr: 'De l\'insécurité à la maîtrise totale des talons.' },
  salsaLadyV2Pillar5Title: { en: 'Musicality', ca: 'Musicalitat', fr: 'Musicalité' },
  salsaLadyV2Pillar5Subtitle: { en: 'Interpreting the music', ca: 'Interpretar la música', fr: 'Interpréter la musique' },
  salsaLadyV2Pillar5Desc: { en: 'Understand Latin music in depth: clave, timings, accents. Your body becomes an instrument.', ca: 'Entén la música llatina en profunditat: clau, temps, accents. El teu cos es converteix en instrument.', fr: 'Comprends la musique latine en profondeur : clave, temps, accents. Ton corps devient un instrument.' },
  salsaLadyV2Pillar5Item1: { en: 'Identifying accents and changes', ca: 'Identificar accents i canvis', fr: 'Identifier les accents et les changements' },
  salsaLadyV2Pillar5Item2: { en: 'Interpreting music with the body', ca: 'Interpretar la música amb el cos', fr: 'Interpréter la musique avec le corps' },
  salsaLadyV2Pillar5Item3: { en: 'Playing with speed and dynamics', ca: 'Jugar amb la velocitat i dinàmica', fr: 'Jouer avec la vitesse et la dynamique' },
  salsaLadyV2Pillar5Result: { en: 'From executing steps to interpreting songs.', ca: 'D\'executar passos a interpretar cançons.', fr: 'D\'exécuter des pas à interpréter des chansons.' },
  salsaLadyV2Pillar6Title: { en: 'Stage Presence', ca: 'Presència Escènica', fr: 'Présence Scénique' },
  salsaLadyV2Pillar6Subtitle: { en: 'Attitude and confidence', ca: 'Actitud i confiança', fr: 'Attitude et confiance' },
  salsaLadyV2Pillar6Desc: { en: 'Develop your own personality in dance. Attitude, gaze and confidence that captivate.', ca: 'Desenvolupa la teva pròpia personalitat en el ball. Actitud, mirada i confiança que captiven.', fr: 'Développe ta propre personnalité dans la danse. Attitude, regard et confiance qui captivent.' },
  salsaLadyV2Pillar6Item1: { en: 'Energy projection', ca: "Projecció d'energia", fr: "Projection d'énergie" },
  salsaLadyV2Pillar6Item2: { en: 'Use of the gaze', ca: 'Ús de la mirada', fr: 'Utilisation du regard' },
  salsaLadyV2Pillar6Item3: { en: 'Attitude and self-confidence', ca: 'Actitud i confiança en tu mateixa', fr: 'Attitude et confiance en soi' },
  salsaLadyV2Pillar6Result: { en: 'From dancing "inward" to shining outward.', ca: 'De ballar "cap a dins" a brillar cap a fora.', fr: 'De danser "vers l\'intérieur" à briller vers l\'extérieur.' },
  salsaLadyV2PersuasiveBlockTitle: { en: 'Why is the Farray Method different?', ca: 'Per què el Mètode Farray és diferent?', fr: 'Pourquoi la Méthode Farray est-elle différente ?' },
  salsaLadyV2CompareTitle: { en: 'Traditional Lady Style vs. Farray® Method', ca: 'Lady Style tradicional vs. Mètode Farray®', fr: 'Lady Style traditionnel vs. Méthode Farray®' },
  salsaLadyV2CompareAspect: { en: 'Aspect', ca: 'Aspecte', fr: 'Aspect' },
  salsaLadyV2CompareOthers: { en: 'Other academies', ca: 'Altres acadèmies', fr: 'Autres académies' },
  salsaLadyV2CompareFarray: { en: 'Farray® Method', ca: 'Mètode Farray®', fr: 'Méthode Farray®' },
  salsaLadyV2CompareRow1Label: { en: 'Teaching system', ca: "Sistema d'ensenyament", fr: "Système d'enseignement" },
  salsaLadyV2CompareRow1Others: { en: 'Standalone classes without structure', ca: 'Classes soltes sense estructura', fr: 'Cours isolés sans structure' },
  salsaLadyV2CompareRow1Farray: { en: 'Progressive 3-level system', ca: 'Sistema progressiu de 3 nivells', fr: 'Système progressif à 3 niveaux' },
  salsaLadyV2CompareRow2Label: { en: 'Teacher training', ca: 'Formació del professorat', fr: 'Formation des enseignants' },
  salsaLadyV2CompareRow2Others: { en: 'Teachers who teach "by ear"', ca: 'Professores que ensenyen "d\'oïda"', fr: 'Professeurs qui enseignent "à l\'oreille"' },
  salsaLadyV2CompareRow2Farray: { en: 'Cuban master trained at ENA Cuba', ca: "Mestra cubana formada a l'ENA Cuba", fr: "Maître cubaine formée à l'ENA Cuba" },
  salsaLadyV2CompareRow3Label: { en: 'Groups', ca: 'Grups', fr: 'Groupes' },
  salsaLadyV2CompareRow3Others: { en: 'They mix all levels', ca: 'Barrejen tots els nivells', fr: 'Ils mélangent tous les niveaux' },
  salsaLadyV2CompareRow3Farray: { en: 'Groups separated by technical level', ca: 'Grups separats per nivell tècnic', fr: 'Groupes séparés par niveau technique' },
  salsaLadyV2CompareRow4Label: { en: 'Content', ca: 'Contingut', fr: 'Contenu' },
  salsaLadyV2CompareRow4Others: { en: 'They copy YouTube choreographies', ca: 'Copien coreografies de YouTube', fr: 'Ils copient des chorégraphies YouTube' },
  salsaLadyV2CompareRow4Farray: { en: 'Base technique before choreographies', ca: 'Tècnica base abans de coreografies', fr: 'Technique de base avant les chorégraphies' },
  salsaLadyV2CompareRow5Label: { en: 'Musicality', ca: 'Musicalitat', fr: 'Musicalité' },
  salsaLadyV2CompareRow5Others: { en: 'Only movements, no musicality', ca: 'Només moviments, sense musicalitat', fr: 'Seulement des mouvements, pas de musicalité' },
  salsaLadyV2CompareRow5Farray: { en: 'Integrated musical interpretation', ca: 'Interpretació musical integrada', fr: 'Interprétation musicale intégrée' },
  salsaLadyV2CompareRow6Label: { en: 'Style', ca: 'Estil', fr: 'Style' },
  salsaLadyV2CompareRow6Others: { en: 'Generic "international" style', ca: 'Estil genèric "internacional"', fr: 'Style générique "international"' },
  salsaLadyV2CompareRow6Farray: { en: 'Cuban authenticity in every class', ca: 'Autenticitat cubana a cada classe', fr: 'Authenticité cubaine à chaque cours' },
  salsaLadyV2CompareRow7Label: { en: 'Progression', ca: 'Progressió', fr: 'Progression' },
  salsaLadyV2CompareRow7Others: { en: 'No clear progression', ca: 'Sense progressió clara', fr: 'Pas de progression claire' },
  salsaLadyV2CompareRow7Farray: { en: 'Defined objectives by level', ca: 'Objectius definits per nivell', fr: 'Objectifs définis par niveau' },
  salsaLadyV2CompareRow8Label: { en: 'Requirements', ca: 'Requisits', fr: 'Prérequis' },
  salsaLadyV2CompareRow8Others: { en: 'Suitable for anyone', ca: 'Apta per a qualsevol', fr: 'Convient à tout le monde' },
  salsaLadyV2CompareRow8Farray: { en: 'Requirement: Cuban salsa base', ca: 'Requisit: base de salsa cubana', fr: 'Prérequis : base de salsa cubaine' },
  salsaLadyV2ForWhoTitle: { en: 'Is Farray® Lady Style for you?', ca: 'És el Lady Style Farray® per a tu?', fr: 'Le Lady Style Farray® est-il pour toi ?' },
  salsaLadyV2ForYesTitle: { en: 'YES it\'s for you if:', ca: 'SÍ és per a tu si:', fr: 'OUI c\'est pour toi si :' },
  salsaLadyV2ForYes1: { en: 'You already dance salsa (Cuban or in line) and have a technical base', ca: 'Ja balles salsa (cubana o en línia) i tens base tècnica', fr: 'Tu danses déjà la salsa (cubaine ou en ligne) et tu as une base technique' },
  salsaLadyV2ForYes2: { en: 'You want to develop your own style to shine on the floor', ca: 'Vols desenvolupar el teu estil propi per brillar a la pista', fr: 'Tu veux développer ton propre style pour briller sur la piste' },
  salsaLadyV2ForYes3: { en: 'You feel your arm/hip technique could be better', ca: 'Sents que la teva tècnica de braços/malucs és millorable', fr: 'Tu sens que ta technique des bras/hanches pourrait être meilleure' },
  salsaLadyV2ForYes4: { en: "When you're released you don't know what to do", ca: 'Quan et deixen anar no saps què fer', fr: 'Quand on te lâche, tu ne sais pas quoi faire' },
  salsaLadyV2ForYes5: { en: 'You want to learn heel technique with methodology', ca: 'Vols aprendre tècnica de talons amb metodologia', fr: 'Tu veux apprendre la technique des talons avec méthodologie' },
  salsaLadyV2ForYes6: { en: "You're stuck at your current academy", ca: 'Estàs estancada a la teva acadèmia actual', fr: 'Tu stagnes dans ton académie actuelle' },
  salsaLadyV2ForYes7: { en: "You're looking for a progressive system, not standalone classes", ca: 'Busques un sistema progressiu, no classes soltes', fr: 'Tu cherches un système progressif, pas des cours isolés' },
  salsaLadyV2ForYes8: { en: 'You want to prepare for performances/competitions', ca: 'Vols preparar-te per actuacions/competicions', fr: 'Tu veux te préparer pour des performances/compétitions' },
  salsaLadyV2ForNoTitle: { en: 'NOT for you if:', ca: 'NO és per a tu si:', fr: 'PAS pour toi si :' },
  salsaLadyV2ForNo1: { en: "You've never danced salsa (start with Cuban Salsa Level 0)", ca: 'Mai has ballat salsa (comença per Salsa Cubana Nivell 0)', fr: "Tu n'as jamais dansé la salsa (commence par Salsa Cubaine Niveau 0)" },
  salsaLadyV2ForNo2: { en: "You're looking for fitness classes without real technique", ca: 'Busques classes de fitness sense tècnica real', fr: 'Tu cherches des cours de fitness sans vraie technique' },
  salsaLadyV2ForNo3: { en: 'You want results without effort or practice', ca: 'Vols resultats sense esforç ni pràctica', fr: 'Tu veux des résultats sans effort ni pratique' },
  salsaLadyV2ForNo4: { en: 'You prefer classes where they mix all levels', ca: 'Prefereixes classes on barrejen tots els nivells', fr: 'Tu préfères les cours où ils mélangent tous les niveaux' },
  salsaLadyV2ForWhoCTA: { en: 'If you said "yes" to 3 or more points, Farray® Lady Style is for you.', ca: 'Si has dit "sí" a 3 o més punts, el Lady Style Farray® és per a tu.', fr: 'Si tu as dit "oui" à 3 points ou plus, le Lady Style Farray® est pour toi.' },
  salsaLadyV2TransformTitle: { en: 'Your Before and After with Farray® Lady Style', ca: 'El teu Abans i Després amb Lady Style Farray®', fr: 'Ton Avant et Après avec Lady Style Farray®' },
  salsaLadyV2TransformAspect: { en: 'Aspect', ca: 'Aspecte', fr: 'Aspect' },
  salsaLadyV2TransformBefore: { en: 'BEFORE', ca: 'ABANS', fr: 'AVANT' },
  salsaLadyV2TransformAfter: { en: 'AFTER', ca: 'DESPRÉS', fr: 'APRÈS' },
  salsaLadyV2TransformbrazosLabel: { en: 'Arms', ca: 'Braços', fr: 'Bras' },
  salsaLadyV2TransformbrazosBefore: { en: 'Stiff, not knowing what to do', ca: 'Rígids, sense saber què fer', fr: 'Rigides, sans savoir quoi faire' },
  salsaLadyV2TransformbrazosAfter: { en: 'Fluid, elegant, expressive', ca: 'Fluids, elegants, expressius', fr: 'Fluides, élégants, expressifs' },
  salsaLadyV2TransformcaderasLabel: { en: 'Hips', ca: 'Malucs', fr: 'Hanches' },
  salsaLadyV2TransformcaderasBefore: { en: 'Blocked or out of control', ca: 'Bloquejats o descontrolats', fr: 'Bloquées ou incontrôlées' },
  salsaLadyV2TransformcaderasAfter: { en: 'Sensual and controlled movement', ca: 'Moviment sensual i controlat', fr: 'Mouvement sensuel et contrôlé' },
  salsaLadyV2TransformgirosLabel: { en: 'Turns', ca: 'Girs', fr: 'Tours' },
  salsaLadyV2TransformgirosBefore: { en: 'Wobbly, off balance', ca: 'Trontollants, sense equilibri', fr: 'Vacillants, sans équilibre' },
  salsaLadyV2TransformgirosAfter: { en: 'Clean, multiple, with style', ca: 'Nets, múltiples, amb estil', fr: 'Nets, multiples, avec style' },
  salsaLadyV2TransformtaconesLabel: { en: 'Heels', ca: 'Talons', fr: 'Talons' },
  salsaLadyV2TransformtaconesBefore: { en: 'Insecurity, stumbles', ca: 'Inseguretat, ensopegades', fr: 'Insécurité, trébuchements' },
  salsaLadyV2TransformtaconesAfter: { en: 'Total mastery, elegance', ca: 'Domini total, elegància', fr: 'Maîtrise totale, élégance' },
  salsaLadyV2TransformshinesLabel: { en: 'Shines', ca: 'Shines', fr: 'Shines' },
  salsaLadyV2TransformshinesBefore: { en: 'Repeating 2-3 movements', ca: 'Repetint 2-3 moviments', fr: 'Répétant 2-3 mouvements' },
  salsaLadyV2TransformshinesAfter: { en: 'Wide repertoire and personal style', ca: 'Ampli repertori i estil personal', fr: 'Large répertoire et style personnel' },
  salsaLadyV2TransformpresenciaLabel: { en: 'Presence', ca: 'Presència', fr: 'Présence' },
  salsaLadyV2TransformpresenciaBefore: { en: 'Dancing "inward"', ca: 'Ballant "cap a dins"', fr: 'Danser "vers l\'intérieur"' },
  salsaLadyV2TransformpresenciaAfter: { en: 'Owning the floor with confidence', ca: 'Dominant la pista amb confiança', fr: 'Dominer la piste avec confiance' },
};

// Save translations for processing
fs.writeFileSync(
  path.join(rootDir, 'translations_en.json'),
  JSON.stringify(
    Object.fromEntries(Object.entries(translations).map(([k, v]) => [k, v.en])),
    null,
    2
  )
);
fs.writeFileSync(
  path.join(rootDir, 'translations_ca.json'),
  JSON.stringify(
    Object.fromEntries(Object.entries(translations).map(([k, v]) => [k, v.ca])),
    null,
    2
  )
);
fs.writeFileSync(
  path.join(rootDir, 'translations_fr.json'),
  JSON.stringify(
    Object.fromEntries(Object.entries(translations).map(([k, v]) => [k, v.fr])),
    null,
    2
  )
);

console.log(`Generated ${Object.keys(translations).length} translations for phase 1`);

// Function to add translations to a locale file
function addTranslationsToLocale(locale, localeFile, keysToAdd) {
  const content = fs.readFileSync(localeFile, 'utf8');

  // Find the position to insert (before the closing of the object)
  const lines = content.split('\n');
  let insertIndex = lines.length - 1;

  // Find the line with "} as const;" that closes the main object
  for (let i = lines.length - 1; i >= 0; i--) {
    const trimmed = lines[i].trim();
    if (trimmed === '} as const;' || trimmed === '};' || trimmed === '}') {
      insertIndex = i;
      break;
    }
  }

  // Generate the new translations to add
  const newTranslations = keysToAdd.map(({ key, value }) => {
    // Check if we have a proper translation
    let translation = value; // Default to Spanish
    if (translations[key] && translations[key][locale]) {
      translation = translations[key][locale];
    }

    // Escape properly - use double quotes for strings with apostrophes
    const hasApostrophe = translation.includes("'");
    if (hasApostrophe) {
      return `  ${key}: "${translation.replace(/"/g, '\\"')}",`;
    }
    return `  ${key}: '${translation.replace(/'/g, "\\'")}',`;
  });

  // Insert the new translations
  const header = `\n  // === AUTO-ADDED TRANSLATIONS (${new Date().toISOString().split('T')[0]}) ===`;
  lines.splice(insertIndex, 0, header, ...newTranslations);

  return lines.join('\n');
}

// Get existing keys from a locale file
function getExistingKeys(localeFile) {
  const content = fs.readFileSync(localeFile, 'utf8');
  const existingKeys = new Set();
  const regex = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    existingKeys.add(match[1]);
  }
  return existingKeys;
}

// Process each locale
const locales = {
  ca: path.join(rootDir, 'i18n', 'locales', 'ca.ts'),
  en: path.join(rootDir, 'i18n', 'locales', 'en.ts'),
  fr: path.join(rootDir, 'i18n', 'locales', 'fr.ts'),
};

console.log('\nAdding missing translations to locale files...\n');

for (const [locale, localeFile] of Object.entries(locales)) {
  const existingKeys = getExistingKeys(localeFile);
  const keysToAdd = missingTranslations.filter(t => !existingKeys.has(t.key));

  if (keysToAdd.length > 0) {
    console.log(`${locale.toUpperCase()}: Adding ${keysToAdd.length} missing translations...`);
    const updatedContent = addTranslationsToLocale(locale, localeFile, keysToAdd);
    fs.writeFileSync(localeFile, updatedContent, 'utf8');

    // Count how many have proper translations vs placeholders
    const properTranslations = keysToAdd.filter(k => translations[k.key] && translations[k.key][locale]).length;
    console.log(`  - ${properTranslations} with proper translations`);
    console.log(`  - ${keysToAdd.length - properTranslations} with Spanish placeholders (need review)`);
  } else {
    console.log(`${locale.toUpperCase()}: No missing translations to add.`);
  }
}

console.log('\n=== Done! ===');
console.log('Note: Translations marked as Spanish placeholders need professional review.');
