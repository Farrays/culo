import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const caPath = path.join(__dirname, '../i18n/locales/ca.ts');

let content = fs.readFileSync(caPath, 'utf8');

const replacements = [
  // Page meta
  ["horariosV2_page_title: 'Horarios Clases de Baile Barcelona | Farray Center'", "horariosV2_page_title: 'Horaris Classes de Ball Barcelona | Farray Center'"],
  ["'Encuentra el horario perfecto para tus clases de baile en Barcelona. Mañanas, tardes y noches. +25 estilos de danza, salsa, bachata, urbano y más. Grupos por nivel.'", "'Troba l\\'horari perfecte per a les teves classes de ball a Barcelona. Matins, tardes i nits. +25 estils de dansa, salsa, bachata, urbà i més. Grups per nivell.'"],

  // Skip links
  ["horariosV2_skipToContent: 'Saltar al contenido principal'", "horariosV2_skipToContent: 'Saltar al contingut principal'"],
  ["horariosV2_skipToFilters: 'Ir a filtros de horario'", "horariosV2_skipToFilters: 'Anar als filtres d\\'horari'"],

  // Hero
  ["horariosV2_hero_title: 'Horarios de Clases de Baile en Barcelona'", "horariosV2_hero_title: 'Horaris de Classes de Ball a Barcelona'"],
  ["'Encuentra el horario y el estilo que encajan contigo y descubre cómo empezar en Farray Center de forma clara y sin compromiso.'", "'Troba l\\'horari i l\\'estil que encaixin amb tu i descobreix com començar a Farray Center de manera clara i sense compromís.'"],
  ["horariosV2_hero_cta: 'Recibir Horarios Completos'", "horariosV2_hero_cta: 'Rebre Horaris Complets'"],
  ["horariosV2_hero_years: 'años en Barcelona'", "horariosV2_hero_years: 'anys a Barcelona'"],

  // Preview section
  ["horariosV2_preview_title: 'Esto es solo una muestra'", "horariosV2_preview_title: 'Això és només una mostra'"],
  ["horariosV2_preview_subtitle: 'Tenemos muchos más horarios y estilos que mostrarte'", "horariosV2_preview_subtitle: 'Tenim molts més horaris i estils per mostrar-te'"],
  ["horariosV2_preview_point1: '+100 clases semanales de baile'", "horariosV2_preview_point1: '+100 classes setmanals de ball'"],
  ["horariosV2_preview_point2: 'Horarios de mañana, tarde y noche'", "horariosV2_preview_point2: 'Horaris de matí, tarda i nit'"],
  ["horariosV2_preview_point3: 'Todos los niveles y edades'", "horariosV2_preview_point3: 'Tots els nivells i edats'"],
  ["horariosV2_preview_point4: 'Información de profesores y salas'", "horariosV2_preview_point4: 'Informació de professors i sales'"],
  ["horariosV2_preview_cta: 'Recibir Horarios Completos por Email'", "horariosV2_preview_cta: 'Rebre Horaris Complets per Email'"],

  // More schedules
  ["horariosV2_moreSchedules_title: 'Hay muchos más horarios disponibles'", "horariosV2_moreSchedules_title: 'Hi ha molts més horaris disponibles'"],
  ["'Los horarios que ves aquí son solo una selección. Para ver todos los horarios disponibles, incluyendo clases de noche y fines de semana, solicita la información completa.'", "'Els horaris que veus aquí són només una selecció. Per veure tots els horaris disponibles, incloent classes de nit i caps de setmana, sol·licita la informació completa.'"],
  ["horariosV2_moreSchedules_cta: 'Ver Todos los Horarios'", "horariosV2_moreSchedules_cta: 'Veure Tots els Horaris'"],
  ["horariosV2_sample_preview_label: 'Muestra de horarios - Para ver todos, solicita info'", "horariosV2_sample_preview_label: 'Mostra d\\'horaris - Per veure tots, sol·licita info'"],

  // Trust badges
  ["horariosV2_trust_noCommitment: 'Sin permanencia'", "horariosV2_trust_noCommitment: 'Sense permanència'"],
  ["horariosV2_trust_byLevel: 'Grupos por nivel'", "horariosV2_trust_byLevel: 'Grups per nivell'"],

  // Authority badges
  ["horariosV2_authority_since2017: 'Desde 2017'", "horariosV2_authority_since2017: 'Des de 2017'"],
  ["horariosV2_authority_members: '+15.000 socios'", "horariosV2_authority_members: '+15.000 socis'"],
  ["horariosV2_authority_styles: '+25 estilos'", "horariosV2_authority_styles: '+25 estils'"],
  ["horariosV2_authority_teachers: 'Profesores certificados'", "horariosV2_authority_teachers: 'Professors certificats'"],

  // Orientation section
  ["horariosV2_orientation_title: 'Antes de elegir un horario, ten en cuenta esto'", "horariosV2_orientation_title: 'Abans de triar un horari, tingues en compte això'"],
  ["'No te preocupes si es tu primera vez. Estamos aquí para ayudarte.'", "'No et preocupis si és la teva primera vegada. Som aquí per ajudar-te.'"],
  ["horariosV2_orientation_noExperience: 'No necesitas experiencia previa en muchas actividades'", "horariosV2_orientation_noExperience: 'No necessites experiència prèvia en moltes activitats'"],
  ["horariosV2_orientation_byLevel: 'Los grupos se organizan por nivel'", "horariosV2_orientation_byLevel: 'Els grups s\\'organitzen per nivell'"],
  ["horariosV2_orientation_startAnytime: 'Puedes empezar en cualquier momento del año'", "horariosV2_orientation_startAnytime: 'Pots començar en qualsevol moment de l\\'any'"],
  ["horariosV2_orientation_weHelp: 'Te ayudamos a elegir el grupo adecuado'", "horariosV2_orientation_weHelp: 'T\\'ajudem a triar el grup adequat'"],

  // Filter section
  ["horariosV2_filter_title: 'Encuentra lo que encaja contigo'", "horariosV2_filter_title: 'Troba el que encaixa amb tu'"],
  ["horariosV2_filter_subtitle: 'Selecciona el momento del día o el estilo que prefieres'", "horariosV2_filter_subtitle: 'Selecciona el moment del dia o l\\'estil que prefereixis'"],
  ["horariosV2_filter_step1: 'Por horario'", "horariosV2_filter_step1: 'Per horari'"],
  ["horariosV2_filter_step2: 'Por estilo'", "horariosV2_filter_step2: 'Per estil'"],
  ["horariosV2_filter_morning: 'Mañanas'", "horariosV2_filter_morning: 'Matins'"],
  ["horariosV2_filter_afternoon: 'Tardes'", "horariosV2_filter_afternoon: 'Tardes'"],
  ["horariosV2_filter_evening: 'Noches'", "horariosV2_filter_evening: 'Nits'"],
  ["horariosV2_filter_danza: 'Danza'", "horariosV2_filter_danza: 'Dansa'"],
  ["horariosV2_filter_urbano: 'Urbano'", "horariosV2_filter_urbano: 'Urbà'"],

  // Matrix
  ["horariosV2_matrix_title: 'Vista rápida de disponibilidad'", "horariosV2_matrix_title: 'Vista ràpida de disponibilitat'"],
  ["horariosV2_matrix_unavailable: 'Sin clases'", "horariosV2_matrix_unavailable: 'Sense classes'"],

  // Days
  ["horariosV2_day_monday: 'Lunes'", "horariosV2_day_monday: 'Dilluns'"],
  ["horariosV2_day_tuesday: 'Martes'", "horariosV2_day_tuesday: 'Dimarts'"],
  ["horariosV2_day_wednesday: 'Miércoles'", "horariosV2_day_wednesday: 'Dimecres'"],
  ["horariosV2_day_thursday: 'Jueves'", "horariosV2_day_thursday: 'Dijous'"],
  ["horariosV2_day_friday: 'Viernes'", "horariosV2_day_friday: 'Divendres'"],
  ["horariosV2_day_saturday: 'Sábado'", "horariosV2_day_saturday: 'Dissabte'"],
  ["horariosV2_day_sunday: 'Domingo'", "horariosV2_day_sunday: 'Diumenge'"],

  // Schedule blocks
  ["horariosV2_block_morning_title: 'Clases de baile por la mañana en Barcelona'", "horariosV2_block_morning_title: 'Classes de ball al matí a Barcelona'"],
  ["horariosV2_block_morning_subtitle: 'Afro · Jazz · Contemporáneo · Preparación física'", "horariosV2_block_morning_subtitle: 'Afro · Jazz · Contemporani · Preparació física'"],
  ["horariosV2_block_evening_title: 'Clases de baile por la tarde y noche en Barcelona'", "horariosV2_block_evening_title: 'Classes de ball a la tarda i nit a Barcelona'"],
  ["horariosV2_block_evening_subtitle: 'Afro · Jazz · Ballet · Contemporáneo'", "horariosV2_block_evening_subtitle: 'Afro · Jazz · Ballet · Contemporani'"],
  ["horariosV2_block_salsa_title: 'Horarios de salsa y bachata en Barcelona'", "horariosV2_block_salsa_title: 'Horaris de salsa i bachata a Barcelona'"],
  ["horariosV2_block_salsa_subtitle: 'Social · Progresivo · Todos los niveles'", "horariosV2_block_salsa_subtitle: 'Social · Progressiu · Tots els nivells'"],
  ["horariosV2_block_urbano_title: 'Clases de baile urbano en Barcelona'", "horariosV2_block_urbano_title: 'Classes de ball urbà a Barcelona'"],
  ["horariosV2_block_showMore: 'Ver más clases'", "horariosV2_block_showMore: 'Veure més classes'"],
  ["'Horarios orientativos. Asignación definitiva según nivel y disponibilidad.'", "'Horaris orientatius. Assignació definitiva segons nivell i disponibilitat.'"],

  // CTAs per block
  ["horariosV2_cta_morning: 'Ver plazas disponibles para mañanas'", "horariosV2_cta_morning: 'Veure places disponibles per a matins'"],
  ["horariosV2_cta_evening: 'Ver grupos por nivel'", "horariosV2_cta_evening: 'Veure grups per nivell'"],
  ["horariosV2_cta_salsa: 'Encontrar mi grupo de salsa ideal'", "horariosV2_cta_salsa: 'Trobar el meu grup de salsa ideal'"],
  ["horariosV2_cta_urbano: 'Descubrir actividades urbanas'", "horariosV2_cta_urbano: 'Descobrir activitats urbanes'"],

  // Testimonials
  ["'Las clases de mañana me cambiaron la rutina. Ahora empiezo el día con energía.'", "'Les classes de matí em van canviar la rutina. Ara començo el dia amb energia.'"],
  ["horariosV2_testimonial_morning_author: 'María, 34 años'", "horariosV2_testimonial_morning_author: 'Maria, 34 anys'"],
  ["horariosV2_testimonial_evening: 'Después del trabajo, bailar es mi mejor forma de desconectar.'", "horariosV2_testimonial_evening: 'Després de la feina, ballar és la meva millor manera de desconnectar.'"],
  ["horariosV2_testimonial_evening_author: 'Carlos, 28 años'", "horariosV2_testimonial_evening_author: 'Carles, 28 anys'"],
  ["horariosV2_testimonial_salsa: 'Empecé sin saber nada y ahora no me pierdo una clase de bachata.'", "horariosV2_testimonial_salsa: 'Vaig començar sense saber res i ara no em perdo cap classe de bachata.'"],
  ["horariosV2_testimonial_salsa_author: 'Laura, 31 años'", "horariosV2_testimonial_salsa_author: 'Laura, 31 anys'"],
  ["'El ambiente es increíble. Te sientes parte de una familia desde el primer día.'", "'L\\'ambient és increïble. Et sents part d\\'una família des del primer dia.'"],
  ["horariosV2_testimonial_urbano_author: 'Pablo, 25 años'", "horariosV2_testimonial_urbano_author: 'Pau, 25 anys'"],

  // Badges
  ["horariosV2_badge_popular: 'Más demandado'", "horariosV2_badge_popular: 'Més demanat'"],
  ["horariosV2_badge_limited: 'Plazas limitadas'", "horariosV2_badge_limited: 'Places limitades'"],
  ["horariosV2_badge_new: 'Nuevo'", "horariosV2_badge_new: 'Nou'"],

  // Card actions
  ["horariosV2_card_teacher: 'Profesor/a'", "horariosV2_card_teacher: 'Professor/a'"],

  // Levels
  ["horariosV2_levels_title: '¿Qué significan los niveles?'", "horariosV2_levels_title: 'Què signifiquen els nivells?'"],
  ["'Te ayudamos a encontrar el grupo perfecto para tu experiencia actual.'", "'T\\'ajudem a trobar el grup perfecte per a la teva experiència actual.'"],
  ["'Empiezas desde cero. No tienes experiencia previa en este estilo. Te guiaremos paso a paso.'", "'Comences des de zero. No tens experiència prèvia en aquest estil. Et guiarem pas a pas.'"],
  ["horariosV2_level_basico: 'Básico'", "horariosV2_level_basico: 'Bàsic'"],
  ["'Conoces los fundamentos. Has practicado algo antes pero aún estás aprendiendo las bases.'", "'Coneixes els fonaments. Has practicat una mica abans però encara estàs aprenent les bases.'"],
  ["horariosV2_level_intermedio: 'Intermedio'", "horariosV2_level_intermedio: 'Intermedi'"],
  ["'Dominas la técnica básica. Puedes seguir coreografías y quieres perfeccionar tu estilo.'", "'Domines la tècnica bàsica. Pots seguir coreografies i vols perfeccionar el teu estil.'"],
  ["horariosV2_level_avanzado: 'Avanzado'", "horariosV2_level_avanzado: 'Avançat'"],
  ["'Alto dominio técnico. Buscas retos, coreografías complejas y preparación para escenario.'", "'Alt domini tècnic. Busques reptes, coreografies complexes i preparació per a escenari.'"],
  ["'Todos los niveles mezclados. Cada uno trabaja a su ritmo con adaptaciones del profesor.'", "'Tots els nivells barrejats. Cadascú treballa al seu ritme amb adaptacions del professor.'"],
  ["horariosV2_level_intermedioAvanzado: 'Intermedio-Avanzado'", "horariosV2_level_intermedioAvanzado: 'Intermedi-Avançat'"],
  ["'¿No sabes cuál es tu nivel? No te preocupes, te orientamos personalmente antes de empezar.'", "'No saps quin és el teu nivell? No et preocupis, t\\'orientem personalment abans de començar.'"],

  // Season
  ["horariosV2_season_winter: 'Horario de invierno'", "horariosV2_season_winter: 'Horari d\\'hivern'"],
  ["horariosV2_season_winter_desc: 'Estos son los horarios actuales (septiembre - junio).'", "horariosV2_season_winter_desc: 'Aquests són els horaris actuals (setembre - juny).'"],
  ["horariosV2_season_summer: 'Horario de verano'", "horariosV2_season_summer: 'Horari d\\'estiu'"],
  ["'Los horarios pueden variar en julio y agosto. Consulta disponibilidad.'", "'Els horaris poden variar al juliol i agost. Consulta disponibilitat.'"],

  // How to start
  ["horariosV2_howToStart_title: 'Cómo empezar en Farray Center'", "horariosV2_howToStart_title: 'Com començar a Farray Center'"],
  ["horariosV2_howToStart_subtitle: 'Cuatro pasos sencillos para comenzar tu aventura en el baile'", "horariosV2_howToStart_subtitle: 'Quatre passos senzills per començar la teva aventura en el ball'"],
  ["horariosV2_howToStart_step1: 'Recibe la información completa'", "horariosV2_howToStart_step1: 'Rep la informació completa'"],
  ["horariosV2_howToStart_step2: 'Valora horarios y niveles'", "horariosV2_howToStart_step2: 'Valora horaris i nivells'"],
  ["horariosV2_howToStart_step3: 'Ven a conocernos (opcional)'", "horariosV2_howToStart_step3: 'Vine a conèixer-nos (opcional)'"],
  ["horariosV2_howToStart_step4: 'Empieza cuando te sientas listo/a'", "horariosV2_howToStart_step4: 'Comença quan et sentis preparat/da'"],
  ["horariosV2_howToStart_cta: 'Descubre Cómo Empezar'", "horariosV2_howToStart_cta: 'Descobreix Com Començar'"],
  ["horariosV2_howToStart_microcopy: 'Sin compromiso · Información clara · A tu ritmo'", "horariosV2_howToStart_microcopy: 'Sense compromís · Informació clara · Al teu ritme'"],

  // FAQ
  ["horariosV2_faq_title: 'Preguntas frecuentes sobre los horarios de nuestras clases de baile'", "horariosV2_faq_title: 'Preguntes freqüents sobre els horaris de les nostres classes de ball'"],
  ["horariosV2_faq_subtitle: 'Las respuestas a las dudas más comunes sobre nuestras clases'", "horariosV2_faq_subtitle: 'Les respostes als dubtes més habituals sobre les nostres classes'"],
  ["horariosV2_faq1_q: '¿Puedo empezar clases de baile aunque no tenga experiencia?'", "horariosV2_faq1_q: 'Puc començar classes de ball encara que no tingui experiència?'"],
  ["'Sí. Muchas de nuestras clases están pensadas para personas que empiezan desde cero. Además, te ayudamos a elegir el grupo adecuado según tu experiencia y objetivos.'", "'Sí. Moltes de les nostres classes estan pensades per a persones que comencen des de zero. A més, t\\'ajudem a triar el grup adequat segons la teva experiència i objectius.'"],
  ["horariosV2_faq2_q: '¿Tengo que elegir un horario fijo desde el primer día?'", "horariosV2_faq2_q: 'He de triar un horari fix des del primer dia?'"],
  ["'Como club deportivo, trabajamos con horarios organizados por nivel. Una vez te orientamos, podrás elegir el horario que mejor encaje contigo dentro de las opciones disponibles.'", "'Com a club esportiu, treballem amb horaris organitzats per nivell. Un cop t\\'orientem, podràs triar l\\'horari que millor encaixi amb tu dins de les opcions disponibles.'"],
  ["horariosV2_faq3_q: '¿Puedo cambiar de horario o de estilo más adelante?'", "horariosV2_faq3_q: 'Puc canviar d\\'horari o d\\'estil més endavant?'"],
  ["'Sí. Nuestros socios pueden adaptar su participación según disponibilidad y evolución, siempre que haya plazas disponibles en el grupo.'", "'Sí. Els nostres socis poden adaptar la seva participació segons disponibilitat i evolució, sempre que hi hagi places disponibles al grup.'"],
  ["horariosV2_faq4_q: '¿Hay clases por la mañana y por la tarde?'", "horariosV2_faq4_q: 'Hi ha classes al matí i a la tarda?'"],
  ["'Sí. Ofrecemos clases de baile tanto por la mañana como por la tarde y noche, según el estilo y la temporada.'", "'Sí. Oferim classes de ball tant al matí com a la tarda i nit, segons l\\'estil i la temporada.'"],
  ["horariosV2_faq5_q: '¿Los horarios son siempre los mismos todo el año?'", "horariosV2_faq5_q: 'Els horaris són sempre els mateixos tot l\\'any?'"],
  ["'Los horarios son orientativos y pueden variar según la temporada, el nivel y la disponibilidad de plazas. Siempre te enviamos la información actualizada antes de empezar.'", "'Els horaris són orientatius i poden variar segons la temporada, el nivell i la disponibilitat de places. Sempre t\\'enviem la informació actualitzada abans de començar.'"],
  ["horariosV2_faq6_q: '¿Puedo probar una clase antes de inscribirme?'", "horariosV2_faq6_q: 'Puc provar una classe abans d\\'inscriure\\'m?'"],
  ["'Mira, lo importante es que pruebes. Según la temporada, la clase de bienvenida tiene un precio especial. La idea es que puedas probar la experiencia sin compromiso.'", "'Mira, l\\'important és que provis. Segons la temporada, la classe de benvinguda té un preu especial. La idea és que puguis provar l\\'experiència sense compromís.'"],
  ["horariosV2_faq7_q: '¿Dónde está Farray Center y a quién van dirigidas las actividades de baile?'", "horariosV2_faq7_q: 'On és Farray Center i a qui van dirigides les activitats de ball?'"],
  ["'Estamos en Calle Entença nº 100 en Barcelona y nuestras clases están dirigidas a adultos de todos los niveles que quieren aprender, mejorar o disfrutar del baile en un entorno profesional y cercano.'", "'Som al Carrer Entença núm. 100 a Barcelona i les nostres classes van dirigides a adults de tots els nivells que volen aprendre, millorar o gaudir del ball en un entorn professional i proper.'"],

  // Emotional close
  ["'No se trata solo de encajar una clase en tu agenda. Se trata de encontrar un lugar donde disfrutar, progresar y sentirte parte de una comunidad.'", "'No es tracta només d\\'encaixar una classe a la teva agenda. Es tracta de trobar un lloc on gaudir, progressar i sentir-te part d\\'una comunitat.'"],
  ["horariosV2_whatsapp_cta: '¿Tienes más dudas? Escríbenos por WhatsApp'", "horariosV2_whatsapp_cta: 'Tens més dubtes? Escriu-nos per WhatsApp'"],

  // Footer
  ["'Los horarios y plazas mostrados son orientativos y pueden variar según temporada, nivel y disponibilidad. La asignación definitiva de grupo se realiza de forma personalizada tras solicitar información.'", "'Els horaris i places mostrats són orientatius i poden variar segons temporada, nivell i disponibilitat. L\\'assignació definitiva de grup es realitza de forma personalitzada després de sol·licitar informació.'"],

  // Navigation
  ["horariosV2_nav_ariaLabel: 'Navegación rápida de secciones de horarios'", "horariosV2_nav_ariaLabel: 'Navegació ràpida de seccions d\\'horaris'"],
  ["horariosV2_nav_progressLabel: 'Progreso de lectura'", "horariosV2_nav_progressLabel: 'Progrés de lectura'"],
  ["horariosV2_nav_morning: 'Mañanas'", "horariosV2_nav_morning: 'Matins'"],
  ["horariosV2_nav_evening: 'Tardes'", "horariosV2_nav_evening: 'Tardes'"],
  ["horariosV2_nav_urbano: 'Urbano'", "horariosV2_nav_urbano: 'Urbà'"],
  ["horariosV2_nav_levels: 'Niveles'", "horariosV2_nav_levels: 'Nivells'"],

  // Styles
  ["horariosV2_style_contemporaneo: 'Contemporáneo'", "horariosV2_style_contemporaneo: 'Contemporani'"],
  ["horariosV2_style_contemporaneoLirico: 'Contemporáneo Lírico & Flow'", "horariosV2_style_contemporaneoLirico: 'Contemporani Líric & Flow'"],
  ["horariosV2_style_afroContemporaneo: 'Afro Contemporáneo'", "horariosV2_style_afroContemporaneo: 'Afro Contemporani'"],
  ["horariosV2_style_ballet: 'Ballet Clásico'", "horariosV2_style_ballet: 'Ballet Clàssic'"],
  ["horariosV2_style_hipHop: 'Hip Hop Urbano'", "horariosV2_style_hipHop: 'Hip Hop Urbà'"],

  // Additional keys
  ["horariosV2_hero_subtitle2: 'Encuentra el horario perfecto para ti'", "horariosV2_hero_subtitle2: 'Troba l\\'horari perfecte per a tu'"],
  ["horariosV2_weekly_classes: 'clases semanales'", "horariosV2_weekly_classes: 'classes setmanals'"],
  ["horariosV2_trust_noExperience: 'No necesitas experiencia'", "horariosV2_trust_noExperience: 'No necessites experiència'"],
  ["'Los horarios que ves aquí son solo una muestra. Tenemos más de 100 clases semanales de baile en diferentes estilos y niveles.'", "'Els horaris que veus aquí són només una mostra. Tenim més de 100 classes setmanals de ball en diferents estils i nivells.'"],
  ["horariosV2_preview_includes: 'La información completa incluye:'", "horariosV2_preview_includes: 'La informació completa inclou:'"],
  ["horariosV2_howItWorks_title: 'Cómo funcionan nuestros horarios'", "horariosV2_howItWorks_title: 'Com funcionen els nostres horaris'"],
  ["'Organizamos las clases por bloques horarios y niveles para que encuentres fácilmente el que mejor encaja contigo.'", "'Organitzem les classes per blocs horaris i nivells perquè trobis fàcilment el que millor encaixa amb tu.'"],
  ["horariosV2_reassurance1: 'Clases de mañana, tarde y noche'", "horariosV2_reassurance1: 'Classes de matí, tarda i nit'"],
  ["horariosV2_reassurance2: 'Todos los niveles'", "horariosV2_reassurance2: 'Tots els nivells'"],
  ["horariosV2_reassurance4: 'Ambiente acogedor'", "horariosV2_reassurance4: 'Ambient acollidor'"],
  ["horariosV2_blocks_title: 'Bloques de Horarios'", "horariosV2_blocks_title: 'Blocs d\\'Horaris'"],
  ["'Cada bloque agrupa clases en franjas horarias similares. Elige el que mejor se adapte a tu día a día.'", "'Cada bloc agrupa classes en franges horàries similars. Tria el que millor s\\'adapti al teu dia a dia.'"],
  ["horariosV2_classes_available: 'clases disponibles'", "horariosV2_classes_available: 'classes disponibles'"],
  ["horariosV2_see_schedule: 'Ver horarios completos'", "horariosV2_see_schedule: 'Veure horaris complets'"],
  ["horariosV2_blocks_cta: 'Recibir Todos los Horarios'", "horariosV2_blocks_cta: 'Rebre Tots els Horaris'"],
  ["horariosV2_block_morning_ex2: 'Contemporáneo 11:45h'", "horariosV2_block_morning_ex2: 'Contemporani 11:45h'"],
  ["horariosV2_block_morning_ex3: 'Pilates y Stretching'", "horariosV2_block_morning_ex3: 'Pilates i Stretching'"],
  ["horariosV2_block_urbano_ex1: 'Afrobeats y Dancehall'", "horariosV2_block_urbano_ex1: 'Afrobeats i Dancehall'"],
  ["horariosV2_block_urbano_ex2: 'Hip Hop y Reggaeton'", "horariosV2_block_urbano_ex2: 'Hip Hop i Reggaeton'"],
  ["horariosV2_block_urbano_ex3: 'Heels y Twerk'", "horariosV2_block_urbano_ex3: 'Heels i Twerk'"],
  ["horariosV2_level_beginner_desc: 'Empiezas desde cero'", "horariosV2_level_beginner_desc: 'Comences des de zero'"],
  ["horariosV2_level_basic: 'Básico'", "horariosV2_level_basic: 'Bàsic'"],
  ["horariosV2_level_basic_desc: 'Conoces los fundamentos'", "horariosV2_level_basic_desc: 'Coneixes els fonaments'"],
  ["horariosV2_level_intermediate: 'Intermedio'", "horariosV2_level_intermediate: 'Intermedi'"],
  ["horariosV2_level_intermediate_desc: 'Dominas la técnica básica'", "horariosV2_level_intermediate_desc: 'Domines la tècnica bàsica'"],
  ["horariosV2_level_advanced: 'Avanzado'", "horariosV2_level_advanced: 'Avançat'"],
  ["horariosV2_level_advanced_desc: 'Alto dominio técnico'", "horariosV2_level_advanced_desc: 'Alt domini tècnic'"],
  ["horariosV2_whyNotAll_title: '¿Por qué no mostramos todos los horarios?'", "horariosV2_whyNotAll_title: 'Per què no mostrem tots els horaris?'"],
  ["'Porque cada persona es diferente. Queremos ayudarte a encontrar el grupo perfecto según tu nivel, tu disponibilidad y tus objetivos.'", "'Perquè cada persona és diferent. Volem ajudar-te a trobar el grup perfecte segons el teu nivell, la teva disponibilitat i els teus objectius.'"],
  ["'Por eso preferimos enviarte la información completa y personalizada por email.'", "'Per això preferim enviar-te la informació completa i personalitzada per email.'"],
  ["horariosV2_testimonials_title: 'Lo que dicen nuestros alumnos'", "horariosV2_testimonials_title: 'El que diuen els nostres alumnes'"],
  ["'Las clases de mañana me cambiaron la rutina. Ahora empiezo el día con energía y buen humor.'", "'Les classes de matí em van canviar la rutina. Ara començo el dia amb energia i bon humor.'"],
  ["'Después del trabajo, bailar es mi mejor forma de desconectar. El ambiente es increíble.'", "'Després de la feina, ballar és la meva millor manera de desconnectar. L\\'ambient és increïble.'"],
  ["'Empecé sin saber nada y ahora no me pierdo una clase. Los profes son lo mejor.'", "'Vaig començar sense saber res i ara no em perdo cap classe. Els profes són el millor.'"],
  ["horariosV2_cta_title: 'Tu próximo paso'", "horariosV2_cta_title: 'El teu proper pas'"],
  ["horariosV2_cta_emotional1: 'No se trata solo de encajar una clase en tu agenda.'", "horariosV2_cta_emotional1: 'No es tracta només d\\'encaixar una classe a la teva agenda.'"],
  ["'Se trata de encontrar un lugar donde disfrutar, progresar y sentirte parte de una comunidad.'", "'Es tracta de trobar un lloc on gaudir, progressar i sentir-te part d\\'una comunitat.'"],
  ["horariosV2_cta_primary: 'Recibir Horarios Completos'", "horariosV2_cta_primary: 'Rebre Horaris Complets'"],
  ["horariosV2_cta_subtext: 'Sense compromís - Te contactamos de manera inmediata'", "horariosV2_cta_subtext: 'Sense compromís - Et contactem de manera immediata'"],
];

for (const [search, replace] of replacements) {
  content = content.replace(search, replace);
}

fs.writeFileSync(caPath, content, 'utf8');
console.log('Catalan translations updated!');
