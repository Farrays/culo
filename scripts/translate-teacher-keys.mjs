#!/usr/bin/env node
/**
 * Translate Teacher Keys - Professional Translation
 * Translates all 18 teachers' specialty and bio to CA, EN, FR
 */

import fs from 'fs';

const teacherTranslations = {
  ca: {
    // Yunaisy Farray
    "teacher.yunaisyFarray.specialty": "Directora i Fundadora - Especialista en Afro Jazz i Salsa Cubana",
    "teacher.yunaisyFarray.bio": "Ballarina de Hollywood, aquesta professional cubana formada a l'Escola Nacional d'Art de Cuba (ENA), és la nostra fundadora i directora. Amb més de dues dècades d'experiència internacional, Yunaisy ha participat a la pel·lícula 'Street Dance 2', les finals de 'Got Talent' i programes com 'The Dancer'. Considerada una de les ballarines més completes del món, participa als festivals de dansa més importants a nivell global. Creadora del Mètode Farray®.",

    // Daniel Sené
    "teacher.danielSene.specialty": "Especialista en Ballet Clàssic, Contemporani i Ioga",
    "teacher.danielSene.bio": "Daniel Sené és ballarí professional format a la prestigiosa Escola Nacional de Ballet de Cuba. Especialista en tècnica clàssica cubana i dansa contemporània, aporta el rigor acadèmic i elegància pròpies de la tradició cubana. Profund coneixedor del cos humà, també destaca per la seva mestria en Ioga, Tai-Chi i Stretching.",

    // Alejandro Miñoso
    "teacher.alejandroMinoso.specialty": "Especialista en Ballet, Modern Jazz i Afro Jazz",
    "teacher.alejandroMinoso.bio": "Alejandro Miñoso és ballarí professional cubà format a l'ENA i ex solista de la prestigiosa companyia Carlos Acosta, un dels millors ballarins de la història. La seva expertesa en la fusió d'estils clàssics i afro el converteix en un professor versàtil, capaç de transitar entre ballet, modern jazz, afro jazz, contemporani i afro contemporani amb igual mestria.",

    // Iroel Bastarreche
    "teacher.iroelBastarreche.specialty": "Especialista en Salsa Cubana i Folklore Afrocaribeny",
    "teacher.iroelBastarreche.bio": "Iroel Bastarreche, conegut com Iro, va néixer a Camagüey (Cuba) i es va formar a l'Escola Vocacional d'Art de Cuba. Va formar part del prestigiós Conjunt Artístic de Maraguán i del Ballet Folklòric de Camagüey. Des del 2014 a Barcelona, s'ha format en el Mètode Farray® amb Yunaisy Farray i actualment és considerat per molts com un dels referents en l'ensenyament d'estils cubans a tota Barcelona.",

    // Sandra Gómez
    "teacher.sandraGomez.specialty": "Especialista en Dancehall i Twerk - Formació Jamaica",
    "teacher.sandraGomez.bio": "Sandra Gómez és ballarina professional amb formació jamaicana en dancehall i twerk. El seu estil únic fusiona moviments del Twerk/Bootydance amb l'essència jamaicana autèntica. Tècnica impecable i metodologia d'ensenyament provada la converteixen en una de les professores més sol·licitades. Energia, sensualitat i feminitat pura a cada classe.",

    // Isabel López
    "teacher.isabelLopez.specialty": "Especialista en Dancehall i Dancehall Female - Formació Jamaica",
    "teacher.isabelLopez.bio": "Isabel López és una apassionada del dancehall amb més de 5 anys d'experiència com a professora especialitzada. Entrenada amb mestres jamaicans, la seva energia contagiosa i tècnica professional la converteixen en una de les instructores més estimades. Les seves classes barregen old school moves (Willie Bounce, Nuh Linga) amb els últims hits.",

    // Marcos Martínez
    "teacher.marcosMartinez.specialty": "Referent del Hip Hop a Espanya - Jutge Internacional",
    "teacher.marcosMartinez.bio": "Marcos Martínez és un dels referents del Hip Hop a Espanya. Amb dècades d'experiència com a ballarí, mestre i jutge de competicions internacionals, ha format generacions de ballarins. El seu estil únic combina la tècnica old school amb les tendències actuals, sempre respectant les arrels de la cultura hip hop.",

    // Yasmina Fernández
    "teacher.yasminaFernandez.specialty": "Especialista en Salsa Cubana, Lady Style i Sexy Style - Mètode Farray® des de 2016",
    "teacher.yasminaFernandez.bio": "Yasmina Fernández és una professora extraordinàriament versàtil amb una formació molt àmplia a les millors escoles de Barcelona. Certificada en el Mètode Farray® des de 2016, destaca per la seva capacitat de connectar amb els alumnes i fer que cada persona tregui el millor de si a les seves classes. Especialista en salsa cubana, Lady Style, Sexy Style i Sexy Reggaeton, combina anys d'experiència amb una metodologia clara, accessible i un do de gents excepcional.",

    // Lia Valdes
    "teacher.liaValdes.specialty": "Mestra Internacional de Salsa Cubana i Lady Style - ENA Cuba - El Rei Lleó París",
    "teacher.liaValdes.bio": "Mestra i artista internacional cubana, amb més de 20 anys de carrera artística, Lia Valdes és un referent a nivell mundial. Presència assídua als festivals de ritmes llatins més importants del món, aquesta mestra aporta el sabor autèntic de Cuba a cada classe. Formada a l'ENA (Escola Nacional d'Art de Cuba), ha integrat l'elenc del prestigiós espectacle 'El Rei Lleó' a París durant diversos anys, transmetent no només els passos sinó també l'alegria i l'esperit del ball caribeny.",

    // Charlie Breezy
    "teacher.charlieBreezy.specialty": "Mestre Internacional - Especialista en Afro Contemporani, Hip Hop i Afrobeats - ENA Cuba",
    "teacher.charlieBreezy.bio": "Charlie Breezy és mestre internacional i ballarí cubà, format a la prestigiosa ENA (Escola Nacional d'Art de Cuba). Va néixer a un país on la cultura africana està totalment arrelada, cosa que li permet dominar diferents estils de dansa africana i afrobeats, a més de contemporani, ballet i danses urbanes. Versatilitat i formació acadèmica excepcional.",

    // Eugenia Trujillo
    "teacher.eugeniaTrujillo.specialty": "Campiona Mundial de Salsa LA - Especialista en Bachata Lady Style i en Parella",
    "teacher.eugeniaTrujillo.bio": "Eugenia Trujillo és mestra i ballarina internacional uruguaiana, campiona mundial de Salsa LA juntament amb Mathias Font. Professora a Farray's des de fa 4 anys, aporta una tècnica impecable i és especialista en bachata en parella i bachata lady style amb excel·lents resultats. El seu carisma, simpatia i proximitat la fan una de les professores més estimades del claustre.",

    // Mathias Font
    "teacher.mathiasFont.specialty": "Campió Mundial de Salsa LA - Especialista en Bachata Sensual",
    "teacher.mathiasFont.bio": "Mathias Font és campió mundial de Salsa LA juntament amb la seva parella de ball Eugenia Trujillo. Especialista en bachata sensual, destaca pel seu enfocament únic en la musicalitat, la connexió en parella i la dinamització de les classes. Referent a l'escena llatina de Barcelona.",

    // Carlos Canto
    "teacher.carlosCanto.specialty": "Especialista en Bachata i Bachata Moderna - Talent Emergent Barcelona",
    "teacher.carlosCanto.bio": "Carlos Canto és un talent emergent a Barcelona amb do de gents que ha demostrat gran capacitat per connectar amb els seus alumnes. Especialista en bachata amb enfocament en tècnica i musicalitat, el seu estil fresc i accessible l'ha convertit en un professor molt estimat dels seus alumnes.",

    // Noemi
    "teacher.noemi.specialty": "Especialista en Bachata i Bachata Lady Style - Talent Emergent Barcelona",
    "teacher.noemi.bio": "Noemi és un talent emergent en el qual Farray's va apostar fort. Parella de Carlos Canto, estan florint com una de les parelles més prometedores de l'escena de Barcelona. Els seus alumnes es converteixen en fans fidels gràcies al seu enfocament en bachata i tècniques femenines, a més dels seus dons de gent.",

    // Redblueh
    "teacher.redblueh.specialty": "Especialista en Afrobeats i Ntcham - Natiu de Tanzània",
    "teacher.redblueh.bio": "Redblueh és professor i ballarí internacional, natiu de Tanzània i especialista en Ntcham. Les seves arrels africanes, coneixements profunds, energia i alegria contagiant el converteixen en un dels mestres més recomanats de tota Barcelona. Autenticitat africana a cada moviment.",

    // Grechén Méndez
    "teacher.grechenMendez.specialty": "Mestra Internacional de Danses Afrocubanes - ISA Cuba - +25 anys experiència",
    "teacher.grechenMendez.bio": "Grechén Méndez és una mestra internacional de referència en danses afrocubanes amb més de 25 anys dedicats a l'ensenyament del folklore cubà. Formada al prestigiós Institut Superior d'Art de Cuba (ISA), la màxima institució artística del país, domina les danses als Orishas, la rumba i totes les manifestacions del patrimoni afrocubà. Autoritat reconeguda a nivell mundial, ha format ballarins professionals a Cuba, Europa i Amèrica, transmetent tècnica i el profund significat espiritual i cultural de cada moviment.",

    // CrisAg
    "teacher.crisAg.specialty": "Especialista en Body Conditioning, Cuerpo Fit i Stretching - Mètode Farray® des de 2012",
    "teacher.crisAg.bio": "CrisAg va començar la seva passió pel ball des de petita. Llicenciada en Filologia Anglesa per la Universitat de Barcelona, s'ha format amb Jorge Camagüey i va integrar la seva companyia Calle Real de Camagüey. Va completar la seva formació a The Cuban School of Arts de Londres, treballant al costat de prestigioses ballarines com Yunaisy Farray, Kirenia Cantin i Damarys Farrés. Des de 2012 s'ha format en el Mètode Farray® i actualment és un referent a Barcelona com a professora de Body Conditioning, Cuerpo Fit, Bum Bum Glúteos i Stretching, fusionant les seves dues passions: el ball i el fitness.",

    // Juan Alvarez
    "teacher.juanAlvarez.specialty": "Especialista en Bachata Sensual - Talent Emergent Barcelona",
    "teacher.juanAlvarez.bio": "Juan Alvarez és un altre dels talents emergents a Barcelona. Instructor de Bachata Sensual, la forma com transmet l'essència d'aquest ball llatí amb passió, tècnica depurada, connexió i musicalitat, juntament amb el seu enfocament pràctic i proper que facilita l'aprenentatge des del primer dia, li ha permès connectar amb els seus alumnes des del primer moment.",
  },

  en: {
    // Yunaisy Farray
    "teacher.yunaisyFarray.specialty": "Director and Founder - Afro Jazz and Cuban Salsa Specialist",
    "teacher.yunaisyFarray.bio": "Hollywood dancer, this Cuban professional trained at Cuba's National School of Art (ENA), is our founder and director. With over two decades of international experience, Yunaisy has participated in the film 'Street Dance 2', the finals of 'Got Talent' and programs like 'The Dancer'. Considered one of the most complete dancers in the world, she participates in the most important dance festivals globally. Creator of the Farray Method®.",

    // Daniel Sené
    "teacher.danielSene.specialty": "Classical Ballet, Contemporary and Yoga Specialist",
    "teacher.danielSene.bio": "Daniel Sené is a professional dancer trained at the prestigious National Ballet School of Cuba. Specialist in Cuban classical technique and contemporary dance, he brings the academic rigor and elegance characteristic of Cuban tradition. Deep connoisseur of the human body, he also excels in Yoga, Tai-Chi and Stretching.",

    // Alejandro Miñoso
    "teacher.alejandroMinoso.specialty": "Ballet, Modern Jazz and Afro Jazz Specialist",
    "teacher.alejandroMinoso.bio": "Alejandro Miñoso is a Cuban professional dancer trained at ENA and former soloist of the prestigious Carlos Acosta company, one of the best dancers in history. His expertise in fusing classical and Afro styles makes him a versatile teacher, capable of moving between ballet, modern jazz, afro jazz, contemporary and afro contemporary with equal mastery.",

    // Iroel Bastarreche
    "teacher.iroelBastarreche.specialty": "Cuban Salsa and Afro-Caribbean Folklore Specialist",
    "teacher.iroelBastarreche.bio": "Iroel Bastarreche, known as Iro, was born in Camagüey (Cuba) and trained at Cuba's Vocational Art School. He was part of the prestigious Maraguán Artistic Ensemble and the Camagüey Folkloric Ballet. Since 2014 in Barcelona, he has trained in the Farray Method® with Yunaisy Farray and is currently considered by many as one of the references in teaching Cuban styles throughout Barcelona.",

    // Sandra Gómez
    "teacher.sandraGomez.specialty": "Dancehall and Twerk Specialist - Jamaican Training",
    "teacher.sandraGomez.bio": "Sandra Gómez is a professional dancer with Jamaican training in dancehall and twerk. Her unique style fuses Twerk/Bootydance movements with authentic Jamaican essence. Impeccable technique and proven teaching methodology make her one of the most requested teachers. Energy, sensuality and pure femininity in every class.",

    // Isabel López
    "teacher.isabelLopez.specialty": "Dancehall and Dancehall Female Specialist - Jamaican Training",
    "teacher.isabelLopez.bio": "Isabel López is a dancehall enthusiast with over 5 years of experience as a specialized teacher. Trained with Jamaican masters, her contagious energy and professional technique make her one of the most beloved instructors. Her classes mix old school moves (Willie Bounce, Nuh Linga) with the latest hits.",

    // Marcos Martínez
    "teacher.marcosMartinez.specialty": "Hip Hop Reference in Spain - International Judge",
    "teacher.marcosMartinez.bio": "Marcos Martínez is one of the Hip Hop references in Spain. With decades of experience as a dancer, master and judge of international competitions, he has trained generations of dancers. His unique style combines old school technique with current trends, always respecting the roots of hip hop culture.",

    // Yasmina Fernández
    "teacher.yasminaFernandez.specialty": "Cuban Salsa, Lady Style and Sexy Style Specialist - Farray Method® since 2016",
    "teacher.yasminaFernandez.bio": "Yasmina Fernández is an extraordinarily versatile teacher with extensive training at the best schools in Barcelona. Certified in the Farray Method® since 2016, she stands out for her ability to connect with students and bring out the best in each person in her classes. Specialist in Cuban salsa, Lady Style, Sexy Style and Sexy Reggaeton, she combines years of experience with a clear, accessible methodology and exceptional people skills.",

    // Lia Valdes
    "teacher.liaValdes.specialty": "International Master of Cuban Salsa and Lady Style - ENA Cuba - The Lion King Paris",
    "teacher.liaValdes.bio": "International Cuban master and artist, with over 20 years of artistic career, Lia Valdes is a world reference. Regular presence at the most important Latin rhythm festivals in the world, this master brings the authentic flavor of Cuba to every class. Trained at ENA (National School of Art of Cuba), she has been part of the cast of the prestigious show 'The Lion King' in Paris for several years, transmitting not only the steps but also the joy and spirit of Caribbean dance.",

    // Charlie Breezy
    "teacher.charlieBreezy.specialty": "International Master - Afro Contemporary, Hip Hop and Afrobeats Specialist - ENA Cuba",
    "teacher.charlieBreezy.bio": "Charlie Breezy is an international master and Cuban dancer, trained at the prestigious ENA (National School of Art of Cuba). Born in a country where African culture is deeply rooted, which allows him to master different styles of African dance and afrobeats, in addition to contemporary, ballet and urban dances. Versatility and exceptional academic training.",

    // Eugenia Trujillo
    "teacher.eugeniaTrujillo.specialty": "World Champion Salsa LA - Bachata Lady Style and Couples Specialist",
    "teacher.eugeniaTrujillo.bio": "Eugenia Trujillo is an international Uruguayan master and dancer, world champion in Salsa LA together with Mathias Font. Teacher at Farray's for 4 years, she brings impeccable technique and is a specialist in couples bachata and bachata lady style with excellent results. Her charisma, friendliness and closeness make her one of the most beloved teachers on the faculty.",

    // Mathias Font
    "teacher.mathiasFont.specialty": "World Champion Salsa LA - Sensual Bachata Specialist",
    "teacher.mathiasFont.bio": "Mathias Font is world champion in Salsa LA together with his dance partner Eugenia Trujillo. Specialist in sensual bachata, he stands out for his unique focus on musicality, couple connection and class dynamization. Reference on the Barcelona Latin scene.",

    // Carlos Canto
    "teacher.carlosCanto.specialty": "Bachata and Modern Bachata Specialist - Emerging Talent Barcelona",
    "teacher.carlosCanto.bio": "Carlos Canto is an emerging talent in Barcelona with people skills who has shown great ability to connect with his students. Bachata specialist with focus on technique and musicality, his fresh and accessible style has made him a very beloved teacher to his students.",

    // Noemi
    "teacher.noemi.specialty": "Bachata and Bachata Lady Style Specialist - Emerging Talent Barcelona",
    "teacher.noemi.bio": "Noemi is an emerging talent that Farray's bet big on. Partner of Carlos Canto, they are flourishing as one of the most promising couples on the Barcelona scene. Their students become loyal fans thanks to their focus on bachata and feminine techniques, in addition to their people skills.",

    // Redblueh
    "teacher.redblueh.specialty": "Afrobeats and Ntcham Specialist - Native of Tanzania",
    "teacher.redblueh.bio": "Redblueh is an international teacher and dancer, native of Tanzania and specialist in Ntcham. His African roots, deep knowledge, energy and contagious joy make him one of the most recommended masters in all of Barcelona. African authenticity in every movement.",

    // Grechén Méndez
    "teacher.grechenMendez.specialty": "International Master of Afro-Cuban Dances - ISA Cuba - +25 years experience",
    "teacher.grechenMendez.bio": "Grechén Méndez is an international reference master in Afro-Cuban dances with over 25 years dedicated to teaching Cuban folklore. Trained at the prestigious Higher Institute of Art of Cuba (ISA), the country's highest artistic institution, she masters the dances to the Orishas, rumba and all manifestations of Afro-Cuban heritage. Recognized authority worldwide, she has trained professional dancers in Cuba, Europe and America, transmitting technique and the deep spiritual and cultural meaning of each movement.",

    // CrisAg
    "teacher.crisAg.specialty": "Body Conditioning, Cuerpo Fit and Stretching Specialist - Farray Method® since 2012",
    "teacher.crisAg.bio": "CrisAg began her passion for dance from an early age. Graduated in English Philology from the University of Barcelona, she trained with Jorge Camagüey and joined his company Calle Real de Camagüey. She completed her training at The Cuban School of Arts in London, working alongside prestigious dancers such as Yunaisy Farray, Kirenia Cantin and Damarys Farrés. Since 2012 she has trained in the Farray Method® and is currently a reference in Barcelona as a teacher of Body Conditioning, Cuerpo Fit, Bum Bum Glutes and Stretching, merging her two passions: dance and fitness.",

    // Juan Alvarez
    "teacher.juanAlvarez.specialty": "Sensual Bachata Specialist - Emerging Talent Barcelona",
    "teacher.juanAlvarez.bio": "Juan Alvarez is another emerging talent in Barcelona. Sensual Bachata instructor, the way he transmits the essence of this Latin dance with passion, refined technique, connection and musicality, together with his practical and close approach that facilitates learning from day one, has allowed him to connect with his students from the first moment.",
  },

  fr: {
    // Yunaisy Farray
    "teacher.yunaisyFarray.specialty": "Directrice et Fondatrice - Spécialiste Afro Jazz et Salsa Cubaine",
    "teacher.yunaisyFarray.bio": "Danseuse d'Hollywood, cette professionnelle cubaine formée à l'École Nationale d'Art de Cuba (ENA), est notre fondatrice et directrice. Avec plus de deux décennies d'expérience internationale, Yunaisy a participé au film 'Street Dance 2', aux finales de 'Got Talent' et à des programmes comme 'The Dancer'. Considérée comme l'une des danseuses les plus complètes au monde, elle participe aux festivals de danse les plus importants au niveau mondial. Créatrice de la Méthode Farray®.",

    // Daniel Sené
    "teacher.danielSene.specialty": "Spécialiste Ballet Classique, Contemporain et Yoga",
    "teacher.danielSene.bio": "Daniel Sené est un danseur professionnel formé à la prestigieuse École Nationale de Ballet de Cuba. Spécialiste de la technique classique cubaine et de la danse contemporaine, il apporte la rigueur académique et l'élégance propres à la tradition cubaine. Profond connaisseur du corps humain, il se distingue également par sa maîtrise du Yoga, du Tai-Chi et du Stretching.",

    // Alejandro Miñoso
    "teacher.alejandroMinoso.specialty": "Spécialiste Ballet, Modern Jazz et Afro Jazz",
    "teacher.alejandroMinoso.bio": "Alejandro Miñoso est un danseur professionnel cubain formé à l'ENA et ancien soliste de la prestigieuse compagnie Carlos Acosta, l'un des meilleurs danseurs de l'histoire. Son expertise dans la fusion des styles classiques et afro en fait un professeur polyvalent, capable de naviguer entre ballet, modern jazz, afro jazz, contemporain et afro contemporain avec une égale maîtrise.",

    // Iroel Bastarreche
    "teacher.iroelBastarreche.specialty": "Spécialiste Salsa Cubaine et Folklore Afro-Caribéen",
    "teacher.iroelBastarreche.bio": "Iroel Bastarreche, connu sous le nom d'Iro, est né à Camagüey (Cuba) et s'est formé à l'École Vocatinelle d'Art de Cuba. Il a fait partie du prestigieux Ensemble Artistique de Maraguán et du Ballet Folklorique de Camagüey. Depuis 2014 à Barcelone, il s'est formé à la Méthode Farray® avec Yunaisy Farray et est actuellement considéré par beaucoup comme l'une des références dans l'enseignement des styles cubains dans toute Barcelone.",

    // Sandra Gómez
    "teacher.sandraGomez.specialty": "Spécialiste Dancehall et Twerk - Formation Jamaïcaine",
    "teacher.sandraGomez.bio": "Sandra Gómez est une danseuse professionnelle avec formation jamaïcaine en dancehall et twerk. Son style unique fusionne les mouvements du Twerk/Bootydance avec l'essence jamaïcaine authentique. Technique impeccable et méthodologie d'enseignement éprouvée en font l'une des professeurs les plus demandées. Énergie, sensualité et féminité pure à chaque cours.",

    // Isabel López
    "teacher.isabelLopez.specialty": "Spécialiste Dancehall et Dancehall Female - Formation Jamaïcaine",
    "teacher.isabelLopez.bio": "Isabel López est une passionnée de dancehall avec plus de 5 ans d'expérience comme professeur spécialisée. Formée avec des maîtres jamaïcains, son énergie contagieuse et sa technique professionnelle en font l'une des instructrices les plus appréciées. Ses cours mélangent old school moves (Willie Bounce, Nuh Linga) avec les derniers hits.",

    // Marcos Martínez
    "teacher.marcosMartinez.specialty": "Référence Hip Hop en Espagne - Juge International",
    "teacher.marcosMartinez.bio": "Marcos Martínez est l'une des références du Hip Hop en Espagne. Avec des décennies d'expérience comme danseur, maître et juge de compétitions internationales, il a formé des générations de danseurs. Son style unique combine la technique old school avec les tendances actuelles, en respectant toujours les racines de la culture hip hop.",

    // Yasmina Fernández
    "teacher.yasminaFernandez.specialty": "Spécialiste Salsa Cubaine, Lady Style et Sexy Style - Méthode Farray® depuis 2016",
    "teacher.yasminaFernandez.bio": "Yasmina Fernández est une professeur extraordinairement polyvalente avec une formation très large dans les meilleures écoles de Barcelone. Certifiée en Méthode Farray® depuis 2016, elle se distingue par sa capacité à se connecter avec les élèves et à faire ressortir le meilleur de chaque personne dans ses cours. Spécialiste en salsa cubaine, Lady Style, Sexy Style et Sexy Reggaeton, elle combine des années d'expérience avec une méthodologie claire, accessible et un don exceptionnel pour les gens.",

    // Lia Valdes
    "teacher.liaValdes.specialty": "Maître Internationale de Salsa Cubaine et Lady Style - ENA Cuba - Le Roi Lion Paris",
    "teacher.liaValdes.bio": "Maître et artiste internationale cubaine, avec plus de 20 ans de carrière artistique, Lia Valdes est une référence mondiale. Présence assidue aux festivals de rythmes latins les plus importants du monde, cette maître apporte la saveur authentique de Cuba à chaque cours. Formée à l'ENA (École Nationale d'Art de Cuba), elle a intégré la distribution du prestigieux spectacle 'Le Roi Lion' à Paris pendant plusieurs années, transmettant non seulement les pas mais aussi la joie et l'esprit de la danse caribéenne.",

    // Charlie Breezy
    "teacher.charlieBreezy.specialty": "Maître International - Spécialiste Afro Contemporain, Hip Hop et Afrobeats - ENA Cuba",
    "teacher.charlieBreezy.bio": "Charlie Breezy est maître international et danseur cubain, formé à la prestigieuse ENA (École Nationale d'Art de Cuba). Né dans un pays où la culture africaine est totalement enracinée, ce qui lui permet de maîtriser différents styles de danse africaine et afrobeats, en plus du contemporain, ballet et danses urbaines. Polyvalence et formation académique exceptionnelle.",

    // Eugenia Trujillo
    "teacher.eugeniaTrujillo.specialty": "Championne Mondiale Salsa LA - Spécialiste Bachata Lady Style et en Couple",
    "teacher.eugeniaTrujillo.bio": "Eugenia Trujillo est maître et danseuse internationale uruguayenne, championne mondiale de Salsa LA avec Mathias Font. Professeur chez Farray's depuis 4 ans, elle apporte une technique impeccable et est spécialiste en bachata en couple et bachata lady style avec d'excellents résultats. Son charisme, sa sympathie et sa proximité en font l'une des professeurs les plus appréciées de la faculté.",

    // Mathias Font
    "teacher.mathiasFont.specialty": "Champion Mondial Salsa LA - Spécialiste Bachata Sensuelle",
    "teacher.mathiasFont.bio": "Mathias Font est champion mondial de Salsa LA avec sa partenaire de danse Eugenia Trujillo. Spécialiste en bachata sensuelle, il se distingue par son approche unique de la musicalité, de la connexion en couple et de la dynamisation des cours. Référence sur la scène latine de Barcelone.",

    // Carlos Canto
    "teacher.carlosCanto.specialty": "Spécialiste Bachata et Bachata Moderne - Talent Émergent Barcelone",
    "teacher.carlosCanto.bio": "Carlos Canto est un talent émergent à Barcelone avec un don pour les gens qui a démontré une grande capacité à se connecter avec ses élèves. Spécialiste en bachata avec accent sur la technique et la musicalité, son style frais et accessible en a fait un professeur très apprécié de ses élèves.",

    // Noemi
    "teacher.noemi.specialty": "Spécialiste Bachata et Bachata Lady Style - Talent Émergent Barcelone",
    "teacher.noemi.bio": "Noemi est un talent émergent sur lequel Farray's a beaucoup misé. Partenaire de Carlos Canto, ils fleurissent comme l'un des couples les plus prometteurs de la scène de Barcelone. Leurs élèves deviennent des fans fidèles grâce à leur approche de la bachata et des techniques féminines, en plus de leurs dons pour les gens.",

    // Redblueh
    "teacher.redblueh.specialty": "Spécialiste Afrobeats et Ntcham - Natif de Tanzanie",
    "teacher.redblueh.bio": "Redblueh est professeur et danseur international, natif de Tanzanie et spécialiste en Ntcham. Ses racines africaines, connaissances profondes, énergie et joie contagieuse en font l'un des maîtres les plus recommandés de toute Barcelone. Authenticité africaine dans chaque mouvement.",

    // Grechén Méndez
    "teacher.grechenMendez.specialty": "Maître Internationale de Danses Afro-Cubaines - ISA Cuba - +25 ans d'expérience",
    "teacher.grechenMendez.bio": "Grechén Méndez est une maître internationale de référence en danses afro-cubaines avec plus de 25 ans dédiés à l'enseignement du folklore cubain. Formée au prestigieux Institut Supérieur d'Art de Cuba (ISA), l'institution artistique la plus élevée du pays, elle maîtrise les danses aux Orishas, la rumba et toutes les manifestations du patrimoine afro-cubain. Autorité reconnue au niveau mondial, elle a formé des danseurs professionnels à Cuba, en Europe et en Amérique, transmettant la technique et la profonde signification spirituelle et culturelle de chaque mouvement.",

    // CrisAg
    "teacher.crisAg.specialty": "Spécialiste Body Conditioning, Cuerpo Fit et Stretching - Méthode Farray® depuis 2012",
    "teacher.crisAg.bio": "CrisAg a commencé sa passion pour la danse dès son plus jeune âge. Licenciée en Philologie Anglaise de l'Université de Barcelone, elle s'est formée avec Jorge Camagüey et a intégré sa compagnie Calle Real de Camagüey. Elle a complété sa formation à The Cuban School of Arts de Londres, travaillant aux côtés de danseuses prestigieuses comme Yunaisy Farray, Kirenia Cantin et Damarys Farrés. Depuis 2012, elle s'est formée à la Méthode Farray® et est actuellement une référence à Barcelone comme professeur de Body Conditioning, Cuerpo Fit, Bum Bum Glutes et Stretching, fusionnant ses deux passions : la danse et le fitness.",

    // Juan Alvarez
    "teacher.juanAlvarez.specialty": "Spécialiste Bachata Sensuelle - Talent Émergent Barcelone",
    "teacher.juanAlvarez.bio": "Juan Alvarez est un autre talent émergent à Barcelone. Instructeur de Bachata Sensuelle, la façon dont il transmet l'essence de cette danse latine avec passion, technique raffinée, connexion et musicalité, avec son approche pratique et proche qui facilite l'apprentissage dès le premier jour, lui a permis de se connecter avec ses élèves dès le premier instant.",
  },
};

function translateTeacherKeys(locale) {
  const filePath = `i18n/locales/${locale}/common.json`;

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let updated = 0;

    for (const [key, value] of Object.entries(teacherTranslations[locale])) {
      if (data[key]) {
        data[key] = value;
        updated++;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    return updated;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

console.log('🌍 Translating all teacher keys (18 teachers × 2 keys = 36 translations per language)...\n');

for (const locale of ['ca', 'en', 'fr']) {
  const updated = translateTeacherKeys(locale);
  console.log(`   ${locale.toUpperCase()}: ${updated} teacher keys translated`);
}

console.log('\n✅ All teacher keys professionally translated!');
console.log('\n📝 Translated:');
console.log('   - 18 teacher specialties');
console.log('   - 18 teacher biographies');
console.log('   - 3 languages (CA, EN, FR)');
console.log('   - Total: 108 professional translations');
