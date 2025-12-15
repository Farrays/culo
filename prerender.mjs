import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// All language/page combinations to prerender
const routes = [
  { path: '', lang: 'es', page: 'home' },
  { path: 'es', lang: 'es', page: 'home' },
  { path: 'es/clases/baile-barcelona', lang: 'es', page: 'classes' },
  { path: 'es/clases/danza-barcelona', lang: 'es', page: 'danza' },
  { path: 'es/clases/salsa-bachata-barcelona', lang: 'es', page: 'salsaBachata' },
  { path: 'es/clases/salsa-cubana-barcelona', lang: 'es', page: 'salsaCubana' },
  { path: 'es/clases/salsa-lady-style-barcelona', lang: 'es', page: 'salsaLadyStyle' },
  { path: 'es/clases/folklore-cubano', lang: 'es', page: 'folkloreCubano' },
  { path: 'es/clases/danzas-urbanas-barcelona', lang: 'es', page: 'danzasUrbanas' },
  { path: 'es/clases/dancehall-barcelona', lang: 'es', page: 'dancehall' },
  { path: 'es/clases/twerk-barcelona', lang: 'es', page: 'twerk' },
  { path: 'es/clases/afrobeats-barcelona', lang: 'es', page: 'afrobeat' },
  { path: 'es/clases/hip-hop-reggaeton-barcelona', lang: 'es', page: 'hipHopReggaeton' },
  { path: 'es/clases/sexy-reggaeton-barcelona', lang: 'es', page: 'sexyReggaeton' },
  { path: 'es/clases/reggaeton-cubano-barcelona', lang: 'es', page: 'reggaetonCubano' },
  { path: 'es/clases/heels-barcelona', lang: 'es', page: 'heelsBarcelona' },
  { path: 'es/clases/femmology', lang: 'es', page: 'femmology' },
  { path: 'es/clases/sexy-style-barcelona', lang: 'es', page: 'sexyStyle' },
  { path: 'es/clases/modern-jazz-barcelona', lang: 'es', page: 'modernJazz' },
  { path: 'es/clases/ballet-barcelona', lang: 'es', page: 'ballet' },
  { path: 'es/clases-particulares-baile', lang: 'es', page: 'clasesParticulares' },
  { path: 'es/sobre-nosotros', lang: 'es', page: 'about' },
  { path: 'es/yunaisy-farray', lang: 'es', page: 'yunaisy' },
  { path: 'es/merchandising', lang: 'es', page: 'merchandising' },
  { path: 'es/regala-baile', lang: 'es', page: 'regalaBaile' },
  { path: 'es/instalaciones', lang: 'es', page: 'facilities' },
  { path: 'es/contacto', lang: 'es', page: 'contact' },

  { path: 'ca', lang: 'ca', page: 'home' },
  { path: 'ca/clases/baile-barcelona', lang: 'ca', page: 'classes' },
  { path: 'ca/clases/danza-barcelona', lang: 'ca', page: 'danza' },
  { path: 'ca/clases/salsa-bachata-barcelona', lang: 'ca', page: 'salsaBachata' },
  { path: 'ca/clases/salsa-cubana-barcelona', lang: 'ca', page: 'salsaCubana' },
  { path: 'ca/clases/salsa-lady-style-barcelona', lang: 'ca', page: 'salsaLadyStyle' },
  { path: 'ca/clases/folklore-cubano', lang: 'ca', page: 'folkloreCubano' },
  { path: 'ca/clases/danzas-urbanas-barcelona', lang: 'ca', page: 'danzasUrbanas' },
  { path: 'ca/clases/dancehall-barcelona', lang: 'ca', page: 'dancehall' },
  { path: 'ca/clases/twerk-barcelona', lang: 'ca', page: 'twerk' },
  { path: 'ca/clases/afrobeats-barcelona', lang: 'ca', page: 'afrobeat' },
  { path: 'ca/clases/hip-hop-reggaeton-barcelona', lang: 'ca', page: 'hipHopReggaeton' },
  { path: 'ca/clases/sexy-reggaeton-barcelona', lang: 'ca', page: 'sexyReggaeton' },
  { path: 'ca/clases/reggaeton-cubano-barcelona', lang: 'ca', page: 'reggaetonCubano' },
  { path: 'ca/clases/heels-barcelona', lang: 'ca', page: 'heelsBarcelona' },
  { path: 'ca/clases/femmology', lang: 'ca', page: 'femmology' },
  { path: 'ca/clases/sexy-style-barcelona', lang: 'ca', page: 'sexyStyle' },
  { path: 'ca/clases/modern-jazz-barcelona', lang: 'ca', page: 'modernJazz' },
  { path: 'ca/clases/ballet-barcelona', lang: 'ca', page: 'ballet' },
  { path: 'ca/clases-particulares-baile', lang: 'ca', page: 'clasesParticulares' },
  { path: 'ca/sobre-nosotros', lang: 'ca', page: 'about' },
  { path: 'ca/yunaisy-farray', lang: 'ca', page: 'yunaisy' },
  { path: 'ca/merchandising', lang: 'ca', page: 'merchandising' },
  { path: 'ca/regala-baile', lang: 'ca', page: 'regalaBaile' },
  { path: 'ca/instalaciones', lang: 'ca', page: 'facilities' },
  { path: 'ca/contacto', lang: 'ca', page: 'contact' },

  { path: 'en', lang: 'en', page: 'home' },
  { path: 'en/clases/baile-barcelona', lang: 'en', page: 'classes' },
  { path: 'en/clases/danza-barcelona', lang: 'en', page: 'danza' },
  { path: 'en/clases/salsa-bachata-barcelona', lang: 'en', page: 'salsaBachata' },
  { path: 'en/clases/salsa-cubana-barcelona', lang: 'en', page: 'salsaCubana' },
  { path: 'en/clases/salsa-lady-style-barcelona', lang: 'en', page: 'salsaLadyStyle' },
  { path: 'en/clases/folklore-cubano', lang: 'en', page: 'folkloreCubano' },
  { path: 'en/clases/danzas-urbanas-barcelona', lang: 'en', page: 'danzasUrbanas' },
  { path: 'en/clases/dancehall-barcelona', lang: 'en', page: 'dancehall' },
  { path: 'en/clases/twerk-barcelona', lang: 'en', page: 'twerk' },
  { path: 'en/clases/afrobeats-barcelona', lang: 'en', page: 'afrobeat' },
  { path: 'en/clases/hip-hop-reggaeton-barcelona', lang: 'en', page: 'hipHopReggaeton' },
  { path: 'en/clases/sexy-reggaeton-barcelona', lang: 'en', page: 'sexyReggaeton' },
  { path: 'en/clases/reggaeton-cubano-barcelona', lang: 'en', page: 'reggaetonCubano' },
  { path: 'en/clases/heels-barcelona', lang: 'en', page: 'heelsBarcelona' },
  { path: 'en/clases/femmology', lang: 'en', page: 'femmology' },
  { path: 'en/clases/sexy-style-barcelona', lang: 'en', page: 'sexyStyle' },
  { path: 'en/clases/modern-jazz-barcelona', lang: 'en', page: 'modernJazz' },
  { path: 'en/clases/ballet-barcelona', lang: 'en', page: 'ballet' },
  { path: 'en/clases-particulares-baile', lang: 'en', page: 'clasesParticulares' },
  { path: 'en/sobre-nosotros', lang: 'en', page: 'about' },
  { path: 'en/yunaisy-farray', lang: 'en', page: 'yunaisy' },
  { path: 'en/merchandising', lang: 'en', page: 'merchandising' },
  { path: 'en/regala-baile', lang: 'en', page: 'regalaBaile' },
  { path: 'en/instalaciones', lang: 'en', page: 'facilities' },
  { path: 'en/contacto', lang: 'en', page: 'contact' },

  { path: 'fr', lang: 'fr', page: 'home' },
  { path: 'fr/clases/baile-barcelona', lang: 'fr', page: 'classes' },
  { path: 'fr/clases/danza-barcelona', lang: 'fr', page: 'danza' },
  { path: 'fr/clases/salsa-bachata-barcelona', lang: 'fr', page: 'salsaBachata' },
  { path: 'fr/clases/salsa-cubana-barcelona', lang: 'fr', page: 'salsaCubana' },
  { path: 'fr/clases/salsa-lady-style-barcelona', lang: 'fr', page: 'salsaLadyStyle' },
  { path: 'fr/clases/folklore-cubano', lang: 'fr', page: 'folkloreCubano' },
  { path: 'fr/clases/danzas-urbanas-barcelona', lang: 'fr', page: 'danzasUrbanas' },
  { path: 'fr/clases/dancehall-barcelona', lang: 'fr', page: 'dancehall' },
  { path: 'fr/clases/twerk-barcelona', lang: 'fr', page: 'twerk' },
  { path: 'fr/clases/afrobeats-barcelona', lang: 'fr', page: 'afrobeat' },
  { path: 'fr/clases/hip-hop-reggaeton-barcelona', lang: 'fr', page: 'hipHopReggaeton' },
  { path: 'fr/clases/sexy-reggaeton-barcelona', lang: 'fr', page: 'sexyReggaeton' },
  { path: 'fr/clases/reggaeton-cubano-barcelona', lang: 'fr', page: 'reggaetonCubano' },
  { path: 'fr/clases/heels-barcelona', lang: 'fr', page: 'heelsBarcelona' },
  { path: 'fr/clases/femmology', lang: 'fr', page: 'femmology' },
  { path: 'fr/clases/sexy-style-barcelona', lang: 'fr', page: 'sexyStyle' },
  { path: 'fr/clases/modern-jazz-barcelona', lang: 'fr', page: 'modernJazz' },
  { path: 'fr/clases/ballet-barcelona', lang: 'fr', page: 'ballet' },
  { path: 'fr/clases-particulares-baile', lang: 'fr', page: 'clasesParticulares' },
  { path: 'fr/sobre-nosotros', lang: 'fr', page: 'about' },
  { path: 'fr/yunaisy-farray', lang: 'fr', page: 'yunaisy' },
  { path: 'fr/merchandising', lang: 'fr', page: 'merchandising' },
  { path: 'fr/regala-baile', lang: 'fr', page: 'regalaBaile' },
  { path: 'fr/instalaciones', lang: 'fr', page: 'facilities' },
  { path: 'fr/contacto', lang: 'fr', page: 'contact' },
];

