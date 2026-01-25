import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const translations = {
  es: `
  // =============================================
  // TEACHER SCHEMA TRANSLATIONS (SEO)
  // =============================================
  'teacherSchema.yunaisyFarray.jobTitle':
    "Directora y Fundadora de Farray's International Dance Center | Bailarina de Hollywood",
  'teacherSchema.yunaisyFarray.description':
    'Bailarina de Hollywood y profesional cubana formada en la ENA, creadora del Metodo Farray que integra la rigurosidad de la escuela rusa de ballet clasico con las raices afrocubanas, adaptada para bailarines europeos. Actriz en Street Dance 2, finalista de Got Talent y miembro del CID UNESCO. Mas de 25 anos de experiencia internacional.',

  'teacherSchema.danielSene.jobTitle':
    'Profesor de Ballet Clasico, Contemporaneo, Yoga, Tai-Chi y Stretching | Escuela Nacional de Ballet de Cuba | Referente Nacional',
  'teacherSchema.danielSene.description':
    'Bailarin profesional formado en la prestigiosa Escuela Nacional de Ballet de Cuba. Especialista en tecnica clasica cubana y danza contemporanea. Profundo conocedor del cuerpo humano, tambien se destaca por su maestria en Yoga, Tai-Chi y Stretching. Referente nacional que combina precision tecnica con bienestar corporal.',

  'teacherSchema.alejandroMinoso.jobTitle':
    'Profesor de Ballet, Modern Jazz, Afro Jazz y Contemporaneo | Ex Solista Compania Carlos Acosta',
  'teacherSchema.alejandroMinoso.description':
    'Bailarin profesional cubano formado en la ENA y ex solista de la prestigiosa compania Carlos Acosta, uno de los mejores bailarines de la historia. Versatil en fusion de estilos clasicos, afro y contemporaneo.',

  'teacherSchema.sandraGomez.jobTitle': 'Instructora de Dancehall y Twerk | Formacion Jamaicana',
  'teacherSchema.sandraGomez.description':
    'Bailarina profesional con formacion jamaicana autentica en dancehall y twerk. Su estilo fusiona Twerk/Bootydance con la esencia jamaicana genuina. Tecnica impecable y metodologia probada.',

  'teacherSchema.isabelLopez.jobTitle': 'Instructora de Dancehall Female',
  'teacherSchema.isabelLopez.description':
    'Apasionada del dancehall con mas de 5 anos de experiencia. Entrenada con maestros jamaicanos. Especialista en old school moves (Willie Bounce, Nuh Linga) y ultimas tendencias.',

  'teacherSchema.marcosMartinez.jobTitle': 'Instructor de Hip Hop y Juez Internacional',
  'teacherSchema.marcosMartinez.description':
    'Uno de los referentes del Hip Hop en Espana. Decadas de experiencia como bailarin, maestro y juez de competiciones internacionales. Combina tecnica old school con tendencias actuales.',

  'teacherSchema.yasminaFernandez.jobTitle':
    'Profesora de Salsa Cubana, Lady Style, Sexy Style y Sexy Reggaeton | Metodo Farray desde 2016',
  'teacherSchema.yasminaFernandez.description':
    'Profesora extraordinariamente versatil certificada en el Metodo Farray desde 2016. Destaca por un don de gentes excepcional que le permite conectar con los alumnos. Especialista en salsa cubana, Lady Style, Sexy Style y Sexy Reggaeton.',

  'teacherSchema.liaValdes.jobTitle':
    'Maestra y Artista Internacional Cubana | ENA Cuba | El Rey Leon Paris',
  'teacherSchema.liaValdes.description':
    'Maestra y artista internacional cubana con mas de 20 anos de carrera artistica. Formada en la ENA (Escuela Nacional de Arte de Cuba), ha bailado en la prestigiosa produccion El Rey Leon en Paris. Transmite la alegria y el espiritu del baile caribeno.',

  'teacherSchema.iroelBastarreche.jobTitle':
    'Profesor de Salsa Cubana | Ballet Folklorico de Camaguey | Metodo Farray',
  'teacherSchema.iroelBastarreche.description':
    'Conocido como Iro, formado en la Escuela Vocacional de Arte de Cuba. Integrante del Conjunto Artistico de Maragan y Ballet Folklorico de Camaguey. Desde 2014 se forma en el Metodo Farray, convirtiendose en referente de la salsa cubana en Barcelona.',

  'teacherSchema.charlieBreezy.jobTitle':
    'Profesor de Afro Contemporaneo, Hip Hop y Afrobeats',
  'teacherSchema.charlieBreezy.description':
    'Maestro internacional y bailarin cubano formado en la ENA. Domina danza africana como el Afrobeats, contemporaneo, ballet y danzas urbanas. Versatilidad y formacion academica excepcional.',

  'teacherSchema.eugeniaTrujillo.jobTitle':
    'Campeona Mundial Salsa LA y Profesora de Bachata',
  'teacherSchema.eugeniaTrujillo.description':
    'Maestra y bailarina internacional uruguaya, campeona mundial de Salsa LA junto a Mathias Font. Tecnica impecable, especialista en bachata en pareja y bachata lady style con 4 anos en Farrays.',

  'teacherSchema.mathiasFont.jobTitle':
    'Campeon Mundial Salsa LA e Instructor de Bachata',
  'teacherSchema.mathiasFont.description':
    'Campeon mundial de Salsa LA junto a Eugenia Trujillo. Especialista en bachata sensual con enfoque unico en musicalidad, conexion en pareja y dinamizacion de clases. Referente en Barcelona.',

  'teacherSchema.carlosCanto.jobTitle':
    'Instructor de Bachata | Talento Emergente Barcelona',
  'teacherSchema.carlosCanto.description':
    'Talento emergente muy querido de sus alumnos con gran capacidad para conectar. Especialista en bachata con enfoque en tecnica y musicalidad. Uno de los profesores mas valorados de la escuela.',

  'teacherSchema.noemi.jobTitle':
    'Instructora de Bachata Lady Style | Talento Emergente Barcelona',
  'teacherSchema.noemi.description':
    'Talento emergente con excelentes dones de gente que le permiten conectar inmediatamente con sus alumnos. Pareja de Carlos Canto, una de las parejas mas prometedoras de Barcelona. Especialista en bachata y tecnicas femeninas.',

  'teacherSchema.redblueh.jobTitle': 'Instructor de Afrobeats y Ntcham',
  'teacherSchema.redblueh.description':
    'Profesor y bailarin internacional nativo de Tanzania, especialista en Ntcham. Sus raices africanas y alegria contagiante lo convierten en uno de los mas recomendados de Barcelona.',

  'teacherSchema.juanAlvarez.jobTitle':
    'Profesor de Bachata Sensual | Metodo Farray | Talento Emergente Barcelona',
  'teacherSchema.juanAlvarez.description':
    'Instructor de Bachata Sensual certificado en el Metodo Farray. Posee una capacidad extraordinaria para conectar desde el primer momento con sus alumnos. Transmite la esencia del baile latino con pasion y tecnica depurada.',

  'teacherSchema.crisAg.jobTitle':
    'Instructora de Body Conditioning, Cuerpo Fit, Bum Bum Gluteos y Stretching | Metodo Farray desde 2012',
  'teacherSchema.crisAg.description':
    'Licenciada en Filologia Inglesa por la UB. Formada con Jorge Camaguey y en The Cuban School of Arts de Londres. Desde 2012 se forma en el Metodo Farray y trabaja como profesora, convirtiendose en referente del acondicionamiento corporal para bailarines en Barcelona.',

  'teacherSchema.grechenMendez.jobTitle':
    'Maestra Internacional de Danzas Afrocubanas | ISA Cuba | +25 anos experiencia',
  'teacherSchema.grechenMendez.description':
    'Maestra internacional de referencia en danzas afrocubanas con mas de 25 anos dedicados a la ensenanza del folklore cubano. Formada en el ISA (Instituto Superior de Arte de Cuba). Autoridad mundial en danzas a los Orishas y rumba.',
`,
  en: `
  // =============================================
  // TEACHER SCHEMA TRANSLATIONS (SEO)
  // =============================================
  'teacherSchema.yunaisyFarray.jobTitle':
    "Director and Founder of Farray's International Dance Center | Hollywood Dancer",
  'teacherSchema.yunaisyFarray.description':
    'Hollywood dancer and Cuban professional trained at the ENA, creator of the Farray Method that integrates the rigor of the Russian classical ballet school with Afro-Cuban roots, adapted for European dancers. Actress in Street Dance 2, Got Talent finalist and CID UNESCO member. Over 25 years of international experience.',

  'teacherSchema.danielSene.jobTitle':
    'Classical Ballet, Contemporary, Yoga, Tai-Chi and Stretching Teacher | National Ballet School of Cuba | National Reference',
  'teacherSchema.danielSene.description':
    'Professional dancer trained at the prestigious National Ballet School of Cuba. Specialist in Cuban classical technique and contemporary dance. Deep connoisseur of the human body, he also stands out for his mastery in Yoga, Tai-Chi and Stretching. National reference combining technical precision with body wellness.',

  'teacherSchema.alejandroMinoso.jobTitle':
    'Ballet, Modern Jazz, Afro Jazz and Contemporary Teacher | Former Carlos Acosta Company Soloist',
  'teacherSchema.alejandroMinoso.description':
    'Cuban professional dancer trained at the ENA and former soloist of the prestigious Carlos Acosta company, one of the best dancers in history. Versatile in fusion of classical, afro and contemporary styles.',

  'teacherSchema.sandraGomez.jobTitle': 'Dancehall and Twerk Instructor | Jamaican Training',
  'teacherSchema.sandraGomez.description':
    'Professional dancer with authentic Jamaican training in dancehall and twerk. Her style fuses Twerk/Bootydance with genuine Jamaican essence. Impeccable technique and proven methodology.',

  'teacherSchema.isabelLopez.jobTitle': 'Dancehall Female Instructor',
  'teacherSchema.isabelLopez.description':
    'Dancehall enthusiast with over 5 years of experience. Trained with Jamaican masters. Specialist in old school moves (Willie Bounce, Nuh Linga) and latest trends.',

  'teacherSchema.marcosMartinez.jobTitle': 'Hip Hop Instructor and International Judge',
  'teacherSchema.marcosMartinez.description':
    'One of the Hip Hop references in Spain. Decades of experience as dancer, teacher and judge of international competitions. Combines old school technique with current trends.',

  'teacherSchema.yasminaFernandez.jobTitle':
    'Cuban Salsa, Lady Style, Sexy Style and Sexy Reggaeton Teacher | Farray Method since 2016',
  'teacherSchema.yasminaFernandez.description':
    'Extraordinarily versatile teacher certified in the Farray Method since 2016. Stands out for exceptional people skills that allow her to connect with students. Specialist in Cuban salsa, Lady Style, Sexy Style and Sexy Reggaeton.',

  'teacherSchema.liaValdes.jobTitle':
    'Cuban International Master and Artist | ENA Cuba | The Lion King Paris',
  'teacherSchema.liaValdes.description':
    'Cuban international master and artist with over 20 years of artistic career. Trained at the ENA (National School of Art of Cuba), she has danced in the prestigious production The Lion King in Paris. Transmits the joy and spirit of Caribbean dance.',

  'teacherSchema.iroelBastarreche.jobTitle':
    'Cuban Salsa Teacher | Folkloric Ballet of Camaguey | Farray Method',
  'teacherSchema.iroelBastarreche.description':
    'Known as Iro, trained at the Vocational School of Art of Cuba. Member of the Maragan Artistic Ensemble and Folkloric Ballet of Camaguey. Since 2014 training in the Farray Method, becoming a Cuban salsa reference in Barcelona.',

  'teacherSchema.charlieBreezy.jobTitle':
    'Afro Contemporary, Hip Hop and Afrobeats Teacher',
  'teacherSchema.charlieBreezy.description':
    'International master and Cuban dancer trained at the ENA. Masters African dance like Afrobeats, contemporary, ballet and urban dances. Exceptional versatility and academic training.',

  'teacherSchema.eugeniaTrujillo.jobTitle':
    'World Champion Salsa LA and Bachata Teacher',
  'teacherSchema.eugeniaTrujillo.description':
    'Uruguayan international master and dancer, world champion of Salsa LA with Mathias Font. Impeccable technique, specialist in partner bachata and bachata lady style with 4 years at Farrays.',

  'teacherSchema.mathiasFont.jobTitle':
    'World Champion Salsa LA and Bachata Instructor',
  'teacherSchema.mathiasFont.description':
    'World champion of Salsa LA with Eugenia Trujillo. Specialist in sensual bachata with unique focus on musicality, partner connection and class dynamization. Reference in Barcelona.',

  'teacherSchema.carlosCanto.jobTitle':
    'Bachata Instructor | Emerging Talent Barcelona',
  'teacherSchema.carlosCanto.description':
    'Emerging talent beloved by his students with great ability to connect. Bachata specialist with focus on technique and musicality. One of the most valued teachers at the school.',

  'teacherSchema.noemi.jobTitle':
    'Bachata Lady Style Instructor | Emerging Talent Barcelona',
  'teacherSchema.noemi.description':
    'Emerging talent with excellent people skills that allow her to connect immediately with students. Partner of Carlos Canto, one of the most promising couples in Barcelona. Specialist in bachata and feminine techniques.',

  'teacherSchema.redblueh.jobTitle': 'Afrobeats and Ntcham Instructor',
  'teacherSchema.redblueh.description':
    'International teacher and dancer native to Tanzania, specialist in Ntcham. His African roots and contagious joy make him one of the most recommended in Barcelona.',

  'teacherSchema.juanAlvarez.jobTitle':
    'Sensual Bachata Teacher | Farray Method | Emerging Talent Barcelona',
  'teacherSchema.juanAlvarez.description':
    'Sensual Bachata instructor certified in the Farray Method. Possesses an extraordinary ability to connect from the first moment with students. Transmits the essence of Latin dance with passion and refined technique.',

  'teacherSchema.crisAg.jobTitle':
    'Body Conditioning, Body Fit, Bum Bum Glutes and Stretching Instructor | Farray Method since 2012',
  'teacherSchema.crisAg.description':
    'English Philology graduate from UB. Trained with Jorge Camaguey and at The Cuban School of Arts in London. Since 2012 training in the Farray Method and working as teacher, becoming a reference in body conditioning for dancers in Barcelona.',

  'teacherSchema.grechenMendez.jobTitle':
    'International Master of Afro-Cuban Dances | ISA Cuba | +25 years experience',
  'teacherSchema.grechenMendez.description':
    'International reference master in Afro-Cuban dances with over 25 years dedicated to teaching Cuban folklore. Trained at the ISA (Higher Institute of Art of Cuba). World authority on dances to the Orishas and rumba.',
`,
  ca: `
  // =============================================
  // TEACHER SCHEMA TRANSLATIONS (SEO)
  // =============================================
  'teacherSchema.yunaisyFarray.jobTitle':
    "Directora i Fundadora de Farray's International Dance Center | Ballarina de Hollywood",
  'teacherSchema.yunaisyFarray.description':
    "Ballarina de Hollywood i professional cubana formada a l'ENA, creadora del Metode Farray que integra la rigorositat de l'escola russa de ballet classic amb les arrels afrocubanes, adaptada per a ballarins europeus. Actriu a Street Dance 2, finalista de Got Talent i membre del CID UNESCO. Mes de 25 anys d'experiencia internacional.",

  'teacherSchema.danielSene.jobTitle':
    "Professor de Ballet Classic, Contemporani, Ioga, Tai-Chi i Stretching | Escola Nacional de Ballet de Cuba | Referent Nacional",
  'teacherSchema.danielSene.description':
    "Ballari professional format a la prestigiosa Escola Nacional de Ballet de Cuba. Especialista en tecnica classica cubana i dansa contemporania. Profund coneixedor del cos huma, tambe es destaca per la seva mestria en Ioga, Tai-Chi i Stretching. Referent nacional que combina precisio tecnica amb benestar corporal.",

  'teacherSchema.alejandroMinoso.jobTitle':
    "Professor de Ballet, Modern Jazz, Afro Jazz i Contemporani | Ex Solista Companyia Carlos Acosta",
  'teacherSchema.alejandroMinoso.description':
    "Ballari professional cuba format a l'ENA i ex solista de la prestigiosa companyia Carlos Acosta, un dels millors ballarins de la historia. Versatil en fusio d'estils classics, afro i contemporani.",

  'teacherSchema.sandraGomez.jobTitle': "Instructora de Dancehall i Twerk | Formacio Jamaicana",
  'teacherSchema.sandraGomez.description':
    "Ballarina professional amb formacio jamaicana autentica en dancehall i twerk. El seu estil fusiona Twerk/Bootydance amb l'essencia jamaicana genuina. Tecnica impecable i metodologia provada.",

  'teacherSchema.isabelLopez.jobTitle': "Instructora de Dancehall Female",
  'teacherSchema.isabelLopez.description':
    "Apassionada del dancehall amb mes de 5 anys d'experiencia. Entrenada amb mestres jamaicans. Especialista en old school moves (Willie Bounce, Nuh Linga) i ultimes tendencies.",

  'teacherSchema.marcosMartinez.jobTitle': "Instructor de Hip Hop i Jutge Internacional",
  'teacherSchema.marcosMartinez.description':
    "Un dels referents del Hip Hop a Espanya. Decades d'experiencia com a ballari, mestre i jutge de competicions internacionals. Combina tecnica old school amb tendencies actuals.",

  'teacherSchema.yasminaFernandez.jobTitle':
    "Professora de Salsa Cubana, Lady Style, Sexy Style i Sexy Reggaeton | Metode Farray des de 2016",
  'teacherSchema.yasminaFernandez.description':
    "Professora extraordinariament versatil certificada en el Metode Farray des de 2016. Destaca per un do de gents excepcional que li permet connectar amb els alumnes. Especialista en salsa cubana, Lady Style, Sexy Style i Sexy Reggaeton.",

  'teacherSchema.liaValdes.jobTitle':
    "Mestra i Artista Internacional Cubana | ENA Cuba | El Rei Lleo Paris",
  'teacherSchema.liaValdes.description':
    "Mestra i artista internacional cubana amb mes de 20 anys de carrera artistica. Formada a l'ENA (Escola Nacional d'Art de Cuba), ha ballat a la prestigiosa produccio El Rei Lleo a Paris. Transmet l'alegria i l'esperit del ball caribeny.",

  'teacherSchema.iroelBastarreche.jobTitle':
    "Professor de Salsa Cubana | Ballet Folkloric de Camaguey | Metode Farray",
  'teacherSchema.iroelBastarreche.description':
    "Conegut com a Iro, format a l'Escola Vocacional d'Art de Cuba. Integrant del Conjunt Artistic de Maragan i Ballet Folkloric de Camaguey. Des de 2014 es forma en el Metode Farray, convertint-se en referent de la salsa cubana a Barcelona.",

  'teacherSchema.charlieBreezy.jobTitle':
    "Professor d'Afro Contemporani, Hip Hop i Afrobeats",
  'teacherSchema.charlieBreezy.description':
    "Mestre internacional i ballari cuba format a l'ENA. Domina dansa africana com l'Afrobeats, contemporani, ballet i danses urbanes. Versatilitat i formacio academica excepcional.",

  'teacherSchema.eugeniaTrujillo.jobTitle':
    "Campiona Mundial Salsa LA i Professora de Bachata",
  'teacherSchema.eugeniaTrujillo.description':
    "Mestra i ballarina internacional uruguaiana, campiona mundial de Salsa LA juntament amb Mathias Font. Tecnica impecable, especialista en bachata en parella i bachata lady style amb 4 anys a Farrays.",

  'teacherSchema.mathiasFont.jobTitle':
    "Campio Mundial Salsa LA i Instructor de Bachata",
  'teacherSchema.mathiasFont.description':
    "Campio mundial de Salsa LA juntament amb Eugenia Trujillo. Especialista en bachata sensual amb enfocament unic en musicalitat, connexio en parella i dinamitzacio de classes. Referent a Barcelona.",

  'teacherSchema.carlosCanto.jobTitle':
    "Instructor de Bachata | Talent Emergent Barcelona",
  'teacherSchema.carlosCanto.description':
    "Talent emergent molt estimat pels seus alumnes amb gran capacitat per connectar. Especialista en bachata amb enfocament en tecnica i musicalitat. Un dels professors mes valorats de l'escola.",

  'teacherSchema.noemi.jobTitle':
    "Instructora de Bachata Lady Style | Talent Emergent Barcelona",
  'teacherSchema.noemi.description':
    "Talent emergent amb excellents dons de gent que li permeten connectar immediatament amb els seus alumnes. Parella de Carlos Canto, una de les parelles mes prometedores de Barcelona. Especialista en bachata i tecniques femenines.",

  'teacherSchema.redblueh.jobTitle': "Instructor d'Afrobeats i Ntcham",
  'teacherSchema.redblueh.description':
    "Professor i ballari internacional natiu de Tanzania, especialista en Ntcham. Les seves arrels africanes i alegria contagiosa el converteixen en un dels mes recomanats de Barcelona.",

  'teacherSchema.juanAlvarez.jobTitle':
    "Professor de Bachata Sensual | Metode Farray | Talent Emergent Barcelona",
  'teacherSchema.juanAlvarez.description':
    "Instructor de Bachata Sensual certificat en el Metode Farray. Posseeix una capacitat extraordinaria per connectar des del primer moment amb els seus alumnes. Transmet l'essencia del ball llati amb passio i tecnica depurada.",

  'teacherSchema.crisAg.jobTitle':
    "Instructora de Body Conditioning, Cos Fit, Bum Bum Glutis i Stretching | Metode Farray des de 2012",
  'teacherSchema.crisAg.description':
    "Llicenciada en Filologia Anglesa per la UB. Formada amb Jorge Camaguey i a The Cuban School of Arts de Londres. Des de 2012 es forma en el Metode Farray i treballa com a professora, convertint-se en referent de l'acondicionament corporal per a ballarins a Barcelona.",

  'teacherSchema.grechenMendez.jobTitle':
    "Mestra Internacional de Danses Afrocubanes | ISA Cuba | +25 anys experiencia",
  'teacherSchema.grechenMendez.description':
    "Mestra internacional de referencia en danses afrocubanes amb mes de 25 anys dedicats a l'ensenyament del folklore cuba. Formada a l'ISA (Institut Superior d'Art de Cuba). Autoritat mundial en danses als Orixes i rumba.",
`,
  fr: `
  // =============================================
  // TEACHER SCHEMA TRANSLATIONS (SEO)
  // =============================================
  'teacherSchema.yunaisyFarray.jobTitle':
    "Directrice et Fondatrice du Farray's International Dance Center | Danseuse de Hollywood",
  'teacherSchema.yunaisyFarray.description':
    "Danseuse de Hollywood et professionnelle cubaine formee a l'ENA, creatrice de la Methode Farray qui integre la rigueur de l'ecole russe de ballet classique avec les racines afro-cubaines, adaptee pour les danseurs europeens. Actrice dans Street Dance 2, finaliste de Got Talent et membre du CID UNESCO. Plus de 25 ans d'experience internationale.",

  'teacherSchema.danielSene.jobTitle':
    "Professeur de Ballet Classique, Contemporain, Yoga, Tai-Chi et Stretching | Ecole Nationale de Ballet de Cuba | Reference Nationale",
  'teacherSchema.danielSene.description':
    "Danseur professionnel forme a la prestigieuse Ecole Nationale de Ballet de Cuba. Specialiste de la technique classique cubaine et de la danse contemporaine. Grand connaisseur du corps humain, il se distingue egalement par sa maitrise du Yoga, Tai-Chi et Stretching. Reference nationale combinant precision technique et bien-etre corporel.",

  'teacherSchema.alejandroMinoso.jobTitle':
    "Professeur de Ballet, Modern Jazz, Afro Jazz et Contemporain | Ex Soliste Compagnie Carlos Acosta",
  'teacherSchema.alejandroMinoso.description':
    "Danseur professionnel cubain forme a l'ENA et ex soliste de la prestigieuse compagnie Carlos Acosta, l'un des meilleurs danseurs de l'histoire. Polyvalent dans la fusion de styles classiques, afro et contemporain.",

  'teacherSchema.sandraGomez.jobTitle': "Instructrice de Dancehall et Twerk | Formation Jamaicaine",
  'teacherSchema.sandraGomez.description':
    "Danseuse professionnelle avec formation jamaicaine authentique en dancehall et twerk. Son style fusionne Twerk/Bootydance avec l'essence jamaicaine veritable. Technique impeccable et methodologie eprouvee.",

  'teacherSchema.isabelLopez.jobTitle': "Instructrice de Dancehall Female",
  'teacherSchema.isabelLopez.description':
    "Passionnee de dancehall avec plus de 5 ans d'experience. Formee avec des maitres jamaicains. Specialiste des old school moves (Willie Bounce, Nuh Linga) et dernieres tendances.",

  'teacherSchema.marcosMartinez.jobTitle': "Instructeur de Hip Hop et Juge International",
  'teacherSchema.marcosMartinez.description':
    "L'une des references du Hip Hop en Espagne. Des decennies d'experience comme danseur, maitre et juge de competitions internationales. Combine technique old school et tendances actuelles.",

  'teacherSchema.yasminaFernandez.jobTitle':
    "Professeure de Salsa Cubaine, Lady Style, Sexy Style et Sexy Reggaeton | Methode Farray depuis 2016",
  'teacherSchema.yasminaFernandez.description':
    "Professeure extraordinairement polyvalente certifiee dans la Methode Farray depuis 2016. Se distingue par un don exceptionnel pour les relations humaines qui lui permet de connecter avec les eleves. Specialiste de la salsa cubaine, Lady Style, Sexy Style et Sexy Reggaeton.",

  'teacherSchema.liaValdes.jobTitle':
    "Maitre et Artiste Internationale Cubaine | ENA Cuba | Le Roi Lion Paris",
  'teacherSchema.liaValdes.description':
    "Maitre et artiste internationale cubaine avec plus de 20 ans de carriere artistique. Formee a l'ENA (Ecole Nationale d'Art de Cuba), elle a danse dans la prestigieuse production Le Roi Lion a Paris. Transmet la joie et l'esprit de la danse caribeenne.",

  'teacherSchema.iroelBastarreche.jobTitle':
    "Professeur de Salsa Cubaine | Ballet Folklorique de Camaguey | Methode Farray",
  'teacherSchema.iroelBastarreche.description':
    "Connu sous le nom d'Iro, forme a l'Ecole Vocationnelle d'Art de Cuba. Membre de l'Ensemble Artistique de Maragan et Ballet Folklorique de Camaguey. Depuis 2014 se forme dans la Methode Farray, devenant une reference de la salsa cubaine a Barcelone.",

  'teacherSchema.charlieBreezy.jobTitle':
    "Professeur d'Afro Contemporain, Hip Hop et Afrobeats",
  'teacherSchema.charlieBreezy.description':
    "Maitre international et danseur cubain forme a l'ENA. Maitrise la danse africaine comme l'Afrobeats, contemporain, ballet et danses urbaines. Polyvalence et formation academique exceptionnelle.",

  'teacherSchema.eugeniaTrujillo.jobTitle':
    "Championne du Monde Salsa LA et Professeure de Bachata",
  'teacherSchema.eugeniaTrujillo.description':
    "Maitre et danseuse internationale uruguayenne, championne du monde de Salsa LA avec Mathias Font. Technique impeccable, specialiste de la bachata en couple et bachata lady style avec 4 ans chez Farrays.",

  'teacherSchema.mathiasFont.jobTitle':
    "Champion du Monde Salsa LA et Instructeur de Bachata",
  'teacherSchema.mathiasFont.description':
    "Champion du monde de Salsa LA avec Eugenia Trujillo. Specialiste de la bachata sensuelle avec approche unique de la musicalite, connexion en couple et dynamisation des cours. Reference a Barcelone.",

  'teacherSchema.carlosCanto.jobTitle':
    "Instructeur de Bachata | Talent Emergent Barcelone",
  'teacherSchema.carlosCanto.description':
    "Talent emergent tres apprecie de ses eleves avec grande capacite a connecter. Specialiste de la bachata avec focus sur technique et musicalite. L'un des professeurs les plus values de l'ecole.",

  'teacherSchema.noemi.jobTitle':
    "Instructrice de Bachata Lady Style | Talent Emergent Barcelone",
  'teacherSchema.noemi.description':
    "Talent emergent avec d'excellentes competences relationnelles qui lui permettent de connecter immediatement avec ses eleves. Partenaire de Carlos Canto, l'un des couples les plus prometteurs de Barcelone. Specialiste de la bachata et techniques feminines.",

  'teacherSchema.redblueh.jobTitle': "Instructeur d'Afrobeats et Ntcham",
  'teacherSchema.redblueh.description':
    "Professeur et danseur international natif de Tanzanie, specialiste du Ntcham. Ses racines africaines et sa joie contagieuse en font l'un des plus recommandes de Barcelone.",

  'teacherSchema.juanAlvarez.jobTitle':
    "Professeur de Bachata Sensuelle | Methode Farray | Talent Emergent Barcelone",
  'teacherSchema.juanAlvarez.description':
    "Instructeur de Bachata Sensuelle certifie dans la Methode Farray. Possede une capacite extraordinaire a connecter des le premier moment avec ses eleves. Transmet l'essence de la danse latine avec passion et technique raffinee.",

  'teacherSchema.crisAg.jobTitle':
    "Instructrice de Body Conditioning, Corps Fit, Bum Bum Fessiers et Stretching | Methode Farray depuis 2012",
  'teacherSchema.crisAg.description':
    "Diplomee en Philologie Anglaise de l'UB. Formee avec Jorge Camaguey et a The Cuban School of Arts de Londres. Depuis 2012 se forme dans la Methode Farray et travaille comme professeure, devenant une reference du conditionnement corporel pour danseurs a Barcelone.",

  'teacherSchema.grechenMendez.jobTitle':
    "Maitre Internationale de Danses Afro-cubaines | ISA Cuba | +25 ans experience",
  'teacherSchema.grechenMendez.description':
    "Maitre internationale de reference en danses afro-cubaines avec plus de 25 ans consacres a l'enseignement du folklore cubain. Formee a l'ISA (Institut Superieur d'Art de Cuba). Autorite mondiale sur les danses aux Orishas et la rumba.",
`
};

const files = {
  es: path.join(__dirname, '../i18n/locales/es.ts'),
  en: path.join(__dirname, '../i18n/locales/en.ts'),
  ca: path.join(__dirname, '../i18n/locales/ca.ts'),
  fr: path.join(__dirname, '../i18n/locales/fr.ts'),
};

for (const [lang, filePath] of Object.entries(files)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if translations already exist
  if (content.includes('teacherSchema.yunaisyFarray.jobTitle')) {
    console.log(`${lang.toUpperCase()}: Teacher schema translations already exist, skipping.`);
    continue;
  }

  // Find the last closing brace and insert before it
  const lastBraceIndex = content.lastIndexOf('};');
  if (lastBraceIndex !== -1) {
    content = content.slice(0, lastBraceIndex) + translations[lang] + content.slice(lastBraceIndex);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${lang.toUpperCase()}: Teacher schema translations added!`);
  } else {
    console.log(`${lang.toUpperCase()}: Could not find insertion point!`);
  }
}

console.log('\\nDone! All teacher schema translations added.');
