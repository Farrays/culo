import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.join(__dirname, '../i18n/locales/en.ts');

let content = fs.readFileSync(enPath, 'utf8');

const replacements = [
  // Page meta
  ["horariosV2_page_title: 'Horarios Clases de Baile Barcelona | Farray Center'", "horariosV2_page_title: 'Dance Class Schedules Barcelona | Farray Center'"],
  ["'Encuentra el horario perfecto para tus clases de baile in Barcelona. Mañanas, tardes y noches. +25 estilos de danza, salsa, bachata, urbano y más. Grupos por nivel.'", "'Find the perfect schedule for your dance classes in Barcelona. Mornings, afternoons and evenings. +25 dance styles, salsa, bachata, urban and more. Groups by level.'"],

  // Skip links
  ["horariosV2_skipToContent: 'Saltar al contenido principal'", "horariosV2_skipToContent: 'Skip to main content'"],
  ["horariosV2_skipToFilters: 'Ir a filtros de horario'", "horariosV2_skipToFilters: 'Go to schedule filters'"],

  // Hero
  ["horariosV2_hero_title: 'Horarios de Clases de Baile in Barcelona'", "horariosV2_hero_title: 'Dance Class Schedules in Barcelona'"],
  ["'Encuentra el horario y el estilo que encajan contigo y descubre cómo empezar en Farray Center de forma clara y sin compromiso.'", "'Find the schedule and style that fit you and discover how to start at Farray Center in a clear and commitment-free way.'"],
  ["horariosV2_hero_cta: 'Recibir Horarios Completos'", "horariosV2_hero_cta: 'Get Full Schedules'"],
  ["horariosV2_hero_ctaSubtext: 'Gratis y sin compromiso'", "horariosV2_hero_ctaSubtext: 'No commitment'"],
  ["horariosV2_hero_years: 'años in Barcelona'", "horariosV2_hero_years: 'years in Barcelona'"],

  // Preview section
  ["horariosV2_preview_title: 'Esto es solo una muestra'", "horariosV2_preview_title: 'This is just a sample'"],
  ["horariosV2_preview_subtitle: 'Tenemos muchos más horarios y estilos que mostrarte'", "horariosV2_preview_subtitle: 'We have many more schedules and styles to show you'"],
  ["horariosV2_preview_point1: '+100 clases semanales de baile'", "horariosV2_preview_point1: '+100 weekly dance classes'"],
  ["horariosV2_preview_point2: 'Horarios de mañana, tarde y noche'", "horariosV2_preview_point2: 'Morning, afternoon and evening schedules'"],
  ["horariosV2_preview_point3: 'Todos los niveles y edades'", "horariosV2_preview_point3: 'All levels and ages'"],
  ["horariosV2_preview_point4: 'Información de profesores y salas'", "horariosV2_preview_point4: 'Teacher and studio information'"],
  ["horariosV2_preview_cta: 'Recibir Horarios Completos por Email'", "horariosV2_preview_cta: 'Get Full Schedules by Email'"],
  ["horariosV2_preview_free: 'Gratis y sin compromiso'", "horariosV2_preview_free: 'No commitment'"],

  // More schedules
  ["horariosV2_moreSchedules_title: 'Hay muchos más horarios disponibles'", "horariosV2_moreSchedules_title: 'There are many more schedules available'"],
  ["'Los horarios que ves aquí son solo una selección. Para ver todos los horarios disponibles, incluyendo clases de noche y fines de semana, solicita la información completa.'", "'The schedules you see here are just a selection. To see all available schedules, including evening and weekend classes, request the complete information.'"],
  ["horariosV2_moreSchedules_cta: 'Ver Todos los Horarios'", "horariosV2_moreSchedules_cta: 'View All Schedules'"],
  ["horariosV2_sample_preview_label: 'Muestra de horarios - Para ver todos, solicita info'", "horariosV2_sample_preview_label: 'Schedule sample - To see all, request info'"],

  // Trust badges
  ["horariosV2_trust_noCommitment: 'Sin permanencia'", "horariosV2_trust_noCommitment: 'No minimum stay'"],
  ["horariosV2_trust_byLevel: 'Grupos por nivel'", "horariosV2_trust_byLevel: 'Groups by level'"],
  ["horariosV2_trust_freeClass: 'Primera clase gratuita'", "horariosV2_trust_freeClass: 'Welcome class'"],

  // Authority badges
  ["horariosV2_authority_since2017: 'Desde 2017'", "horariosV2_authority_since2017: 'Since 2017'"],
  ["horariosV2_authority_members: '+15.000 socios'", "horariosV2_authority_members: '+15,000 members'"],
  ["horariosV2_authority_styles: '+25 estilos'", "horariosV2_authority_styles: '+25 styles'"],
  ["horariosV2_authority_teachers: 'Profesores certificados'", "horariosV2_authority_teachers: 'Certified teachers'"],

  // Orientation section
  ["horariosV2_orientation_title: 'Antes de elegir un horario, ten en cuenta esto'", "horariosV2_orientation_title: 'Before choosing a schedule, keep this in mind'"],
  ["'No te preocupes si es tu primera vez. Estamos aquí para ayudarte.'", "'Don\\'t worry if it\\'s your first time. We\\'re here to help you.'"],
  ["horariosV2_orientation_noExperience: 'No necesitas experiencia previa en muchas actividades'", "horariosV2_orientation_noExperience: 'No prior experience needed for many activities'"],
  ["horariosV2_orientation_byLevel: 'Los grupos se organizan por nivel'", "horariosV2_orientation_byLevel: 'Groups are organised by level'"],
  ["horariosV2_orientation_startAnytime: 'Puedes empezar en cualquier momento del año'", "horariosV2_orientation_startAnytime: 'You can start at any time of the year'"],
  ["horariosV2_orientation_weHelp: 'Te ayudamos a elegir el grupo adecuado'", "horariosV2_orientation_weHelp: 'We help you choose the right group'"],

  // Filter section
  ["horariosV2_filter_title: 'Encuentra lo que encaja contigo'", "horariosV2_filter_title: 'Find what fits you'"],
  ["horariosV2_filter_subtitle: 'Selecciona el momento del día o el estilo que prefieres'", "horariosV2_filter_subtitle: 'Select the time of day or style you prefer'"],
  ["horariosV2_filter_step1: 'Por horario'", "horariosV2_filter_step1: 'By schedule'"],
  ["horariosV2_filter_step2: 'Por estilo'", "horariosV2_filter_step2: 'By style'"],
  ["horariosV2_filter_morning: 'Mañanas'", "horariosV2_filter_morning: 'Mornings'"],
  ["horariosV2_filter_afternoon: 'Tardes'", "horariosV2_filter_afternoon: 'Afternoons'"],
  ["horariosV2_filter_evening: 'Noches'", "horariosV2_filter_evening: 'Evenings'"],
  ["horariosV2_filter_danza: 'Danza'", "horariosV2_filter_danza: 'Dance'"],
  ["horariosV2_filter_urbano: 'Urbano'", "horariosV2_filter_urbano: 'Urban'"],
  ["horariosV2_filter_fitness: 'Prep. Física'", "horariosV2_filter_fitness: 'Fitness Prep'"],

  // Matrix
  ["horariosV2_matrix_title: 'Vista rápida de disponibilidad'", "horariosV2_matrix_title: 'Quick availability view'"],
  ["horariosV2_matrix_available: 'Disponible'", "horariosV2_matrix_available: 'Available'"],
  ["horariosV2_matrix_unavailable: 'Sin clases'", "horariosV2_matrix_unavailable: 'No classes'"],

  // Days
  ["horariosV2_day_monday: 'Lunes'", "horariosV2_day_monday: 'Monday'"],
  ["horariosV2_day_tuesday: 'Martes'", "horariosV2_day_tuesday: 'Tuesday'"],
  ["horariosV2_day_wednesday: 'Miércoles'", "horariosV2_day_wednesday: 'Wednesday'"],
  ["horariosV2_day_thursday: 'Jueves'", "horariosV2_day_thursday: 'Thursday'"],
  ["horariosV2_day_friday: 'Viernes'", "horariosV2_day_friday: 'Friday'"],
  ["horariosV2_day_saturday: 'Sábado'", "horariosV2_day_saturday: 'Saturday'"],
  ["horariosV2_day_sunday: 'Domingo'", "horariosV2_day_sunday: 'Sunday'"],

  // Schedule blocks
  ["horariosV2_block_morning_title: 'Clases de baile por la mañana in Barcelona'", "horariosV2_block_morning_title: 'Morning dance classes in Barcelona'"],
  ["horariosV2_block_morning_subtitle: 'Afro · Jazz · Contemporáneo · Preparación física'", "horariosV2_block_morning_subtitle: 'Afro · Jazz · Contemporary · Physical preparation'"],
  ["horariosV2_block_evening_title: 'Clases de baile por la tarde y noche in Barcelona'", "horariosV2_block_evening_title: 'Afternoon and evening dance classes in Barcelona'"],
  ["horariosV2_block_evening_subtitle: 'Afro · Jazz · Ballet · Contemporáneo'", "horariosV2_block_evening_subtitle: 'Afro · Jazz · Ballet · Contemporary'"],
  ["horariosV2_block_salsa_title: 'Horarios de salsa y bachata in Barcelona'", "horariosV2_block_salsa_title: 'Salsa and bachata schedules in Barcelona'"],
  ["horariosV2_block_salsa_subtitle: 'Social · Progresivo · Todos los niveles'", "horariosV2_block_salsa_subtitle: 'Social · Progressive · All levels'"],
  ["horariosV2_block_urbano_title: 'Clases de baile urbano in Barcelona'", "horariosV2_block_urbano_title: 'Urban dance classes in Barcelona'"],
  ["horariosV2_block_showMore: 'Ver más clases'", "horariosV2_block_showMore: 'See more classes'"],
  ["'Horarios orientativos. Asignación definitiva según nivel y disponibilidad.'", "'Indicative schedules. Final assignment according to level and availability.'"],

  // CTAs per block
  ["horariosV2_cta_morning: 'Ver plazas disponibles para mañanas'", "horariosV2_cta_morning: 'See available spots for mornings'"],
  ["horariosV2_cta_evening: 'Ver grupos por nivel'", "horariosV2_cta_evening: 'See groups by level'"],
  ["horariosV2_cta_salsa: 'Encontrar mi grupo de salsa ideal'", "horariosV2_cta_salsa: 'Find my ideal salsa group'"],
  ["horariosV2_cta_urbano: 'Descubrir actividades urbanas'", "horariosV2_cta_urbano: 'Discover urban activities'"],

  // Testimonials
  ["'Las clases de mañana me cambiaron la rutina. Ahora empiezo el día con energía.'", "'Morning classes changed my routine. Now I start the day with energy.'"],
  ["horariosV2_testimonial_morning_author: 'María, 34 años'", "horariosV2_testimonial_morning_author: 'Maria, 34 years old'"],
  ["horariosV2_testimonial_evening: 'Después del trabajo, bailar es mi mejor forma de desconectar.'", "horariosV2_testimonial_evening: 'After work, dancing is my best way to unwind.'"],
  ["horariosV2_testimonial_evening_author: 'Carlos, 28 años'", "horariosV2_testimonial_evening_author: 'Carlos, 28 years old'"],
  ["horariosV2_testimonial_salsa: 'Empecé sin saber nada y ahora no me pierdo una clase de bachata.'", "horariosV2_testimonial_salsa: 'I started knowing nothing and now I never miss a bachata class.'"],
  ["horariosV2_testimonial_salsa_author: 'Laura, 31 años'", "horariosV2_testimonial_salsa_author: 'Laura, 31 years old'"],
  ["'El ambiente es increíble. Te sientes parte de una familia desde el primer día.'", "'The atmosphere is incredible. You feel part of a family from day one.'"],
  ["horariosV2_testimonial_urbano_author: 'Pablo, 25 años'", "horariosV2_testimonial_urbano_author: 'Pablo, 25 years old'"],

  // Badges
  ["horariosV2_badge_popular: 'Más demandado'", "horariosV2_badge_popular: 'Most popular'"],
  ["horariosV2_badge_limited: 'Plazas limitadas'", "horariosV2_badge_limited: 'Limited spots'"],
  ["horariosV2_badge_new: 'Nuevo'", "horariosV2_badge_new: 'New'"],

  // Card actions
  ["horariosV2_card_teacher: 'Profesor/a'", "horariosV2_card_teacher: 'Teacher'"],
  ["horariosV2_card_reminder: 'Recordar'", "horariosV2_card_reminder: 'Remind'"],
  ["horariosV2_card_share: 'Compartir'", "horariosV2_card_share: 'Share'"],

  // Levels
  ["horariosV2_levels_title: '¿Qué significan los niveles?'", "horariosV2_levels_title: 'What do the levels mean?'"],
  ["'Te ayudamos a encontrar el grupo perfecto para tu experiencia actual.'", "'We help you find the perfect group for your current experience.'"],
  ["horariosV2_level_principiantes: 'Beginners'", "horariosV2_level_principiantes: 'Beginners'"],
  ["'Empiezas desde cero. No tienes experiencia previa en este estilo. Te guiaremos paso a paso.'", "'You start from scratch. You have no prior experience in this style. We\\'ll guide you step by step.'"],
  ["horariosV2_level_basico: 'Básico'", "horariosV2_level_basico: 'Basic'"],
  ["'Conoces los fundamentos. Has practicado algo antes pero aún estás aprendiendo las bases.'", "'You know the fundamentals. You\\'ve practised a bit before but are still learning the basics.'"],
  ["horariosV2_level_intermedio: 'Intermediate'", "horariosV2_level_intermedio: 'Intermediate'"],
  ["'Dominas la técnica básica. Puedes seguir coreografías y quieres perfeccionar tu estilo.'", "'You\\'ve mastered basic technique. You can follow choreographies and want to perfect your style.'"],
  ["horariosV2_level_avanzado: 'Avanzado'", "horariosV2_level_avanzado: 'Advanced'"],
  ["'Alto dominio técnico. Buscas retos, coreografías complejas y preparación para escenario.'", "'High technical mastery. You\\'re looking for challenges, complex choreographies and stage preparation.'"],
  ["'Todos los niveles mezclados. Cada uno trabaja a su ritmo con adaptaciones del profesor.'", "'All levels mixed. Everyone works at their own pace with adaptations from the teacher.'"],
  ["horariosV2_level_intermedioAvanzado: 'Intermediate-Avanzado'", "horariosV2_level_intermedioAvanzado: 'Intermediate-Advanced'"],
  ["'¿No sabes cuál es tu nivel? No te preocupes, te orientamos personalmente antes de empezar.'", "'Don\\'t know your level? Don\\'t worry, we\\'ll guide you personally before you start.'"],

  // Season
  ["horariosV2_season_current: 'Actual'", "horariosV2_season_current: 'Current'"],
  ["horariosV2_season_winter: 'Horario de invierno'", "horariosV2_season_winter: 'Winter schedule'"],
  ["horariosV2_season_winter_desc: 'Estos son los horarios actuales (septiembre - junio).'", "horariosV2_season_winter_desc: 'These are the current schedules (September - June).'"],
  ["horariosV2_season_summer: 'Horario de verano'", "horariosV2_season_summer: 'Summer schedule'"],
  ["'Los horarios pueden variar en julio y agosto. Consulta disponibilidad.'", "'Schedules may vary in July and August. Check availability.'"],

  // How to start
  ["horariosV2_howToStart_title: 'Cómo empezar en Farray Center'", "horariosV2_howToStart_title: 'How to start at Farray Center'"],
  ["horariosV2_howToStart_subtitle: 'Cuatro pasos sencillos para comenzar tu aventura en el baile'", "horariosV2_howToStart_subtitle: 'Four simple steps to begin your dance adventure'"],
  ["horariosV2_howToStart_step1: 'Recibe la información completa'", "horariosV2_howToStart_step1: 'Receive the complete information'"],
  ["horariosV2_howToStart_step2: 'Valora horarios y niveles'", "horariosV2_howToStart_step2: 'Evaluate schedules and levels'"],
  ["horariosV2_howToStart_step3: 'Ven a conocernos (opcional)'", "horariosV2_howToStart_step3: 'Come meet us (optional)'"],
  ["horariosV2_howToStart_step4: 'Empieza cuando te sientas listo/a'", "horariosV2_howToStart_step4: 'Start when you feel ready'"],
  ["horariosV2_howToStart_cta: 'Descubre Cómo Empezar'", "horariosV2_howToStart_cta: 'Discover How to Start'"],
  ["horariosV2_howToStart_microcopy: 'Sin compromiso · Información clara · A tu ritmo'", "horariosV2_howToStart_microcopy: 'No commitment · Clear information · At your own pace'"],

  // FAQ
  ["horariosV2_faq_title: 'Preguntas frecuentes sobre los horarios de nuestras clases de baile'", "horariosV2_faq_title: 'Frequently asked questions about our dance class schedules'"],
  ["horariosV2_faq_subtitle: 'Las respuestas a las dudas más comunes sobre nuestras clases'", "horariosV2_faq_subtitle: 'Answers to the most common questions about our classes'"],
  ["horariosV2_faq1_q: '¿Puedo empezar clases de baile aunque no tenga experiencia?'", "horariosV2_faq1_q: 'Can I start dance classes even if I have no experience?'"],
  ["'Sí. Muchas de nuestras clases están pensadas para personas que empiezan desde cero. Además, te ayudamos a elegir el grupo adecuado según tu experiencia y objetivos.'", "'Yes. Many of our classes are designed for people starting from scratch. Plus, we help you choose the right group based on your experience and goals.'"],
  ["horariosV2_faq2_q: '¿Tengo que elegir un horario fijo desde el primer día?'", "horariosV2_faq2_q: 'Do I have to choose a fixed schedule from day one?'"],
  ["'Como club deportivo, trabajamos con horarios organizados por nivel. Una vez te orientamos, podrás elegir el horario que mejor encaje contigo dentro de las opciones disponibles.'", "'As a sports club, we work with schedules organised by level. Once we guide you, you can choose the schedule that best fits you from the available options.'"],
  ["horariosV2_faq3_q: '¿Puedo cambiar de horario o de estilo más adelante?'", "horariosV2_faq3_q: 'Can I change my schedule or style later?'"],
  ["'Sí. Nuestros socios pueden adaptar su participación según disponibilidad y evolución, siempre que haya plazas disponibles en el grupo.'", "'Yes. Our members can adapt their participation according to availability and progress, as long as there are spots available in the group.'"],
  ["horariosV2_faq4_q: '¿Hay clases por la mañana y por la tarde?'", "horariosV2_faq4_q: 'Are there morning and afternoon classes?'"],
  ["'Sí. Ofrecemos clases de baile tanto por la mañana como por la tarde y noche, según el estilo y la temporada.'", "'Yes. We offer dance classes in the morning as well as afternoon and evening, depending on the style and season.'"],
  ["horariosV2_faq5_q: '¿Los horarios son siempre los mismos todo el año?'", "horariosV2_faq5_q: 'Are the schedules always the same throughout the year?'"],
  ["'Los horarios son orientativos y pueden variar según la temporada, el nivel y la disponibilidad de plazas. Siempre te enviamos la información actualizada antes de empezar.'", "'Schedules are indicative and may vary according to season, level and availability. We always send you updated information before you start.'"],
  ["horariosV2_faq6_q: '¿Puedo probar una clase antes de inscribirme?'", "horariosV2_faq6_q: 'Can I try a class before signing up?'"],
  ["horariosV2_faq7_q: '¿Dónde está Farray Center y a quién van dirigidas las actividades de baile?'", "horariosV2_faq7_q: 'Where is Farray Center and who are the dance activities aimed at?'"],
  ["'Estamos en Calle Entença nº 100 in Barcelona y nuestras clases están dirigidas a adultos de todos los niveles que quieren aprender, mejorar o disfrutar del baile en un entorno profesional y cercano.'", "'We\\'re at Calle Entença 100 in Barcelona and our classes are aimed at adults of all levels who want to learn, improve or enjoy dancing in a professional and welcoming environment.'"],

  // Emotional close
  ["'No se trata solo de encajar una clase en tu agenda. Se trata de encontrar un lugar donde disfrutar, progresar y sentirte parte de una comunidad.'", "'It\\'s not just about fitting a class into your schedule. It\\'s about finding a place to enjoy, progress and feel part of a community.'"],
  ["horariosV2_whatsapp_cta: '¿Tienes más dudas? Escríbenos por WhatsApp'", "horariosV2_whatsapp_cta: 'Have more questions? Message us on WhatsApp'"],

  // Footer
  ["'Los horarios y plazas mostrados son orientativos y pueden variar según temporada, nivel y disponibilidad. La asignación definitiva de grupo se realiza de forma personalizada tras solicitar información.'", "'Schedules and spots shown are indicative and may vary according to season, level and availability. Final group assignment is done on a personalised basis after requesting information.'"],

  // Navigation
  ["horariosV2_nav_ariaLabel: 'Navegación rápida de secciones de horarios'", "horariosV2_nav_ariaLabel: 'Quick navigation of schedule sections'"],
  ["horariosV2_nav_progressLabel: 'Progreso de lectura'", "horariosV2_nav_progressLabel: 'Reading progress'"],
  ["horariosV2_nav_morning: 'Mañanas'", "horariosV2_nav_morning: 'Mornings'"],
  ["horariosV2_nav_evening: 'Tardes'", "horariosV2_nav_evening: 'Evenings'"],
  ["horariosV2_nav_urbano: 'Urbano'", "horariosV2_nav_urbano: 'Urban'"],
  ["horariosV2_nav_levels: 'Niveles'", "horariosV2_nav_levels: 'Levels'"],

  // Styles
  ["horariosV2_style_contemporaneo: 'Contemporáneo'", "horariosV2_style_contemporaneo: 'Contemporary'"],
  ["horariosV2_style_contemporaneoLirico: 'Contemporáneo Lírico & Flow'", "horariosV2_style_contemporaneoLirico: 'Lyrical Contemporary & Flow'"],
  ["horariosV2_style_afroContemporaneo: 'Afro Contemporáneo'", "horariosV2_style_afroContemporaneo: 'Afro Contemporary'"],
  ["horariosV2_style_ballet: 'Ballet Clásico'", "horariosV2_style_ballet: 'Classical Ballet'"],
  ["horariosV2_style_hipHop: 'Hip Hop Urbano'", "horariosV2_style_hipHop: 'Urban Hip Hop'"],
  ["horariosV2_style_reggaeton: 'Reggaeton Comercial'", "horariosV2_style_reggaeton: 'Commercial Reggaeton'"],

  // Additional keys
  ["horariosV2_hero_subtitle2: 'Encuentra el horario perfecto para ti'", "horariosV2_hero_subtitle2: 'Find the perfect schedule for you'"],
  ["horariosV2_weekly_classes: 'clases semanales'", "horariosV2_weekly_classes: 'weekly classes'"],
  ["horariosV2_trust_noExperience: 'No necesitas experiencia'", "horariosV2_trust_noExperience: 'No experience needed'"],
  ["'Los horarios que ves aquí son solo una muestra. Tenemos más de 100 clases semanales de baile en diferentes estilos y niveles.'", "'The schedules you see here are just a sample. We have over 100 weekly dance classes in different styles and levels.'"],
  ["horariosV2_preview_includes: 'La información completa incluye:'", "horariosV2_preview_includes: 'The complete information includes:'"],
  ["horariosV2_howItWorks_title: 'Cómo funcionan nuestros horarios'", "horariosV2_howItWorks_title: 'How our schedules work'"],
  ["'Organizamos las clases por bloques horarios y niveles para que encuentres fácilmente el que mejor encaja contigo.'", "'We organise classes by time blocks and levels so you can easily find the one that best fits you.'"],
  ["horariosV2_reassurance1: 'Clases de mañana, tarde y noche'", "horariosV2_reassurance1: 'Morning, afternoon and evening classes'"],
  ["horariosV2_reassurance2: 'Todos los niveles'", "horariosV2_reassurance2: 'All levels'"],
  ["horariosV2_reassurance4: 'Ambiente acogedor'", "horariosV2_reassurance4: 'Welcoming atmosphere'"],
  ["horariosV2_blocks_title: 'Bloques de Horarios'", "horariosV2_blocks_title: 'Schedule Blocks'"],
  ["'Cada bloque agrupa clases en franjas horarias similares. Elige el que mejor se adapte a tu día a día.'", "'Each block groups classes in similar time slots. Choose the one that best fits your daily routine.'"],
  ["horariosV2_classes_available: 'clases disponibles'", "horariosV2_classes_available: 'classes available'"],
  ["horariosV2_see_schedule: 'Ver horarios completos'", "horariosV2_see_schedule: 'View full schedules'"],
  ["horariosV2_blocks_cta: 'Recibir Todos los Horarios'", "horariosV2_blocks_cta: 'Get All Schedules'"],
  ["horariosV2_block_morning_ex2: 'Contemporáneo 11:45h'", "horariosV2_block_morning_ex2: 'Contemporary 11:45am'"],
  ["horariosV2_block_morning_ex3: 'Pilates y Stretching'", "horariosV2_block_morning_ex3: 'Pilates and Stretching'"],
  ["horariosV2_block_morning_ex1: 'Afro Jazz 10:30h'", "horariosV2_block_morning_ex1: 'Afro Jazz 10:30am'"],
  ["horariosV2_block_urbano_ex1: 'Afrobeats y Dancehall'", "horariosV2_block_urbano_ex1: 'Afrobeats and Dancehall'"],
  ["horariosV2_block_urbano_ex2: 'Hip Hop y Reggaeton'", "horariosV2_block_urbano_ex2: 'Hip Hop and Reggaeton'"],
  ["horariosV2_block_urbano_ex3: 'Heels y Twerk'", "horariosV2_block_urbano_ex3: 'Heels and Twerk'"],
  ["horariosV2_level_beginner_desc: 'Empiezas desde cero'", "horariosV2_level_beginner_desc: 'You start from scratch'"],
  ["horariosV2_level_basic: 'Básico'", "horariosV2_level_basic: 'Basic'"],
  ["horariosV2_level_basic_desc: 'Conoces los fundamentos'", "horariosV2_level_basic_desc: 'You know the fundamentals'"],
  ["horariosV2_level_intermediate: 'Intermediate'", "horariosV2_level_intermediate: 'Intermediate'"],
  ["horariosV2_level_intermediate_desc: 'Dominas la técnica básica'", "horariosV2_level_intermediate_desc: 'You\\'ve mastered basic technique'"],
  ["horariosV2_level_advanced: 'Avanzado'", "horariosV2_level_advanced: 'Advanced'"],
  ["horariosV2_level_advanced_desc: 'Alto dominio técnico'", "horariosV2_level_advanced_desc: 'High technical mastery'"],
  ["horariosV2_whyNotAll_title: '¿Por qué no mostramos todos los horarios?'", "horariosV2_whyNotAll_title: 'Why don\\'t we show all schedules?'"],
  ["'Porque cada persona es diferente. Queremos ayudarte a encontrar el grupo perfecto según tu nivel, tu disponibilidad y tus objetivos.'", "'Because everyone is different. We want to help you find the perfect group according to your level, availability and goals.'"],
  ["'Por eso preferimos enviarte la información completa y personalizada por email.'", "'That\\'s why we prefer to send you the complete and personalised information by email.'"],
  ["horariosV2_testimonials_title: 'Lo que dicen nuestros alumnos'", "horariosV2_testimonials_title: 'What our students say'"],
  ["'Las clases de mañana me cambiaron la rutina. Ahora empiezo el día con energía y buen humor.'", "'Morning classes changed my routine. Now I start the day with energy and good mood.'"],
  ["'Después del trabajo, bailar es mi mejor forma de desconectar. El ambiente es increíble.'", "'After work, dancing is my best way to unwind. The atmosphere is incredible.'"],
  ["'Empecé sin saber nada y ahora no me pierdo una clase. Los profes son lo mejor.'", "'I started knowing nothing and now I never miss a class. The teachers are the best.'"],
  ["horariosV2_cta_title: 'Tu próximo paso'", "horariosV2_cta_title: 'Your next step'"],
  ["horariosV2_cta_emotional1: 'No se trata solo de encajar una clase en tu agenda.'", "horariosV2_cta_emotional1: 'It\\'s not just about fitting a class into your schedule.'"],
  ["'Se trata de encontrar un lugar donde disfrutar, progresar y sentirte parte de una comunidad.'", "'It\\'s about finding a place to enjoy, progress and feel part of a community.'"],
  ["horariosV2_cta_primary: 'Recibir Horarios Completos'", "horariosV2_cta_primary: 'Get Full Schedules'"],
  ["horariosV2_cta_subtext: 'Gratis y sin compromiso - Te contactamos de manera inmediata'", "horariosV2_cta_subtext: 'No commitment - We contact you immediately'"],
];

for (const [search, replace] of replacements) {
  content = content.replace(search, replace);
}

fs.writeFileSync(enPath, content, 'utf8');
console.log('English translations updated!');
