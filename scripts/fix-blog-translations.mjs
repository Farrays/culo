import fs from 'fs';

const esData = JSON.parse(fs.readFileSync('i18n/locales/es/blog.json', 'utf8'));
const esKeys = Object.keys(esData);

const translations = {
  ca: {
    blogBeneficiosSalsa_heroAlt: "Grup de ball somrient ballant salsa cubana en acadèmia de Barcelona, demostrant els beneficis cardiovasculars i emocionals del ball llatí",
    blogHistoriaSalsa_heroAlt: "Mural artístic amb elements culturals de Cuba, representant les arrels musicals i dancístiques de la salsa i la seva herència afrocaribenca",
    blogSalsaRitmo_heroAlt: "Ballarins ballant salsa cubana a Barcelona, representant aquest estil llatí que va conquerir el món des de Nova York, Cali i Puerto Rico",
    blogHistoriaBachata_heroAlt: "Grup de ball ballant bachata sensual a Barcelona, reflectint l'evolució del gènere des dels barris de República Dominicana fins a Patrimoni UNESCO 2019",
    blogClasesSalsaBarcelona_heroAlt: "Parella connectant a través del ball de salsa en pista social de Barcelona, expressant la comunicació no verbal i el llenguatge universal del ritme llatí",
    blogPerderMiedoBailar_heroAlt: "Alumnes que van ser principiants i van superar l'ansietat i la por escènica, guiats pels professors de la nostra acadèmia de ball a Barcelona",
    blogPerderMiedoBailar_sourcePublisherBehavioral: "Farray's Dance Center + Psicologia Conductual",
    blogPerderMiedoBailar_refExposureTitle: "Teràpia d'Exposició per a Trastorns d'Ansietat – PMC",
    blogPerderMiedoBailar_refExposureDesc: "Revisió sistemàtica de l'eficàcia de la teràpia d'exposició per a trastorns d'ansietat, aplicable a la por escènica en el ball.",
    blogPerderMiedoBailar_refDancePsychTitle: "Psicologia del Ball i Benestar Emocional – PMC",
    blogPerderMiedoBailar_refDancePsychDesc: "Investigació sobre els mecanismes psicològics pels quals el ball millora el benestar emocional i redueix l'ansietat.",
    blogPerderMiedoBailar_refEndorphinsSyncTitle: "Ballar en Sincronia i Alliberament d'Endorfines",
    blogPerderMiedoBailar_refEndorphinsSyncDesc: "Estudi que demostra com el ball sincronitzat augmenta els nivells d'endorfines i enforteix els vincles socials.",
    blogAcademiaDanza_section1Metodo: "A [Farray's International Dance Center](/ca/clases) tot això s'articula a través del [Mètode Farray](/ca/metodo-farray), el sistema pedagògic que he desenvolupat a partir de la meva formació a l'Escola Nacional d'Art de Cuba i de més de 20 anys ensenyant a europeus. No es tracta d'\"ensenyar com a Cuba\", sinó de traduir aquesta tradició a la realitat de qui entra a la meva acadèmia amb 30, 40 o 50 anys i un cos que ha passat més hores en una oficina que en un escenari.",
    blogAcademiaDanza_section5Intro: "Quan vaig arribar a Europa, al principi vaig intentar ensenyar tal com ho havia après a Cuba. Aviat em vaig adonar que alguna cosa no encaixava. No amb la dansa, sinó amb el context. A Cuba, un jove que entra a l'ENA als 14 anys porta tota la vida envoltat de clau, rumba, comparsa... El cos ja està \"despert\". A Barcelona, moltes persones creuen per primera vegada la porta d'una acadèmia de dansa als 30, amb el cap ple d'Excel i poc contacte amb el propi cos. Pretendre que reaccionin igual és injust.",
    blogAcademiaDanza_conclusionCTA: "Busca una acadèmia de dansa a Barcelona on es prenguin seriosament el teu cos, el teu temps i el teu procés. On el professor sigui també pedagog, on existeixi un mètode, on puguis créixer de nivell i d'estil, i on, en entrar per la porta, sentis que no has de demostrar res per ser benvingut. Si decideixes que aquest lloc sigui [Farray's International Dance Center](/ca/clases), aquí t'esperaré amb el meu equip i amb el [Mètode Farray](/ca/metodo-farray) llest per treballar amb tu. I si tries una altra acadèmia, m'alegrarà igualment saber que aquest text t'ha ajudat a prendre una decisió més conscient. L'important, de debò, és que no et quedis amb les ganes de ballar.",
    blog_authorRoleDaniel: "Professor de Ballet i Dansa Contemporània",
    blog_authorBioDaniel: "Daniel Sené es va formar a l'Escola Nacional de Ballet de Cuba, una de les institucions clàssiques més prestigioses del món. Especialitzat en ballet clàssic, dansa contemporània i ioga per a ballarins, aporta la seva experiència cubana als alumnes de Farray's International Dance Center a Barcelona.",
    blog_credential_escuelaNacionalBallet: "Escola Nacional de Ballet de Cuba",
    blog_credential_balletContemporaneo: "Ballet Clàssic i Contemporani",
    blog_credential_yogaBailarines: "Ioga per a Ballarins",
    blog_authorRoleAlejandro: "Professor de Modern Jazz i Contemporani",
    blog_authorBioAlejandro: "Ballarí professional cubà format a l'ENA i ex solista de la prestigiosa Companyia Carlos Acosta. Especialista en la fusió de tècniques clàssiques, jazz i contemporani.",
    blog_credential_companiaCarlosAcosta: "Ex solista Companyia Carlos Acosta",
    blog_credential_enaCuba: "Formació ENA Cuba",
    blog_credential_contemporaneoModernJazz: "Especialista en Contemporani i Modern Jazz",
  },
  en: {
    blog_authorRoleDaniel: "Ballet and Contemporary Dance Instructor",
    blog_authorBioDaniel: "Daniel Sené trained at the National Ballet School of Cuba, one of the most prestigious classical institutions in the world. Specialized in classical ballet, contemporary dance, and yoga for dancers, he brings his Cuban experience to students at Farray's International Dance Center in Barcelona.",
    blog_credential_escuelaNacionalBallet: "National Ballet School of Cuba",
    blog_credential_balletContemporaneo: "Classical Ballet and Contemporary Dance",
    blog_credential_yogaBailarines: "Yoga for Dancers",
    blog_authorRoleAlejandro: "Modern Jazz and Contemporary Dance Instructor",
    blog_authorBioAlejandro: "Cuban professional dancer trained at the ENA and former soloist of the prestigious Carlos Acosta Company. Specialist in the fusion of classical, jazz, and contemporary techniques.",
    blog_credential_companiaCarlosAcosta: "Former Soloist, Carlos Acosta Company",
    blog_credential_enaCuba: "ENA Cuba Training",
    blog_credential_contemporaneoModernJazz: "Specialist in Contemporary and Modern Jazz",
    blogPerderMiedoBailar_refExposureTitle: "Exposure Therapy for Anxiety Disorders – PMC",
    blogPerderMiedoBailar_refExposureDesc: "Systematic review of the efficacy of exposure therapy for anxiety disorders, applicable to stage fright in dance.",
    blogPerderMiedoBailar_refDancePsychTitle: "Dance Psychology and Emotional Well-being – PMC",
    blogAcademiaDanza_section1Metodo: "At [Farray's International Dance Center](/en/clases), all of this is structured through the [Farray Method](/en/metodo-farray), the pedagogical system I developed from my training at Cuba's National School of Art and over 20 years of teaching Europeans. It's not about \"teaching like in Cuba\", but about translating that tradition to the reality of someone who walks into my academy at 30, 40, or 50 years old with a body that has spent more hours at a desk than on a stage.",
    blogAcademiaDanza_section5Intro: "When I arrived in Europe, at first I tried to teach exactly as I had learned in Cuba. I soon realized something didn't fit. Not with the dance, but with the context. In Cuba, a young person who enters the ENA at 14 has spent their entire life surrounded by clave, rumba, comparsa... The body is already \"awake\". In Barcelona, many people cross the door of a dance academy for the first time at 30, with their head full of spreadsheets and little connection with their own body. Expecting them to react the same way is unfair.",
    blogAcademiaDanza_conclusionCTA: "Look for a dance academy in Barcelona that takes your body, your time, and your process seriously. Where the teacher is also a pedagogue, where there is a method, where you can grow in level and style, and where, upon walking through the door, you feel you don't have to prove anything to be welcome. If you decide that place is [Farray's International Dance Center](/en/clases), I'll be waiting here with my team and the [Farray Method](/en/metodo-farray) ready to work with you. And if you choose another academy, I'll still be glad to know this text helped you make a more conscious decision. What truly matters is that you don't hold back from dancing.",
  },
  fr: {
    blog_authorRoleDaniel: "Professeur de Ballet et Danse Contemporaine",
    blog_authorBioDaniel: "Daniel Sené s'est formé à l'École Nationale de Ballet de Cuba, l'une des institutions classiques les plus prestigieuses au monde. Spécialisé en ballet classique, danse contemporaine et yoga pour danseurs, il apporte son expérience cubaine aux élèves du Farray's International Dance Center à Barcelone.",
    blog_credential_escuelaNacionalBallet: "École Nationale de Ballet de Cuba",
    blog_credential_balletContemporaneo: "Ballet Classique et Contemporain",
    blog_credential_yogaBailarines: "Yoga pour Danseurs",
    blog_authorRoleAlejandro: "Professeur de Modern Jazz et Contemporain",
    blog_authorBioAlejandro: "Danseur professionnel cubain formé à l'ENA et ancien soliste de la prestigieuse Compagnie Carlos Acosta. Spécialiste de la fusion des techniques classiques, jazz et contemporaines.",
    blog_credential_companiaCarlosAcosta: "Ancien soliste Compagnie Carlos Acosta",
    blog_credential_enaCuba: "Formation ENA Cuba",
    blog_credential_contemporaneoModernJazz: "Spécialiste en Contemporain et Modern Jazz",
    blogPerderMiedoBailar_refExposureTitle: "Thérapie d'Exposition pour les Troubles Anxieux – PMC",
    blogPerderMiedoBailar_refExposureDesc: "Revue systématique de l'efficacité de la thérapie d'exposition pour les troubles anxieux, applicable au trac en danse.",
    blogPerderMiedoBailar_refDancePsychTitle: "Psychologie de la Danse et Bien-être Émotionnel – PMC",
    blogAcademiaDanza_section1Metodo: "Au [Farray's International Dance Center](/fr/clases), tout cela s'articule à travers la [Méthode Farray](/fr/metodo-farray), le système pédagogique que j'ai développé à partir de ma formation à l'École Nationale d'Art de Cuba et de plus de 20 ans d'enseignement aux Européens. Il ne s'agit pas d'\"enseigner comme à Cuba\", mais de traduire cette tradition à la réalité de celui qui entre dans mon académie à 30, 40 ou 50 ans avec un corps qui a passé plus d'heures dans un bureau que sur une scène.",
    blogAcademiaDanza_section5Intro: "Quand je suis arrivée en Europe, au début j'ai essayé d'enseigner exactement comme je l'avais appris à Cuba. J'ai vite réalisé que quelque chose ne collait pas. Pas avec la danse, mais avec le contexte. À Cuba, un jeune qui entre à l'ENA à 14 ans a passé toute sa vie entouré de clave, rumba, comparsa... Le corps est déjà \"éveillé\". À Barcelone, beaucoup de personnes franchissent pour la première fois la porte d'une académie de danse à 30 ans, la tête pleine de tableurs et peu de contact avec leur propre corps. Prétendre qu'ils réagissent de la même façon est injuste.",
    blogAcademiaDanza_conclusionCTA: "Cherchez une académie de danse à Barcelone qui prend au sérieux votre corps, votre temps et votre processus. Où le professeur est aussi pédagogue, où il existe une méthode, où vous pouvez progresser en niveau et en style, et où, en franchissant la porte, vous sentez que vous n'avez rien à prouver pour être bienvenu. Si vous décidez que cet endroit soit le [Farray's International Dance Center](/fr/clases), je vous attendrai ici avec mon équipe et la [Méthode Farray](/fr/metodo-farray) prête à travailler avec vous. Et si vous choisissez une autre académie, je serai tout aussi heureuse de savoir que ce texte vous a aidé à prendre une décision plus consciente. L'important, vraiment, c'est de ne pas rester avec l'envie de danser.",
  }
};

for (const lang of ['ca', 'en', 'fr']) {
  const filePath = `i18n/locales/${lang}/blog.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const newData = {};

  for (const key of esKeys) {
    if (data[key] !== undefined) {
      newData[key] = data[key];
    } else if (translations[lang]?.[key] !== undefined) {
      newData[key] = translations[lang][key];
    }
  }

  for (const key of Object.keys(data)) {
    if (newData[key] === undefined) newData[key] = data[key];
  }

  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2) + '\n', 'utf8');
  const remaining = esKeys.filter(k => newData[k] === undefined);
  console.log(`${lang}: ${Object.keys(newData).length} keys (was ${Object.keys(data).length}), still missing: ${remaining.length}`);
  if (remaining.length > 0) console.log(`  Missing: ${remaining.join(', ')}`);
}
console.log(`ES: ${esKeys.length} keys`);