// Metadata for each page in each language
const metadata = {
  es: {
    home: {
      title: 'FarRays Center - Escuela de Baile Urbano en Barcelona',
      description: 'Descubre las mejores clases de baile urbano en Barcelona. Dancehall y más. Profesores experimentados y ambiente inclusivo.',
    },
    classes: {
      title: 'Clases de Baile - FarRays Center Barcelona',
      description: 'Clases de Dancehall y baile urbano para todos los niveles. Horarios flexibles en Barcelona.',
    },
    danza: {
      title: 'Clases de Danza en Barcelona | Ballet, Contemporáneo y Jazz | Farray\'s Center',
      description: 'Descubre nuestras clases de danza en Barcelona: Ballet Clásico Cubano, Danza Contemporánea, Modern Jazz, Afro Jazz y más. Academia reconocida por CID-UNESCO. Prueba una clase gratis.',
    },
    salsaBachata: {
      title: 'Clases de Salsa y Bachata en Barcelona | Salsa Cubana, Bachata Sensual y más | Farray\'s Center',
      description: 'Aprende a bailar Salsa Cubana, Bachata Sensual y Dominicana, Timba, Son y más en Barcelona. Escuela fundada por maestros cubanos con experiencia en las mejores academias de La Habana. Reserva tu clase de prueba.',
    },
    salsaCubana: {
      title: 'Clases de Salsa Cubana en Barcelona | Casino, Rueda y Son | Farray\'s Center',
      description: 'Aprende Salsa Cubana auténtica en Barcelona con maestros cubanos. Clases de Casino, Rueda de Casino y Son Cubano. Método Farray® con técnica de La Habana. ¡Reserva tu clase de prueba!',
    },
    salsaLadyStyle: {
      title: 'Clases de Salsa Lady Style en Barcelona | Estilo Femenino y Elegancia | Farray\'s Center',
      description: 'Clases de Salsa Lady Style en Barcelona con Yunaisy Farray. Desarrolla tu feminidad, elegancia y estilo personal bailando salsa. Método Farray® reconocido por CID-UNESCO. ¡Reserva tu clase!',
    },
    folkloreCubano: {
      title: 'Clases de Folklore Cubano en Barcelona | Danzas a los Orishas | Farray\'s Center',
      description: 'Aprende Folklore Cubano auténtico en Barcelona. Danzas a los Orishas, Yoruba, Rumba y más. Maestros cubanos especializados. Entre Plaza España y Sants. ¡Prueba gratis!',
    },
    danzasUrbanas: {
      title: 'Clases de Danzas Urbanas en Barcelona | Hip Hop, Dancehall, K-Pop y Reggaeton | Farray\'s Center',
      description: 'Descubre nuestras clases de danzas urbanas en Barcelona: Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat y más. Academia de referencia en estilos urbanos. Prueba una clase gratis.',
    },
    dancehall: {
      title: 'Clases de Dancehall en Barcelona - Academia de Baile Urbano | FarRays Center',
      description: 'Aprende Dancehall auténtico en Barcelona con profesores expertos. Clases para todos los niveles. Descubre el ritmo de Jamaica.',
    },
    twerk: {
      title: 'Clases de Twerk en Barcelona | Farray\'s Center',
      description: 'Aprende Twerk y Perreo en Barcelona con Sandra Gómez. Clases de baile urbano para todos los niveles. ¡Libera tu energía y confianza!',
    },
    afrobeat: {
      title: 'Clases de Afrobeats y Afrodance en Barcelona | Farray\'s Center',
      description: 'Aprende Afrobeats y Afrodance en Barcelona con profesores nativos de África. Clases de Amapiano, Ntcham y danzas africanas modernas para todos los niveles.',
    },
    hipHopReggaeton: {
      title: 'Clases de Hip Hop Reggaeton en Barcelona | Farray\'s Center',
      description: 'Aprende Hip Hop Reggaeton en Barcelona con Charlie Breezy. Fusión única de hip-hop y reggaeton con mucho flow. Clases para todos los niveles cerca de Plaza España y Sants.',
    },
    sexyReggaeton: {
      title: 'Clases de Sexy Reggaeton en Barcelona | Farray\'s Center',
      description: 'Aprende Sexy Reggaeton en Barcelona con Yunaisy Farray. Perreo, body roll y sensualidad. Clases para todos los niveles cerca de Plaza España y Sants.',
    },
    reggaetonCubano: {
      title: 'Clases de Reggaeton Cubano en Barcelona | Reparto y Cubatón | Farray\'s Center',
      description: 'Aprende Reggaeton Cubano auténtico en Barcelona con Yunaisy Farray. Reparto, Cubatón, improvisación y disociación corporal. Clases para todos los niveles.',
    },
    heelsBarcelona: {
      title: 'Clases de Heels en Barcelona | Femmology y Sexy Style | Farray\'s Center',
      description: 'Aprende a bailar en tacones con elegancia y sensualidad en Barcelona. Clases de Femmology Heels y Sexy Style con Yunaisy Farray, reconocida por CID-UNESCO. Todos los niveles.',
    },
    femmology: {
      title: 'Clases de Femmology en Barcelona | Danza Terapéutica y Feminidad | Farray\'s Center',
      description: 'Descubre Femmology en Barcelona: danzaterapia con tacones creada por Yunaisy Farray. Conecta con tu feminidad, autoestima y sensualidad. Método Farray®. ¡Reserva tu clase!',
    },
    sexyStyle: {
      title: 'Clases de Sexy Style en Barcelona | Aprende a Bailar con Sensualidad | Farray\'s Center',
      description: 'Clases de Sexy Style en Barcelona con Yasmina Fernández. Aprende a expresarte con sensualidad, confianza y movimiento. Todos los niveles. ¡Reserva tu clase de prueba!',
    },
    modernJazz: {
      title: 'Clases de Modern Jazz en Barcelona | Técnica y Expresión con Alejandro Miñoso | Farray\'s Center',
      description: 'Clases de Modern Jazz en Barcelona con Alejandro Miñoso. Técnica, musicalidad y expresión corporal. Desde principiante hasta avanzado. ¡Reserva tu clase de prueba!',
    },
    ballet: {
      title: 'Clases de Ballet en Barcelona | Técnica Clásica y Elegancia | Farray\'s Center',
      description: 'Clases de ballet clásico en Barcelona para adultos. Aprende técnica, postura y elegancia con maestros formados en la ENA. Academia CID-UNESCO entre Plaza España y Sants.',
    },
    clasesParticulares: {
      title: 'Clases Particulares de Baile en Barcelona | Personalizado y a Tu Ritmo | Farray\'s Center',
      description: 'Clases particulares de baile en Barcelona 100% personalizadas. Profesor exclusivo para ti, horarios flexibles, todos los estilos. Aprende 3x más rápido que en clases grupales. Bonos disponibles.',
    },
    about: {
      title: 'Sobre Nosotros | Farray\'s International Dance Center Barcelona',
      description: 'Conoce nuestra historia, valores y equipo. Academia de baile en Barcelona fundada en 2017 con método propio y profesores internacionales.',
    },
    yunaisy: {
      title: 'Yunaisy Farray | Fundadora y Directora | Farray\'s Center',
      description: 'Conoce a Yunaisy Farray, bailarina profesional cubana y fundadora de Farray\'s International Dance Center. Más de 20 años de experiencia en danza.',
    },
    merchandising: {
      title: 'Merchandising | Camisetas, Sudaderas y Accesorios | Farray\'s Center',
      description: 'Compra merchandising oficial de Farray\'s Center: camisetas, sudaderas, bolsas y más. Lleva tu pasión por el baile contigo.',
    },
    regalaBaile: {
      title: 'Regala Baile | Tarjetas Regalo para Clases de Baile | Farray\'s Center',
      description: 'Regala clases de baile con nuestras tarjetas regalo. El regalo perfecto para amantes del baile. Válido para todas las clases y niveles.',
    },
    facilities: {
      title: 'Instalaciones | Salas de Baile Profesionales en Barcelona | Farray\'s Center',
      description: 'Descubre nuestras instalaciones: 3 salas de baile equipadas con espejos, barras, suelo profesional y vestuarios. Ubicación céntrica en Barcelona.',
    },
    contact: {
      title: 'Contacto | Farray\'s International Dance Center Barcelona',
      description: 'Contacta con nosotros. Carrer d\'Entença 100, Barcelona. Tel: +34 622 24 70 85. Reserva tu clase de prueba gratuita.',
    },
  },
  ca: {
    home: {
      title: 'FarRays Center - Escola de Ball Urbà a Barcelona',
      description: 'Descobreix les millors classes de ball urbà a Barcelona. Dancehall i més. Professors experimentats i ambient inclusiu.',
    },
    classes: {
      title: 'Classes de Ball - FarRays Center Barcelona',
      description: 'Classes de Dancehall i ball urbà per a tots els nivells. Horaris flexibles a Barcelona.',
    },
    danza: {
      title: 'Classes de Dansa a Barcelona | Ballet, Contemporani i Jazz | Farray\'s Center',
      description: 'Descobreix les nostres classes de dansa a Barcelona: Ballet Clàssic Cubà, Dansa Contemporània, Modern Jazz, Afro Jazz i més. Acadèmia reconeguda per CID-UNESCO. Prova una classe gratis.',
    },
    salsaBachata: {
      title: 'Classes de Salsa i Bachata a Barcelona | Salsa Cubana, Bachata Sensual i més | Farray\'s Center',
      description: 'Aprèn a ballar Salsa Cubana, Bachata Sensual i Dominicana, Timba, Son i més a Barcelona. Escola fundada per mestres cubans amb experiència en les millors acadèmies de L\'Havana. Reserva la teva classe de prova.',
    },
    salsaCubana: {
      title: 'Classes de Salsa Cubana a Barcelona | Casino, Rueda i Son | Farray\'s Center',
      description: 'Aprèn Salsa Cubana autèntica a Barcelona amb mestres cubans. Classes de Casino, Rueda de Casino i Son Cubà. Mètode Farray® amb tècnica de L\'Havana. Reserva la teva classe de prova!',
    },
    salsaLadyStyle: {
      title: 'Classes de Salsa Lady Style a Barcelona | Estil Femení i Elegància | Farray\'s Center',
      description: 'Classes de Salsa Lady Style a Barcelona amb Yunaisy Farray. Desenvolupa la teva feminitat, elegància i estil personal ballant salsa. Mètode Farray® reconegut per CID-UNESCO. Reserva la teva classe!',
    },
    folkloreCubano: {
      title: 'Classes de Folklore Cubà a Barcelona | Danses als Orixàs | Farray\'s Center',
      description: 'Aprèn Folklore Cubà autèntic a Barcelona. Danses als Orixàs, Yoruba, Rumba i més. Mestres cubans especialitzats. Entre Plaça Espanya i Sants. Prova gratuïta!',
    },
    danzasUrbanas: {
      title: 'Classes de Danses Urbanes a Barcelona | Hip Hop, Dancehall, K-Pop i Reggaeton | Farray\'s Center',
      description: 'Descobreix les nostres classes de danses urbanes a Barcelona: Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat i més. Acadèmia de referència en estils urbans. Prova una classe gratis.',
    },
    dancehall: {
      title: 'Classes de Dancehall a Barcelona - Acadèmia de Ball Urbà | FarRays Center',
      description: 'Aprèn Dancehall autèntic a Barcelona amb professors experts. Classes per a tots els nivells. Descobreix el ritme de Jamaica.',
    },
    twerk: {
      title: 'Classes de Twerk a Barcelona | Farray\'s Center',
      description: 'Aprèn Twerk i Perreo a Barcelona amb Sandra Gómez. Classes de ball urbà per a tots els nivells. Allibera la teva energia i confiança!',
    },
    afrobeat: {
      title: 'Classes d\'Afrobeats i Afrodance a Barcelona | Farray\'s Center',
      description: 'Aprèn Afrobeats i Afrodance a Barcelona amb professors natius d\'Àfrica. Classes d\'Amapiano, Ntcham i danses africanes modernes per a tots els nivells.',
    },
    hipHopReggaeton: {
      title: 'Classes de Hip Hop Reggaeton a Barcelona | Farray\'s Center',
      description: 'Aprèn Hip Hop Reggaeton a Barcelona amb Charlie Breezy. Fusió única de hip-hop i reggaeton amb molt de flow. Classes per a tots els nivells a prop de Plaça Espanya i Sants.',
    },
    sexyReggaeton: {
      title: 'Classes de Sexy Reggaeton a Barcelona | Farray\'s Center',
      description: 'Aprèn Sexy Reggaeton a Barcelona amb Yunaisy Farray. Perreo, body roll i sensualitat. Classes per a tots els nivells a prop de Plaça Espanya i Sants.',
    },
    reggaetonCubano: {
      title: 'Classes de Reggaeton Cubà a Barcelona | Reparto i Cubatón | Farray\'s Center',
      description: 'Aprèn Reggaeton Cubà autèntic a Barcelona amb Yunaisy Farray. Reparto, Cubatón, improvisació i disociació corporal. Classes per a tots els nivells.',
    },
    heelsBarcelona: {
      title: 'Classes de Heels a Barcelona | Femmology i Sexy Style | Farray\'s Center',
      description: 'Aprèn a ballar amb talons amb elegància i sensualitat a Barcelona. Classes de Femmology Heels i Sexy Style amb Yunaisy Farray, reconeguda per CID-UNESCO. Tots els nivells.',
    },
    femmology: {
      title: 'Classes de Femmology a Barcelona | Dansa Terapèutica i Feminitat | Farray\'s Center',
      description: 'Descobreix Femmology a Barcelona: dansateràpia amb talons creada per Yunaisy Farray. Connecta amb la teva feminitat, autoestima i sensualitat. Mètode Farray®. Reserva la teva classe!',
    },
    sexyStyle: {
      title: 'Classes de Sexy Style a Barcelona | Aprèn a Ballar amb Sensualitat | Farray\'s Center',
      description: 'Classes de Sexy Style a Barcelona amb Yasmina Fernández. Aprèn a expressar-te amb sensualitat, confiança i moviment. Tots els nivells. Reserva la teva classe de prova!',
    },
    modernJazz: {
      title: 'Classes de Modern Jazz a Barcelona | Tècnica i Expressió amb Alejandro Miñoso | Farray\'s Center',
      description: 'Classes de Modern Jazz a Barcelona amb Alejandro Miñoso. Tècnica, musicalitat i expressió corporal. Des de principiant fins a avançat. Reserva la teva classe de prova!',
    },
    ballet: {
      title: 'Classes de Ballet a Barcelona | Tècnica Clàssica i Elegància | Farray\'s Center',
      description: "Classes de ballet clàssic a Barcelona per a adults. Aprèn tècnica, postura i elegància amb mestres formats a l'ENA. Acadèmia CID-UNESCO entre Plaça Espanya i Sants.",
    },
    clasesParticulares: {
      title: 'Classes Particulars de Ball a Barcelona | Personalitzat i al Teu Ritme | Farray\'s Center',
      description: 'Classes particulars de ball a Barcelona 100% personalitzades. Professor exclusiu per a tu, horaris flexibles, tots els estils. Aprèn 3x més ràpid que en classes grupals. Bons disponibles.',
    },
    about: {
      title: 'Sobre Nosaltres | Farray\'s International Dance Center Barcelona',
      description: 'Coneix la nostra història, valors i equip. Acadèmia de ball a Barcelona fundada el 2017 amb mètode propi i professors internacionals.',
    },
    yunaisy: {
      title: 'Yunaisy Farray | Fundadora i Directora | Farray\'s Center',
      description: 'Coneix Yunaisy Farray, ballarina professional cubana i fundadora de Farray\'s International Dance Center. Més de 20 anys d\'experiència en dansa.',
    },
    merchandising: {
      title: 'Merchandising | Samarretes, Dessuadores i Accessoris | Farray\'s Center',
      description: 'Compra merchandising oficial de Farray\'s Center: samarretes, dessuadores, bosses i més. Porta la teva passió pel ball amb tu.',
    },
    regalaBaile: {
      title: 'Regala Ball | Targetes Regal per a Classes de Ball | Farray\'s Center',
      description: 'Regala classes de ball amb les nostres targetes regal. El regal perfecte per a amants del ball. Vàlid per a totes les classes i nivells.',
    },
    facilities: {
      title: 'Instal·lacions | Sales de Ball Professionals a Barcelona | Farray\'s Center',
      description: 'Descobreix les nostres instal·lacions: 3 sales de ball equipades amb miralls, barres, terra professional i vestidors. Ubicació cèntrica a Barcelona.',
    },
    contact: {
      title: 'Contacte | Farray\'s International Dance Center Barcelona',
      description: 'Contacta amb nosaltres. Carrer d\'Entença 100, Barcelona. Tel: +34 622 24 70 85. Reserva la teva classe de prova gratuïta.',
    },
  },
  en: {
    home: {
      title: 'FarRays Center - Urban Dance School in Barcelona',
      description: 'Discover the best urban dance classes in Barcelona. Dancehall and more. Experienced teachers and inclusive atmosphere.',
    },
    classes: {
      title: 'Dance Classes - FarRays Center Barcelona',
      description: 'Dancehall and urban dance classes for all levels. Flexible schedules in Barcelona.',
    },
    danza: {
      title: 'Dance Classes in Barcelona | Ballet, Contemporary & Jazz | Farray\'s Center',
      description: 'Discover our dance classes in Barcelona: Cuban Classical Ballet, Contemporary Dance, Modern Jazz, Afro Jazz and more. CID-UNESCO accredited academy. Try a free class.',
    },
    salsaBachata: {
      title: 'Salsa and Bachata Classes in Barcelona | Cuban Salsa, Sensual Bachata & more | Farray\'s Center',
      description: 'Learn to dance Cuban Salsa, Sensual and Dominican Bachata, Timba, Son and more in Barcelona. School founded by Cuban masters with experience in Havana\'s best academies. Book your trial class.',
    },
    salsaCubana: {
      title: 'Cuban Salsa Classes in Barcelona | Casino, Rueda & Son | Farray\'s Center',
      description: 'Learn authentic Cuban Salsa in Barcelona with Cuban masters. Casino, Rueda de Casino and Son Cubano classes. Farray Method® with Havana technique. Book your trial class!',
    },
    salsaLadyStyle: {
      title: 'Salsa Lady Style Classes in Barcelona | Feminine Style & Elegance | Farray\'s Center',
      description: 'Salsa Lady Style classes in Barcelona with Yunaisy Farray. Develop your femininity, elegance and personal style dancing salsa. Farray Method® recognized by CID-UNESCO. Book your class!',
    },
    folkloreCubano: {
      title: 'Cuban Folklore Classes in Barcelona | Dances to the Orishas | Farray\'s Center',
      description: 'Learn authentic Cuban Folklore in Barcelona. Dances to the Orishas, Yoruba, Rumba and more. Specialized Cuban masters. Between Plaza España and Sants. Free trial!',
    },
    danzasUrbanas: {
      title: 'Urban Dance Classes in Barcelona | Hip Hop, Dancehall, K-Pop & Reggaeton | Farray\'s Center',
      description: 'Discover our urban dance classes in Barcelona: Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat and more. Leading academy for urban styles. Try a free class.',
    },
    dancehall: {
      title: 'Dancehall Classes in Barcelona - Urban Dance Academy | FarRays Center',
      description: 'Learn authentic Dancehall in Barcelona with expert teachers. Classes for all levels. Discover the rhythm of Jamaica.',
    },
    twerk: {
      title: 'Twerk Classes in Barcelona | Farray\'s Center',
      description: 'Learn Twerk and Perreo in Barcelona with Sandra Gómez. Urban dance classes for all levels. Unleash your energy and confidence!',
    },
    afrobeat: {
      title: 'Afrobeats and Afrodance Classes in Barcelona | Farray\'s Center',
      description: 'Learn Afrobeats and Afrodance in Barcelona with native African instructors. Amapiano, Ntcham and modern African dance classes for all levels.',
    },
    hipHopReggaeton: {
      title: 'Hip Hop Reggaeton Classes in Barcelona | Farray\'s Center',
      description: 'Learn Hip Hop Reggaeton in Barcelona with Charlie Breezy. Unique fusion of hip-hop and reggaeton with lots of flow. Classes for all levels near Plaza España and Sants.',
    },
    sexyReggaeton: {
      title: 'Sexy Reggaeton Classes in Barcelona | Farray\'s Center',
      description: 'Learn Sexy Reggaeton in Barcelona with Yunaisy Farray. Perreo, body roll and sensuality. Classes for all levels near Plaza España and Sants.',
    },
    reggaetonCubano: {
      title: 'Cuban Reggaeton Classes in Barcelona | Reparto & Cubatón | Farray\'s Center',
      description: 'Learn authentic Cuban Reggaeton in Barcelona with Yunaisy Farray. Reparto, Cubatón, improvisation and body isolation. Classes for all levels.',
    },
    heelsBarcelona: {
      title: 'Heels Dance Classes in Barcelona | Femmology & Sexy Style | Farray\'s Center',
      description: 'Learn to dance in heels with elegance and sensuality in Barcelona. Femmology Heels and Sexy Style classes with Yunaisy Farray, CID-UNESCO recognized. All levels welcome.',
    },
    femmology: {
      title: 'Femmology Classes in Barcelona | Dance Therapy and Femininity | Farray\'s Center',
      description: 'Discover Femmology in Barcelona: dance therapy in heels created by Yunaisy Farray. Connect with your femininity, self-esteem and sensuality. Farray Method®. Book your class!',
    },
    sexyStyle: {
      title: 'Sexy Style Classes in Barcelona | Learn to Dance with Sensuality | Farray\'s Center',
      description: 'Sexy Style classes in Barcelona with Yasmina Fernández. Learn to express yourself with sensuality, confidence and movement. All levels. Book your trial class!',
    },
    modernJazz: {
      title: 'Modern Jazz Classes in Barcelona | Technique and Expression with Alejandro Miñoso | Farray\'s Center',
      description: 'Modern Jazz classes in Barcelona with Alejandro Miñoso. Technique, musicality and body expression. From beginner to advanced. Book your trial class!',
    },
    ballet: {
      title: 'Ballet Classes in Barcelona | Classical Technique and Elegance | Farray\'s Center',
      description: 'Classical ballet classes in Barcelona for adults. Learn technique, posture and elegance with ENA-trained masters. CID-UNESCO Academy between Plaza España and Sants.',
    },
    clasesParticulares: {
      title: 'Private Dance Classes in Barcelona | Personalized and At Your Pace | Farray\'s Center',
      description: 'Private dance classes in Barcelona with 100% dedicated teacher. Salsa, Bachata, Dancehall, Contemporary Dance. Personalized teaching, flexible schedules and guaranteed results. Reserve your class now!',
    },
    about: {
      title: 'About Us | Farray\'s International Dance Center Barcelona',
      description: 'Learn about our history, values and team. Dance academy in Barcelona founded in 2017 with our own method and international teachers.',
    },
    yunaisy: {
      title: 'Yunaisy Farray | Founder and Director | Farray\'s Center',
      description: 'Meet Yunaisy Farray, Cuban professional dancer and founder of Farray\'s International Dance Center. Over 20 years of experience in dance.',
    },
    merchandising: {
      title: 'Merchandising | T-Shirts, Hoodies and Accessories | Farray\'s Center',
      description: 'Buy official Farray\'s Center merchandise: t-shirts, hoodies, bags and more. Take your passion for dance with you.',
    },
    regalaBaile: {
      title: 'Gift Dance | Gift Cards for Dance Classes | Farray\'s Center',
      description: 'Gift dance classes with our gift cards. The perfect gift for dance lovers. Valid for all classes and levels.',
    },
    facilities: {
      title: 'Facilities | Professional Dance Studios in Barcelona | Farray\'s Center',
      description: 'Discover our facilities: 3 dance studios equipped with mirrors, bars, professional flooring and dressing rooms. Central location in Barcelona.',
    },
    contact: {
      title: 'Contact | Farray\'s International Dance Center Barcelona',
      description: 'Contact us. Carrer d\'Entença 100, Barcelona. Tel: +34 622 24 70 85. Book your free trial class.',
    },
  },
  fr: {
    home: {
      title: 'FarRays Center - École de Danse Urbaine à Barcelone',
      description: 'Découvrez les meilleurs cours de danse urbaine à Barcelone. Dancehall et plus. Professeurs expérimentés et ambiance inclusive.',
    },
    classes: {
      title: 'Cours de Danse - FarRays Center Barcelone',
      description: 'Cours de Dancehall et danse urbaine pour tous les niveaux. Horaires flexibles à Barcelone.',
    },
    danza: {
      title: 'Cours de Danse à Barcelone | Ballet, Contemporain et Jazz | Farray\'s Center',
      description: 'Découvrez nos cours de danse à Barcelone : Ballet Classique Cubain, Danse Contemporaine, Modern Jazz, Afro Jazz et plus. Académie accréditée par CID-UNESCO. Essayez un cours gratuit.',
    },
    salsaBachata: {
      title: 'Cours de Salsa et Bachata à Barcelone | Salsa Cubaine, Bachata Sensuelle et plus | Farray\'s Center',
      description: 'Apprenez à danser la Salsa Cubaine, la Bachata Sensuelle et Dominicaine, la Timba, le Son et plus à Barcelone. École fondée par des maîtres cubains avec expérience dans les meilleures académies de La Havane. Réservez votre cours d\'essai.',
    },
    salsaCubana: {
      title: 'Cours de Salsa Cubaine à Barcelone | Casino, Rueda et Son | Farray\'s Center',
      description: 'Apprenez la Salsa Cubaine authentique à Barcelone avec des maîtres cubains. Cours de Casino, Rueda de Casino et Son Cubain. Méthode Farray® avec technique de La Havane. Réservez votre cours d\'essai!',
    },
    salsaLadyStyle: {
      title: 'Cours de Salsa Lady Style à Barcelone | Style Féminin et Élégance | Farray\'s Center',
      description: 'Cours de Salsa Lady Style à Barcelone avec Yunaisy Farray. Développez votre féminité, élégance et style personnel en dansant la salsa. Méthode Farray® reconnue par CID-UNESCO. Réservez votre cours!',
    },
    folkloreCubano: {
      title: 'Cours de Folklore Cubain à Barcelone | Danses aux Orishas | Farray\'s Center',
      description: 'Apprenez le Folklore Cubain authentique à Barcelone. Danses aux Orishas, Yoruba, Rumba et plus. Maîtres cubains spécialisés. Entre Plaza España et Sants. Essai gratuit!',
    },
    danzasUrbanas: {
      title: 'Cours de Danses Urbaines à Barcelone | Hip Hop, Dancehall, K-Pop et Reggaeton | Farray\'s Center',
      description: 'Découvrez nos cours de danses urbaines à Barcelone : Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat et plus. Académie de référence pour les styles urbains. Essayez un cours gratuit.',
    },
    dancehall: {
      title: 'Cours de Dancehall à Barcelone - Académie de Danse Urbaine | FarRays Center',
      description: 'Apprenez le Dancehall authentique à Barcelone avec des professeurs experts. Cours pour tous les niveaux. Découvrez le rythme de la Jamaïque.',
    },
    twerk: {
      title: 'Cours de Twerk à Barcelone | Farray\'s Center',
      description: 'Apprenez le Twerk et le Perreo à Barcelone avec Sandra Gómez. Cours de danse urbaine pour tous les niveaux. Libérez votre énergie et votre confiance!',
    },
    afrobeat: {
      title: 'Cours d\'Afrobeats et Afrodance à Barcelone | Farray\'s Center',
      description: 'Apprenez l\'Afrobeats et l\'Afrodance à Barcelone avec des professeurs natifs d\'Afrique. Cours d\'Amapiano, Ntcham et danses africaines modernes pour tous les niveaux.',
    },
    hipHopReggaeton: {
      title: 'Cours de Hip Hop Reggaeton à Barcelone | Farray\'s Center',
      description: 'Apprenez le Hip Hop Reggaeton à Barcelone avec Charlie Breezy. Fusion unique de hip-hop et reggaeton avec beaucoup de flow. Cours pour tous les niveaux près de Plaza España et Sants.',
    },
    sexyReggaeton: {
      title: 'Cours de Sexy Reggaeton à Barcelone | Farray\'s Center',
      description: 'Apprenez le Sexy Reggaeton à Barcelone avec Yunaisy Farray. Perreo, body roll et sensualité. Cours pour tous les niveaux près de Plaza España et Sants.',
    },
    reggaetonCubano: {
      title: 'Cours de Reggaeton Cubain à Barcelone | Reparto et Cubatón | Farray\'s Center',
      description: 'Apprenez le Reggaeton Cubain authentique à Barcelone avec Yunaisy Farray. Reparto, Cubatón, improvisation et isolation corporelle. Cours pour tous les niveaux.',
    },
    heelsBarcelona: {
      title: 'Cours de Heels à Barcelone | Femmology et Sexy Style | Farray\'s Center',
      description: 'Apprends à danser en talons avec élégance et sensualité à Barcelone. Cours de Femmology Heels et Sexy Style avec Yunaisy Farray, reconnue par CID-UNESCO. Tous les niveaux.',
    },
    femmology: {
      title: 'Cours de Femmology à Barcelone | Danse-Thérapie et Féminité | Farray\'s Center',
      description: 'Découvrez Femmology à Barcelone: danse-thérapie en talons créée par Yunaisy Farray. Connectez avec votre féminité, estime de soi et sensualité. Méthode Farray®. Réservez votre cours!',
    },
    sexyStyle: {
      title: 'Cours de Sexy Style à Barcelone | Apprenez à Danser avec Sensualité | Farray\'s Center',
      description: 'Cours de Sexy Style à Barcelone avec Yasmina Fernández. Apprenez à vous exprimer avec sensualité, confiance et mouvement. Tous niveaux. Réservez votre cours d\'essai!',
    },
    modernJazz: {
      title: 'Cours de Modern Jazz à Barcelone | Technique et Expression avec Alejandro Miñoso | Farray\'s Center',
      description: 'Cours de Modern Jazz à Barcelone avec Alejandro Miñoso. Technique, musicalité et expression corporelle. Du débutant à l\'avancé. Réservez votre cours d\'essai!',
    },
    ballet: {
      title: 'Cours de Ballet à Barcelone | Technique Classique et Élégance | Farray\'s Center',
      description: "Cours de ballet classique à Barcelone pour adultes. Apprenez la technique, la posture et l'élégance avec des maîtres formés à l'ENA. Académie CID-UNESCO entre Plaza España et Sants.",
    },
    clasesParticulares: {
      title: 'Cours Particuliers de Danse à Barcelone | Personnalisé et à Votre Rythme | Farray\'s Center',
      description: 'Cours particuliers de danse à Barcelone avec professeur 100% dédié. Salsa, Bachata, Dancehall, Danse Contemporaine. Enseignement personnalisé, horaires flexibles et résultats garantis. Réservez votre cours maintenant!',
    },
    about: {
      title: 'À Propos | Farray\'s International Dance Center Barcelone',
      description: 'Découvrez notre histoire, valeurs et équipe. Académie de danse à Barcelone fondée en 2017 avec méthode propre et professeurs internationaux.',
    },
    yunaisy: {
      title: 'Yunaisy Farray | Fondatrice et Directrice | Farray\'s Center',
      description: 'Rencontrez Yunaisy Farray, danseuse professionnelle cubaine et fondatrice de Farray\'s International Dance Center. Plus de 20 ans d\'expérience en danse.',
    },
    merchandising: {
      title: 'Merchandising | T-Shirts, Sweats et Accessoires | Farray\'s Center',
      description: 'Achetez le merchandising officiel de Farray\'s Center : t-shirts, sweats, sacs et plus. Portez votre passion pour la danse avec vous.',
    },
    regalaBaile: {
      title: 'Offrez la Danse | Cartes Cadeaux pour Cours de Danse | Farray\'s Center',
      description: 'Offrez des cours de danse avec nos cartes cadeaux. Le cadeau parfait pour les amoureux de la danse. Valable pour tous les cours et niveaux.',
    },
    facilities: {
      title: 'Installations | Studios de Danse Professionnels à Barcelone | Farray\'s Center',
      description: 'Découvrez nos installations : 3 studios de danse équipés de miroirs, barres, sol professionnel et vestiaires. Emplacement central à Barcelone.',
    },
    contact: {
      title: 'Contact | Farray\'s International Dance Center Barcelone',
      description: 'Contactez-nous. Carrer d\'Entença 100, Barcelone. Tél: +34 622 24 70 85. Réservez votre cours d\'essai gratuit.',
    },
  },
};

// Basic prerendered content for each page (bots will see this)
const initialContent = {
  es: {
    home: `
      <header class="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
          <div class="text-2xl font-bold text-primary-accent holographic-text">FarRays Center</div>
          <nav class="hidden md:flex space-x-8 text-neutral/90 font-medium text-lg">
            <a href="/es" class="hover:text-primary-accent transition-colors">Inicio</a>
            <a href="/es/clases/baile-barcelona" class="hover:text-primary-accent transition-colors">Clases</a>
            <a href="/es/clases/dancehall-barcelona" class="hover:text-primary-accent transition-colors">Dancehall</a>
          </nav>
        </div>
      </header>
      <main id="main-content" class="relative z-0 pt-20 pb-32 px-6 sm:px-12 text-center">
        <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold text-neutral mb-6 holographic-text">
          FarRays Center
        </h1>
        <p class="text-xl sm:text-2xl text-neutral/80 max-w-3xl mx-auto mb-12">
          Escuela de baile urbano en Barcelona. Aprende Dancehall y más con los mejores profesores.
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a href="/es/clases/baile-barcelona" class="bg-primary-accent text-neutral px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-primary-dark transition-all">
            Ver Clases
          </a>
        </div>
      </main>
    `,
    classes: `
      <main id="main-content" class="relative z-0 pt-20 pb-32 px-6 sm:px-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-neutral mb-8 text-center holographic-text">
          Nuestras Clases
        </h1>
        <p class="text-lg text-neutral/80 max-w-3xl mx-auto mb-12 text-center">
          Clases de Dancehall y baile urbano para todos los niveles. Profesores experimentados y ambiente inclusivo.
        </p>
      </main>
    `,
    danza: `
      <main id="main-content" class="relative z-0 pt-20 pb-32 px-6 sm:px-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-neutral mb-8 text-center holographic-text">
          Clases de Danza en Barcelona
        </h1>
        <p class="text-lg text-neutral/80 max-w-3xl mx-auto mb-12 text-center">
          Explora la técnica, elegancia y expresión de la danza clásica y contemporánea. Ballet Clásico Cubano, Danza Contemporánea, Modern Jazz, Afro Jazz y más. Academia reconocida por CID-UNESCO.
        </p>
      </main>
    `,
    salsaBachata: `
      <main id="main-content" class="relative z-0 pt-20 pb-32 px-6 sm:px-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-neutral mb-8 text-center holographic-text">
          Clases de Salsa y Bachata en Barcelona
        </h1>
        <p class="text-lg text-neutral/80 max-w-3xl mx-auto mb-12 text-center">
          Descubre la pasión, el ritmo y la conexión del baile latino. Salsa Cubana, Bachata Sensual y Dominicana, Timba, Son Cubano y más. Profesores formados en La Habana.
        </p>
      </main>
    `,
    salsaCubana: `
      <main id="main-content" class="relative z-0 pt-20 pb-32 px-6 sm:px-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-neutral mb-8 text-center holographic-text">
          Clases de Salsa Cubana en Barcelona
        </h1>
        <p class="text-lg text-neutral/80 max-w-3xl mx-auto mb-12 text-center">
          Aprende Salsa Cubana auténtica con maestros cubanos. Casino, Rueda de Casino y Son Cubano. Técnica de La Habana con el Método Farray®.
        </p>
      </main>
    `,
    salsaLadyStyle: `
      <main id="main-content" class="relative z-0 pt-20 pb-32 px-6 sm:px-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-neutral mb-8 text-center holographic-text">
          Clases de Salsa Lady Style en Barcelona
        </h1>
        <p class="text-lg text-neutral/80 max-w-3xl mx-auto mb-12 text-center">
          Desarrolla tu feminidad, elegancia y estilo personal bailando salsa. Clases con Yunaisy Farray y el Método Farray® reconocido por CID-UNESCO.
        </p>
      </main>
    `,
    folkloreCubano: `
      <main id="main-content" class="relative z-0 pt-20 pb-32 px-6 sm:px-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-neutral mb-8 text-center holographic-text">
          Clases de Folklore Cubano en Barcelona
        </h1>
        <p class="text-lg text-neutral/80 max-w-3xl mx-auto mb-12 text-center">
          Aprende las danzas afrocubanas a los Orishas: Eleguá, Yemayá, Changó, Ochún. Raíces yoruba, congo y arará con maestros cubanos especializados.
        </p>
      </main>
    `,
    danzasUrbanas: `
      <main id="main-content" class="relative z-0 pt-20 pb-32 px-6 sm:px-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-neutral mb-8 text-center holographic-text">
          Clases de Danzas Urbanas en Barcelona
        </h1>
        <p class="text-lg text-neutral/80 max-w-3xl mx-auto mb-12 text-center">
          Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat y más. Aprende con profesores formados en Kingston, Seúl, Nueva York y La Habana.
        </p>
      </main>
    `,
    dancehall: `
      <main id="main-content" class="relative z-0 pt-20 pb-32 px-6 sm:px-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-neutral mb-8 text-center holographic-text">
          Clases de Dancehall en Barcelona
        </h1>
        <p class="text-lg text-neutral/80 max-w-3xl mx-auto mb-12 text-center">
          Descubre el auténtico Dancehall de Jamaica en Barcelona. Energía, cultura y ritmo en cada clase.
        </p>
      </main>
    `,
    clasesParticulares: `
      <main id="main-content" class="relative z-0 pt-20 pb-32 px-6 sm:px-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-neutral mb-8 text-center holographic-text">
          Clases Particulares de Baile en Barcelona
        </h1>
        <p class="text-lg text-neutral/80 max-w-3xl mx-auto mb-12 text-center">
          Aprende a tu ritmo con un profesor dedicado 100% a ti. Horarios flexibles, todos los estilos de baile, progreso 3x más rápido. Tu danza, tus reglas.
        </p>
      </main>
    `,
  },
  // Simplified content for other languages
  ca: {
    home: `<main id="main-content"><h1 class="holographic-text text-5xl font-extrabold">FarRays Center</h1><p class="text-xl">Escola de ball urbà a Barcelona. Aprèn Dancehall i més.</p></main>`,
    classes: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Les nostres Classes</h1><p>Classes de Dancehall i ball urbà per a tots els nivells.</p></main>`,
    danza: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Classes de Dansa a Barcelona</h1><p>Explora la tècnica, elegància i expressió de la dansa clàssica i contemporània. Ballet Clàssic Cubà, Dansa Contemporània, Modern Jazz i més. Acadèmia reconeguda per CID-UNESCO.</p></main>`,
    salsaBachata: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Classes de Salsa i Bachata a Barcelona</h1><p>Descobreix la passió, el ritme i la connexió del ball llatí. Salsa Cubana, Bachata Sensual i Dominicana, Timba, Son Cubà i més. Professors formats a L'Havana.</p></main>`,
    salsaCubana: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Classes de Salsa Cubana a Barcelona</h1><p>Aprèn Salsa Cubana autèntica amb mestres cubans. Casino, Rueda de Casino i Son Cubà. Tècnica de L'Havana amb el Mètode Farray®.</p></main>`,
    salsaLadyStyle: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Classes de Salsa Lady Style a Barcelona</h1><p>Desenvolupa la teva feminitat, elegància i estil personal ballant salsa. Classes amb Yunaisy Farray i el Mètode Farray® reconegut per CID-UNESCO.</p></main>`,
    folkloreCubano: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Classes de Folklore Cubà a Barcelona</h1><p>Aprèn les danses afrocubanes als Orixàs: Eleguá, Yemayá, Changó, Ochún. Arrels yoruba, congo i arará amb mestres cubans especialitzats.</p></main>`,
    danzasUrbanas: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Classes de Danses Urbanes a Barcelona</h1><p>Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat i més. Aprèn amb professors formats a Kingston, Seül, Nova York i L'Havana.</p></main>`,
    dancehall: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Classes de Dancehall a Barcelona</h1><p>Descobreix l'autèntic Dancehall de Jamaica a Barcelona. Energia, cultura i ritme a cada classe.</p></main>`,
    clasesParticulares: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Classes Particulars de Ball a Barcelona</h1><p>Aprèn al teu ritme amb un professor dedicat 100% a tu. Horaris flexibles, tots els estils de ball, progrés 3x més ràpid. La teva dansa, les teves regles.</p></main>`,
  },
  en: {
    home: `<main id="main-content"><h1 class="holographic-text text-5xl font-extrabold">FarRays Center</h1><p class="text-xl">Urban dance school in Barcelona. Learn Dancehall and more.</p></main>`,
    classes: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Our Classes</h1><p>Dancehall and urban dance classes for all levels.</p></main>`,
    danza: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Dance Classes in Barcelona</h1><p>Explore the technique, elegance and expression of classical and contemporary dance. Cuban Classical Ballet, Contemporary Dance, Modern Jazz and more. CID-UNESCO accredited academy.</p></main>`,
    salsaBachata: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Salsa and Bachata Classes in Barcelona</h1><p>Discover the passion, rhythm and connection of Latin dance. Cuban Salsa, Sensual and Dominican Bachata, Timba, Son and more. Teachers trained in Havana.</p></main>`,
    salsaCubana: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cuban Salsa Classes in Barcelona</h1><p>Learn authentic Cuban Salsa with Cuban masters. Casino, Rueda de Casino and Son Cubano. Havana technique with the Farray Method®.</p></main>`,
    salsaLadyStyle: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Salsa Lady Style Classes in Barcelona</h1><p>Develop your femininity, elegance and personal style dancing salsa. Classes with Yunaisy Farray and the Farray Method® recognized by CID-UNESCO.</p></main>`,
    folkloreCubano: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cuban Folklore Classes in Barcelona</h1><p>Learn Afro-Cuban dances to the Orishas: Eleguá, Yemayá, Changó, Ochún. Yoruba, Congo and Arará roots with specialized Cuban masters.</p></main>`,
    danzasUrbanas: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Urban Dance Classes in Barcelona</h1><p>Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat and more. Learn with teachers trained in Kingston, Seoul, New York and Havana.</p></main>`,
    dancehall: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Dancehall Classes in Barcelona</h1><p>Discover authentic Dancehall from Jamaica in Barcelona. Energy, culture and rhythm in every class.</p></main>`,
    clasesParticulares: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Private Dance Classes in Barcelona</h1><p>Learn at your pace with a teacher 100% dedicated to you. Flexible schedules, all dance styles, 3x faster progress. Your dance, your rules.</p></main>`,
  },
  fr: {
    home: `<main id="main-content"><h1 class="holographic-text text-5xl font-extrabold">FarRays Center</h1><p class="text-xl">École de danse urbaine à Barcelone. Apprenez le Dancehall et plus.</p></main>`,
    classes: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Nos Cours</h1><p>Cours de Dancehall et danse urbaine pour tous les niveaux.</p></main>`,
    danza: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cours de Danse à Barcelone</h1><p>Explorez la technique, l'élégance et l'expression de la danse classique et contemporaine. Ballet Classique Cubain, Danse Contemporaine, Modern Jazz et plus. Académie accréditée par CID-UNESCO.</p></main>`,
    salsaBachata: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cours de Salsa et Bachata à Barcelone</h1><p>Découvrez la passion, le rythme et la connexion de la danse latine. Salsa Cubaine, Bachata Sensuelle et Dominicaine, Timba, Son et plus. Professeurs formés à La Havane.</p></main>`,
    salsaCubana: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cours de Salsa Cubaine à Barcelone</h1><p>Apprenez la Salsa Cubaine authentique avec des maîtres cubains. Casino, Rueda de Casino et Son Cubain. Technique de La Havane avec la Méthode Farray®.</p></main>`,
    salsaLadyStyle: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cours de Salsa Lady Style à Barcelone</h1><p>Développez votre féminité, élégance et style personnel en dansant la salsa. Cours avec Yunaisy Farray et la Méthode Farray® reconnue par CID-UNESCO.</p></main>`,
    folkloreCubano: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cours de Folklore Cubain à Barcelone</h1><p>Apprenez les danses afro-cubaines aux Orishas: Eleguá, Yemayá, Changó, Ochún. Racines yoruba, congo et arará avec des maîtres cubains spécialisés.</p></main>`,
    danzasUrbanas: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cours de Danses Urbaines à Barcelone</h1><p>Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat et plus. Apprenez avec des professeurs formés à Kingston, Séoul, New York et La Havane.</p></main>`,
    dancehall: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cours de Dancehall à Barcelone</h1><p>Découvrez le véritable Dancehall de Jamaïque à Barcelone. Énergie, culture et rythme à chaque cours.</p></main>`,
    clasesParticulares: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cours Particuliers de Danse à Barcelone</h1><p>Apprenez à votre rythme avec un professeur 100% dédié à vous. Horaires flexibles, tous les styles de danse, progrès 3x plus rapide. Votre danse, vos règles.</p></main>`,
  },
};

console.log('🚀 Starting prerendering process...\n');

// Read base HTML
const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('❌ Error: dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// Find critical asset files for preloading
const assetsPath = path.join(distPath, 'assets');
const assetFiles = fs.readdirSync(assetsPath);

// Find the main chunks that should be preloaded
const criticalChunks = {
  index: assetFiles.find(f => f.startsWith('index-') && f.endsWith('.js')),
  reactVendor: assetFiles.find(f => f.startsWith('react-vendor-') && f.endsWith('.js')),
  routerVendor: assetFiles.find(f => f.startsWith('router-vendor-') && f.endsWith('.js')),
  mainCss: assetFiles.find(f => f.startsWith('style-') && f.endsWith('.css')),
  // Locale-specific i18n chunks (named i18n-{locale}-*.js by vite.config.ts)
  es: assetFiles.find(f => f.startsWith('i18n-es-') && f.endsWith('.js')),
  ca: assetFiles.find(f => f.startsWith('i18n-ca-') && f.endsWith('.js')),
  en: assetFiles.find(f => f.startsWith('i18n-en-') && f.endsWith('.js')),
  fr: assetFiles.find(f => f.startsWith('i18n-fr-') && f.endsWith('.js')),
};

// Generate preload hints for critical assets (common to all pages)
const commonPreloadHints = [];
if (criticalChunks.index) {
  commonPreloadHints.push(`<link rel="modulepreload" href="/assets/${criticalChunks.index}" />`);
}
if (criticalChunks.reactVendor) {
  commonPreloadHints.push(`<link rel="modulepreload" href="/assets/${criticalChunks.reactVendor}" />`);
}
if (criticalChunks.routerVendor) {
  commonPreloadHints.push(`<link rel="modulepreload" href="/assets/${criticalChunks.routerVendor}" />`);
}
if (criticalChunks.mainCss) {
  commonPreloadHints.push(`<link rel="preload" href="/assets/${criticalChunks.mainCss}" as="style" />`);
}

console.log(`📦 Found critical chunks:`);
console.log(`   - Main bundle: ${criticalChunks.index || 'not found'}`);
console.log(`   - React vendor: ${criticalChunks.reactVendor || 'not found'}`);
console.log(`   - Router vendor: ${criticalChunks.routerVendor || 'not found'}`);
console.log(`   - Main CSS: ${criticalChunks.mainCss || 'not found'}`);
console.log(`   - i18n chunks: es=${criticalChunks.es ? '✓' : '✗'}, ca=${criticalChunks.ca ? '✓' : '✗'}, en=${criticalChunks.en ? '✓' : '✗'}, fr=${criticalChunks.fr ? '✓' : '✗'}\n`);

let generatedCount = 0;

routes.forEach(route => {
  const { path: routePath, lang, page } = route;

  // Get metadata and content
  const meta = metadata[lang][page];
  const content = initialContent[lang][page];

  // Build preload hints for this specific page (common + locale-specific i18n)
  const pagePreloadHints = [...commonPreloadHints];
  if (criticalChunks[lang]) {
    pagePreloadHints.push(`<link rel="modulepreload" href="/assets/${criticalChunks[lang]}" />`);
  }
  
  const preloadHintsHtml = pagePreloadHints.length > 0 
    ? `\n    <!-- Preload critical chunks for faster LCP -->\n    ${pagePreloadHints.join('\n    ')}\n`
    : '';

  // Generate hreflang alternates
  let pagePath = '';
  if (page === 'home') {
    pagePath = '';
  } else if (page === 'classes') {
    pagePath = 'clases/baile-barcelona';
  } else if (page === 'danza') {
    pagePath = 'clases/danza-barcelona';
  } else if (page === 'salsaBachata') {
    pagePath = 'clases/salsa-bachata-barcelona';
  } else if (page === 'salsaCubana') {
    pagePath = 'clases/salsa-cubana-barcelona';
  } else if (page === 'salsaLadyStyle') {
    pagePath = 'clases/salsa-lady-style-barcelona';
  } else if (page === 'folkloreCubano') {
    pagePath = 'clases/folklore-cubano';
  } else if (page === 'danzasUrbanas') {
    pagePath = 'clases/danzas-urbanas-barcelona';
  } else if (page === 'dancehall') {
    pagePath = 'clases/dancehall-barcelona';
  } else if (page === 'twerk') {
    pagePath = 'clases/twerk-barcelona';
  } else if (page === 'heelsBarcelona') {
    pagePath = 'clases/heels-barcelona';
  } else if (page === 'modernJazz') {
    pagePath = 'clases/modern-jazz-barcelona';
  } else if (page === 'clasesParticulares') {
    pagePath = 'clases-particulares-baile';
  }

  const hreflangLinks = [
    `<link rel="alternate" hreflang="es" href="https://www.farrayscenter.com/es${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="ca" href="https://www.farrayscenter.com/ca${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="en" href="https://www.farrayscenter.com/en${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="fr" href="https://www.farrayscenter.com/fr${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="x-default" href="https://www.farrayscenter.com/es${pagePath ? `/${pagePath}` : ''}" />`,
  ].join('\n    ');

  const currentUrl = `https://www.farrayscenter.com/${routePath}`;

  // Locale persistence script - runs before React mounts
  const localeScript = `
    <script>
      // Set locale before React hydration
      (function() {
        const locale = '${lang}';
        localStorage.setItem('fidc_preferred_locale', locale);
        const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = 'fidc_locale=' + locale + '; expires=' + expires + '; path=/; SameSite=Lax';
        document.documentElement.lang = locale;
      })();
    </script>
  `;

  // Create prerendered HTML
  let html = baseHtml;

  // Update lang attribute
  html = html.replace(/<html([^>]*)lang="[^"]*"/, `<html$1lang="${lang}"`);
  html = html.replace(/<html(?![^>]*lang=)/, `<html lang="${lang}"`);

  // Remove existing SEO meta tags to prevent duplicates
  // Remove title tags (after the first one from charset/viewport section)
  html = html.replace(/<title>.*?<\/title>/g, '');
  // Remove description meta tags
  html = html.replace(/<meta\s+name="description"[^>]*>/gi, '');
  // Remove canonical links
  html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, '');
  // Remove hreflang links
  html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>/gi, '');
  // Remove Open Graph tags
  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '');
  // Remove Twitter Card tags
  html = html.replace(/<meta\s+(?:name|property)="twitter:[^"]*"[^>]*>/gi, '');

  // Inject metadata in <head>
  html = html.replace('</head>', `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <link rel="canonical" href="${currentUrl}" />
    ${hreflangLinks}

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${currentUrl}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="https://www.farrayscenter.com/images/og-${page}.jpg" />
    <meta property="og:locale" content="${lang}_ES" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${currentUrl}" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="https://www.farrayscenter.com/images/og-${page}.jpg" />
${preloadHintsHtml}
    ${localeScript}
  </head>`);

  // Inject prerendered content in <div id="root">
  // Use data-prerendered to mark for hydration compatibility
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root" data-prerendered="true"></div><!--${content}-->`
  );

  // Determine file path
  const filePath = routePath === ''
    ? path.join(distPath, 'index.html')
    : path.join(distPath, routePath, 'index.html');

  // Create directory if it doesn't exist
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // NOTE: Non-blocking CSS pattern removed - CSP hashes don't work for inline event handlers (onload)
  // Critical CSS is already inline, so render-blocking impact is minimal

  // Save file
  fs.writeFileSync(filePath, html);
  generatedCount++;

  console.log(`✅ Generated: /${routePath || '(root)'} [${lang}] → ${filePath}`);
});

console.log(`\n🎉 Prerendering complete! Generated ${generatedCount} pages.`);
console.log('\n📊 Summary:');
console.log(`   - Total pages: ${generatedCount}`);
console.log(`   - Languages: es, ca, en, fr (4)`);
console.log(`   - Pages per language: home, baile-barcelona, danza-barcelona, salsa-bachata-barcelona, danzas-urbanas-barcelona, dancehall-barcelona, twerk-barcelona, clases-particulares-baile (8)`);
console.log(`   - SEO: ✅ Metadata, ✅ hreflang, ✅ Canonical, ✅ Open Graph`);
console.log(`   - Locale: ✅ Pre-set via localStorage + cookie before React hydration`);
console.log('\n🔍 Verify: Run "npm run preview" and view page source to see prerendered content\n');
