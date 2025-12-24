/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';

const TermsConditionsPage: React.FC = () => {
  const { locale, t } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const lastUpdated = '24/12/2025';

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('terms_breadcrumb_current'),
        item: `${baseUrl}/${locale}/terminos-y-condiciones`,
      },
    ],
  };

  const breadcrumbItems = [
    { name: t('home'), url: `/${locale}` },
    {
      name: t('terms_breadcrumb_current'),
      url: `/${locale}/terminos-y-condiciones`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('terms_page_title')}</title>
        <meta name="description" content={t('terms_page_description')} />
        <link rel="canonical" href={`${baseUrl}/${locale}/terminos-y-condiciones`} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-black pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-black via-primary-dark/10 to-black">
          <div className="container mx-auto px-6">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/70" />

            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-neutral mb-4">
                  {t('terms_hero_title')}
                </h1>
                <p className="text-lg text-neutral/70">
                  {t('terms_last_updated')}: {lastUpdated}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Legal Content Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-neutral/90 leading-relaxed prose prose-invert max-w-none">
                {/* Section 1 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    1. IDENTIFICACIÓN Y "QUIÉN ES QUIÉN"
                  </h2>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    1.1. Titular del sitio web y prestador de servicios de la sociedad de la
                    información
                  </h3>
                  <div className="bg-dark-surface/50 rounded-lg p-4 mb-4 border border-neutral/10">
                    <p className="text-neutral/80 mb-2">
                      <strong className="text-light-text">Farray's Dance & Fitness, S.L.</strong>{' '}
                      (en adelante, la "SL")
                    </p>
                    <ul className="text-neutral/70 space-y-1 list-none pl-0">
                      <li>
                        <strong>NIF:</strong> B67004812
                      </li>
                      <li>
                        <strong>Domicilio:</strong> C/ Entença 100, bajos 2, 08015 Barcelona
                        (España)
                      </li>
                      <li>
                        <strong>Email:</strong>{' '}
                        <a
                          href="mailto:info@farrayscenter.com"
                          className="text-primary-accent hover:underline"
                        >
                          info@farrayscenter.com
                        </a>
                      </li>
                      <li>
                        <strong>Teléfono:</strong> (+34) 622 247 085
                      </li>
                    </ul>
                  </div>
                  <p className="text-neutral/70">
                    La SL es titular del Sitio Web y facilita la información exigida para la
                    contratación online y la identificación del titular conforme a la normativa
                    aplicable (LSSI).
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    1.2. Prestador de actividades deportivas para socios (entidad distinta)
                  </h3>
                  <div className="bg-dark-surface/50 rounded-lg p-4 mb-4 border border-neutral/10">
                    <p className="text-neutral/80 mb-2">
                      <strong className="text-light-text">Club Esportiu Farray Barcelona</strong>{' '}
                      (en adelante, el "Club")
                    </p>
                    <ul className="text-neutral/70 space-y-1 list-none pl-0">
                      <li>
                        <strong>NIF:</strong> G67317701
                      </li>
                      <li>
                        <strong>Registro:</strong> Registre d'Entitats Esportives nº 18821
                      </li>
                      <li>
                        <strong>Domicilio:</strong> C/ Entença 100, 08015 Barcelona (España)
                      </li>
                      <li>
                        <strong>Email:</strong>{' '}
                        <a
                          href="mailto:info@farrayscenter.com"
                          className="text-primary-accent hover:underline"
                        >
                          info@farrayscenter.com
                        </a>
                      </li>
                    </ul>
                  </div>
                  <p className="text-neutral/70">
                    El Club es una entidad distinta a la SL y es el prestador de las actividades
                    deportivas de baile para personas socias, gestionadas mediante la plataforma del
                    Club (por ejemplo, Momence) y sujetas a los textos aceptados en el proceso de
                    compra/reserva (incluyendo anexos).
                  </p>
                  <p className="text-neutral/70 mt-2">
                    El Club dispone de seguro de responsabilidad civil para la actividad deportiva
                    desarrollada en sus instalaciones.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    1.3. Relación SL–Club (marketing/soporte)
                  </h3>
                  <p className="text-neutral/70">
                    La SL presta al Club servicios de marketing y soporte digital (incluida gestión
                    del Sitio Web y comunicación). Esto no altera quién es la parte contratante en
                    cada compra: se identifica siempre en el checkout o en la plataforma
                    correspondiente.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    1.4. Regla de oro: cómo saber con quién contratas
                  </h3>
                  <p className="text-neutral/70">
                    En cada producto/servicio y durante el proceso de compra se indicará
                    "Vendido/Prestado por". La entidad indicada ahí será la parte contratante y
                    responsable de la prestación.
                  </p>
                </section>

                {/* Section 2 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    2. OBJETO Y ÁMBITO DE APLICACIÓN
                  </h2>
                  <p className="text-neutral/70 mb-4">
                    Estas Condiciones regulan la contratación de:
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    A) PRODUCTOS Y SERVICIOS PRESTADOS POR LA SL
                  </h3>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      Merchandising (productos físicos) pagado/reservado online y recogido en las
                      instalaciones.
                    </li>
                    <li>
                      Servicios (por ejemplo: sesiones privadas de baile, servicios para empresas,
                      bodas, teambuilding, despedidas de soltero/a y servicios similares).
                    </li>
                    <li>Packs regalo canjeables por servicios prestados por la SL.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    B) ACTIVIDADES DEPORTIVAS PRESTADAS POR EL CLUB (SOLO SOCIOS)
                  </h3>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>Membresías del Club.</li>
                    <li>Paquetes de actividades (créditos).</li>
                    <li>Reservas/participación en actividades del Club.</li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    3. ACEPTACIÓN, CAPACIDAD Y VERACIDAD DE DATOS
                  </h2>
                  <p className="text-neutral/70 mb-4">La contratación implica que el usuario:</p>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>Ha leído y comprende estas Condiciones.</li>
                    <li>
                      Tiene capacidad legal para contratar (mayor de 18 años o con autorización de
                      representante legal).
                    </li>
                    <li>Garantiza la veracidad de los datos aportados.</li>
                  </ul>
                  <p className="text-neutral/70 mt-4">
                    Si contratas o reservas para un/a menor, declaras ser madre/padre/tutor/a legal
                    o contar con autorización suficiente.
                  </p>
                </section>

                {/* Section 4 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    4. IDIOMA, CONFIRMACIÓN Y SOPORTE DURADERO
                  </h2>
                  <p className="text-neutral/70">
                    El procedimiento se realiza en castellano. La confirmación de compra/reserva se
                    facilita en soporte duradero (por ejemplo, email/confirmación de plataforma). El
                    usuario puede solicitar la documentación en catalán.
                  </p>
                </section>

                {/* Section 5 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    5. PRECIOS, IMPUESTOS Y FACTURACIÓN
                  </h2>
                  <p className="text-neutral/70 mb-4">
                    Los precios se expresan en euros (€) e incluyen impuestos aplicables salvo
                    indicación expresa.
                  </p>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      <strong>Compras SL (merch/servicios):</strong> la factura/justificante la
                      emite la SL.
                    </li>
                    <li>
                      <strong>Contratación Club (actividades):</strong> el justificante/recibo lo
                      emite el Club o la plataforma del Club, según corresponda.
                    </li>
                  </ul>
                </section>

                {/* Section 6 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    6. MEDIOS DE PAGO
                  </h2>
                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">6.1. SL</h3>
                  <p className="text-neutral/70">
                    Los medios disponibles se muestran en el checkout (p. ej. tarjeta/Stripe, PayPal
                    u otros).
                  </p>
                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">6.2. Club</h3>
                  <p className="text-neutral/70">
                    Los medios se muestran en la plataforma del Club (p. ej. tarjeta y/o
                    domiciliación bancaria).
                  </p>
                </section>

                {/* PARTE I */}
                <div className="my-12 py-6 border-y border-primary-accent/50 text-center">
                  <h2 className="text-2xl font-display font-bold text-primary-accent">
                    PARTE I — CONDICIONES DE LA SL (MERCH + SERVICIOS)
                  </h2>
                </div>

                {/* Section 7 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    7. MERCHANDISING (PRODUCTOS FÍSICOS) — SL
                  </h2>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    7.1. Modalidad: compra/reserva online con recogida obligatoria en instalaciones
                  </h3>
                  <p className="text-neutral/70">
                    El merchandising puede pagarse o reservarse online, pero la entrega se realiza
                    exclusivamente mediante recogida en las instalaciones indicadas por la SL
                    (actualmente: C/ Entença 100, bajos 2, 08015 Barcelona), dentro del horario de
                    atención vigente.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    7.2. Recogida: identificación y entrega
                  </h3>
                  <p className="text-neutral/70 mb-2">
                    Para retirar el pedido, el usuario (o un tercero autorizado por el usuario)
                    deberá presentar:
                  </p>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>confirmación de pedido (email/justificante), y</li>
                    <li>documento acreditativo (si fuera necesario para verificar titularidad).</li>
                  </ul>
                  <p className="text-neutral/70 mt-2">
                    La posesión del producto (y, en su caso, el inicio del cómputo del plazo de
                    desistimiento cuando proceda) se entiende producida cuando el usuario o el
                    tercero autorizado toma posesión física del bien. La mera "puesta a disposición"
                    para recoger no inicia el cómputo del plazo.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    7.3. Plazo de recogida
                  </h3>
                  <p className="text-neutral/70 mb-2">
                    El pedido deberá recogerse en un plazo máximo de 30 días naturales desde la
                    notificación de "pedido listo para recoger", salvo que se indique un plazo
                    distinto en la ficha del producto o en la confirmación.
                  </p>
                  <p className="text-neutral/70">
                    Si transcurrido ese plazo el pedido no ha sido recogido, la SL podrá:
                  </p>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>contactar al usuario para acordar una recogida, y/o</li>
                    <li>
                      cancelar el pedido y reembolsar el importe pagado por el mismo medio de pago,
                      salvo que exista una causa legítima comunicada previamente (por ejemplo,
                      personalización a medida cuando aplique).
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    7.4. Derecho de desistimiento (merchandising comprado online)
                  </h3>
                  <p className="text-neutral/70 mb-2">
                    En contratos a distancia de bienes, el consumidor dispone con carácter general
                    de 14 días naturales para desistir sin necesidad de justificación.
                  </p>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      <strong>Inicio del plazo:</strong> desde que el consumidor (o un tercero por
                      él indicado) adquiere la posesión material del bien (en este caso, desde la
                      recogida efectiva).
                    </li>
                    <li>
                      <strong>Para ejercerlo:</strong> email a{' '}
                      <a
                        href="mailto:info@farrayscenter.com"
                        className="text-primary-accent hover:underline"
                      >
                        info@farrayscenter.com
                      </a>{' '}
                      con asunto "Desistimiento Merchandising", indicando nombre, email de compra,
                      nº pedido y producto.
                    </li>
                    <li>
                      <strong>Devolución:</strong> el producto debe devolverse en buen estado. La
                      devolución podrá hacerse presencialmente en las instalaciones o mediante envío
                      a cargo del usuario (salvo defecto o error imputable a la SL).
                    </li>
                    <li>
                      <strong>Reembolso:</strong> se realizará sin demora indebida y dentro de los
                      plazos legales; la SL podrá retener el reembolso hasta recibir el producto o
                      prueba de devolución.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    7.5. Compras presenciales (merchandising)
                  </h3>
                  <p className="text-neutral/70">
                    En compras presenciales no existe un derecho general de desistimiento por cambio
                    de opinión, sin perjuicio de garantía legal o de una política comercial expresa
                    de cambios/devoluciones.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    7.6. Garantía legal (merchandising)
                  </h3>
                  <p className="text-neutral/70">
                    Los productos tienen una garantía legal de 3 años desde la entrega conforme al
                    art. 120 del Texto Refundido de la Ley General para la Defensa de los
                    Consumidores y Usuarios (TRLGDCU).
                  </p>
                </section>

                {/* Section 8 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    8. SERVICIOS PRESTADOS POR LA SL
                  </h2>
                  <p className="text-neutral/70 mb-4 italic">
                    (p. ej.: sesiones privadas de baile, servicios para empresas, bodas,
                    teambuilding, despedidas, etc.)
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    8.1. Pago por adelantado
                  </h3>
                  <p className="text-neutral/70">
                    Para confirmar una reserva, el usuario deberá abonar por adelantado el importe
                    total del servicio (o el depósito indicado en la ficha/presupuesto). El pago
                    bloquea agenda, recursos y disponibilidad.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    8.2. Servicios con fecha o periodo específico (sin desistimiento en online)
                  </h3>
                  <p className="text-neutral/70">
                    Cuando el servicio contratado esté fijado para una fecha o un periodo de
                    ejecución específicos (por ejemplo: boda, evento de empresa, teambuilding,
                    despedida, sesión reservada con fecha), no resulta aplicable el derecho de
                    desistimiento en contratación online por la excepción legal prevista.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    8.3. Reprogramación (cambio de fecha) — con 7 días naturales de antelación
                  </h3>
                  <p className="text-neutral/70 mb-2">
                    El usuario podrá solicitar reprogramación cumpliendo todas estas condiciones:
                  </p>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      Solicitud por escrito (email o canal indicado) con al menos 7 días naturales
                      de antelación respecto a la fecha/hora reservada.
                    </li>
                    <li>Sujeto a disponibilidad.</li>
                    <li>
                      Máximo 1 reprogramación por reserva/servicio, salvo autorización expresa.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    8.4. Cancelación tardía y no-show
                  </h3>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      <strong>No-show:</strong> si el usuario no se presenta, el servicio se
                      considerará consumido y no procederá devolución.
                    </li>
                    <li>
                      <strong>Cancelación con menos de 7 días naturales:</strong> se considerará
                      cancelación tardía y no procederá devolución, por tratarse de servicios con
                      agenda y recursos reservados.
                    </li>
                  </ul>
                  <p className="text-neutral/70 mt-2">
                    Lo anterior se entiende sin perjuicio de los derechos irrenunciables que
                    pudieran corresponder conforme a la normativa aplicable.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    8.5. Fuerza mayor
                  </h3>
                  <p className="text-neutral/70">
                    En casos de fuerza mayor debidamente acreditados (pandemias, desastres
                    naturales, huelgas generales, actos de terrorismo, o cualquier circunstancia
                    imprevisible e inevitable), la SL podrá ofrecer una alternativa (p. ej.
                    reprogramación), sin que ello constituya obligación general ni derecho adquirido
                    para futuras reservas.
                  </p>
                </section>

                {/* Section 9 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    9. PACKS REGALO DE LA SL (CANJEABLES POR SERVICIOS)
                  </h2>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    9.1. Definición
                  </h3>
                  <p className="text-neutral/70">
                    Un "Pack regalo" es un bono/vale prepago canjeable por servicios de la SL.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    9.2. Caducidad
                  </h3>
                  <p className="text-neutral/70">
                    La caducidad y condiciones de canje se informan en el momento de la compra. Una
                    vez caducado, el pack no genera derecho a reembolso salvo obligación legal.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    9.3. Desistimiento (packs regalo comprados online)
                  </h3>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      Con carácter general, si el pack regalo se compra online, puede ejercerse
                      desistimiento en 14 días si el pack no ha sido canjeado y no se ha reservado
                      una fecha/periodo específico.
                    </li>
                    <li>
                      Si ya se ha canjeado total o parcialmente o se ha reservado fecha/periodo
                      específico, aplicará la excepción de servicios de esparcimiento con
                      fecha/periodo o la política comunicada antes del pago (y, si procede, el
                      criterio proporcional por lo ya prestado).
                    </li>
                  </ul>
                </section>

                {/* PARTE II */}
                <div className="my-12 py-6 border-y border-primary-accent/50 text-center">
                  <h2 className="text-2xl font-display font-bold text-primary-accent">
                    PARTE II — CONDICIONES DEL CLUB (ACTIVIDADES DEPORTIVAS PARA SOCIOS)
                  </h2>
                </div>

                {/* Section 10 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    10. PRINCIPIOS CLAVE (RESUMEN WEB)
                  </h2>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    10.1. Exclusividad para socios activos
                  </h3>
                  <p className="text-neutral/70">
                    Las actividades deportivas del Club son exclusivas para personas socias/usuarias
                    activas y al día de pago.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    10.2. Reservas, cancelaciones y créditos
                  </h3>
                  <p className="text-neutral/70 mb-2">
                    La gestión se realiza en la plataforma del Club (por ejemplo, Momence). Antes de
                    comprar/reservar, el usuario acepta:
                  </p>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>Condiciones de Membresía (si aplica)</li>
                    <li>Condiciones de Paquetes (créditos) (Anexo 1)</li>
                    <li>Aceptación para reserva/participación (Anexo 2)</li>
                    <li>Política de cancelaciones y uso de créditos</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    10.3. Domiciliación/adeudos y devoluciones bancarias (SEPA) — efecto práctico
                  </h3>
                  <p className="text-neutral/70 mb-2">
                    La normativa bancaria puede permitir la devolución de adeudos domiciliados en
                    determinados supuestos y plazos (por ejemplo, 8 semanas en escenarios
                    previstos).
                  </p>
                  <p className="text-neutral/70">
                    La devolución bancaria no extingue por sí sola obligaciones de pago si el
                    periodo era debido y/o hubo disfrute de acceso/servicio. En caso de
                    impago/devolución, el Club podrá suspender acceso/reservas hasta regularización
                    y repercutir costes bancarios/gestión razonables en los términos aceptados en el
                    alta.
                  </p>
                </section>

                {/* PARTE III */}
                <div className="my-12 py-6 border-y border-primary-accent/50 text-center">
                  <h2 className="text-2xl font-display font-bold text-primary-accent">
                    PARTE III — DESISTIMIENTO (REGLA GENERAL + EXCEPCIONES) Y COMPRAS PRESENCIALES
                  </h2>
                </div>

                {/* Section 11 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    11. DERECHO DE DESISTIMIENTO (RESUMEN LEGAL)
                  </h2>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    11.1. Regla general (solo contratos a distancia o fuera de establecimiento)
                  </h3>
                  <p className="text-neutral/70 mb-2">
                    En contratos a distancia o fuera de establecimiento existe, con carácter
                    general, un plazo mínimo de 14 días naturales para desistir sin justificación.
                  </p>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      <strong>Bienes:</strong> desde que el consumidor (o tercero indicado) adquiere
                      la posesión material del bien.
                    </li>
                    <li>
                      <strong>Servicios:</strong> desde la celebración del contrato.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    11.2. Excepciones (cuando NO existe desistimiento, aunque sea online)
                  </h3>
                  <p className="text-neutral/70 mb-2">
                    No aplica el desistimiento en supuestos legales, especialmente relevantes aquí:
                  </p>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      Servicios relacionados con actividades de esparcimiento cuando el contrato
                      prevea una fecha o un periodo de ejecución específicos (por ejemplo, bodas,
                      eventos, teambuilding, despedidas, sesiones en fecha reservada).
                    </li>
                    <li>
                      Servicios completamente ejecutados con consentimiento expreso de inicio
                      durante el plazo y conocimiento de pérdida del derecho, cumpliendo requisitos
                      legales.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    11.3. Compras presenciales
                  </h3>
                  <p className="text-neutral/70">
                    En compras presenciales no hay derecho general de desistimiento por cambio de
                    opinión (salvo garantía legal o política comercial expresa).
                  </p>
                </section>

                {/* PARTE IV */}
                <div className="my-12 py-6 border-y border-primary-accent/50 text-center">
                  <h2 className="text-2xl font-display font-bold text-primary-accent">
                    PARTE IV — ATENCIÓN, RECLAMACIONES, DATOS Y JURISDICCIÓN
                  </h2>
                </div>

                {/* Section 12 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    12. ATENCIÓN AL CLIENTE / CONTACTO
                  </h2>
                  <div className="bg-dark-surface/50 rounded-lg p-4 border border-neutral/10">
                    <ul className="text-neutral/70 space-y-2 list-none pl-0">
                      <li>
                        <strong>Email:</strong>{' '}
                        <a
                          href="mailto:info@farrayscenter.com"
                          className="text-primary-accent hover:underline"
                        >
                          info@farrayscenter.com
                        </a>
                      </li>
                      <li>
                        <strong>Teléfono:</strong> (+34) 622 247 085
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Section 13 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    13. RECLAMACIONES
                  </h2>
                  <p className="text-neutral/70 mb-2">
                    El usuario puede presentar una reclamación por email. Asimismo, puede acudir a
                    los organismos de consumo competentes y solicitar hojas oficiales de reclamación
                    conforme a la normativa aplicable (Decret 121/2013 de la Generalitat de
                    Catalunya).
                  </p>
                  <p className="text-neutral/70">
                    El usuario puede acudir a la Junta Arbitral de Consum de Catalunya como
                    mecanismo extrajudicial de resolución de conflictos.
                  </p>
                </section>

                {/* Section 14 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    14. RESOLUCIÓN DE LITIGIOS ONLINE (ODR) — AVISO
                  </h2>
                  <p className="text-neutral/70">
                    La Plataforma Europea de Resolución de Litigios en Línea (ODR) fue discontinuada
                    a partir del 20 de julio de 2025.
                  </p>
                </section>

                {/* Section 15 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    15. PROTECCIÓN DE DATOS
                  </h2>
                  <p className="text-neutral/70 mb-2">
                    El tratamiento de datos se rige por la Política de Privacidad del sitio:
                  </p>
                  <p className="mb-2">
                    <a
                      href={`/${locale}/politica-de-privacidad`}
                      className="text-primary-accent hover:underline"
                    >
                      {t('terms_section15_link')}
                    </a>
                  </p>
                  <p className="text-neutral/70">
                    Cuando se utilicen plataformas externas (p. ej. Momence), aplicarán también sus
                    políticas.
                  </p>
                </section>

                {/* Section 16 */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    16. LEY APLICABLE Y JURISDICCIÓN
                  </h2>
                  <p className="text-neutral/70 mb-2">
                    Estas Condiciones se rigen por la legislación española. En el ámbito de
                    Cataluña, será de aplicación supletoria el Codi de Consum de Catalunya (Llei
                    22/2010).
                  </p>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      Si el usuario actúa como consumidor, serán competentes los tribunales que
                      establezca la normativa aplicable en materia de consumidores.
                    </li>
                    <li>
                      Si actúa como empresa/profesional, las partes se someten a los juzgados y
                      tribunales de Barcelona, salvo norma imperativa.
                    </li>
                  </ul>
                </section>

                {/* Section 17 - Modificaciones */}
                <section className="mb-12">
                  <h2 className="text-2xl font-display font-semibold text-light-text mb-6 pb-2 border-b border-primary-accent/30">
                    17. MODIFICACIÓN DE ESTAS CONDICIONES
                  </h2>
                  <p className="text-neutral/70">
                    La SL y el Club se reservan el derecho de modificar estas condiciones,
                    notificando al usuario mediante publicación en el sitio web y, cuando proceda,
                    por email con antelación razonable. La continuidad de uso del sitio o de los
                    servicios tras la entrada en vigor de las modificaciones implica aceptación de
                    las mismas.
                  </p>
                </section>

                {/* ANEXO 1 */}
                <div className="my-12 py-6 border-y border-secondary-accent/50 text-center bg-dark-surface/30 rounded-lg">
                  <h2 className="text-xl font-display font-bold text-secondary-accent">
                    ANEXO 1 — ACEPTACIÓN DE CONDICIONES ESPECÍFICAS DE PAQUETES (CRÉDITOS)
                  </h2>
                  <p className="text-neutral/60 text-sm mt-2">CLUB ESPORTIU FARRAY BARCELONA</p>
                </div>

                <section className="mb-12">
                  <p className="text-neutral/70 mb-4 italic">
                    Al comprar un Paquete de actividades del Club, declaro haber leído y acepto lo
                    siguiente:
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    1) Definiciones
                  </h3>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      <strong>"Paquete":</strong> paquete prepago que otorga un número de créditos
                      para reservar y participar en actividades del Club.
                    </li>
                    <li>
                      <strong>"Crédito":</strong> unidad de reserva/participación asociada a la
                      duración indicada (1 h o 1,5 h, según el Paquete).
                    </li>
                    <li>
                      <strong>"Momence":</strong> plataforma de reservas y gestión utilizada por el
                      Club.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    2) Caducidad
                  </h3>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>Paquetes de 10 créditos (1 h o 1,5 h): caducidad 6 meses.</li>
                    <li>Paquetes de 20 créditos (1 h o 1,5 h): caducidad 12 meses.</li>
                  </ul>
                  <p className="text-neutral/70 mt-2">
                    La caducidad empieza a contar desde la fecha de compra (salvo que se indique
                    expresamente otra regla en el momento de compra). Una vez caducado el Paquete,
                    los créditos no utilizados se pierden y no generan derecho a reembolso.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    3) Carácter personal e intransferible
                  </h3>
                  <p className="text-neutral/70">
                    Los Paquetes son personales e intransferibles, no reembolsables y no canjeables
                    por dinero.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    4) Reserva obligatoria y disponibilidad
                  </h3>
                  <p className="text-neutral/70">
                    La participación está sujeta a reserva previa en Momence y a la disponibilidad
                    de plazas/aforo.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    5) Cancelaciones y consumo de créditos
                  </h3>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      Para recuperar el crédito, debo cancelar la reserva con al menos 2 horas de
                      antelación.
                    </li>
                    <li>
                      Si cancelo fuera de plazo o no asisto ("no-show"), el crédito se considera
                      consumido.
                    </li>
                    <li>
                      Si el Club cancela la actividad, el crédito se devolverá automáticamente o se
                      ofrecerá alternativa razonable.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    6) Condición de persona socia y acceso a instalaciones
                  </h3>
                  <p className="text-neutral/70 mb-2">
                    El acceso a instalaciones y la participación en actividades están vinculados a
                    mantener la condición de persona socia/usuaria en vigor y al cumplimiento de la
                    normativa del Club.
                  </p>
                  <p className="text-neutral/70">
                    Si mi condición de persona socia/usuaria finaliza, entiendo que perderé el
                    derecho de acceso a instalaciones. Los créditos de Paquete podrán quedar en
                    pausa hasta reactivar mi condición, siempre dentro de su caducidad.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    7) Salud y responsabilidad
                  </h3>
                  <p className="text-neutral/70">
                    Reconozco que la participación implica actividad física y asumo los riesgos
                    inherentes. Esta aceptación no limita los derechos irrenunciables que me
                    reconoce la ley ni excluye la responsabilidad del Club en los supuestos
                    legalmente exigibles.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    8) Uso correcto y normativa
                  </h3>
                  <p className="text-neutral/70">
                    Me comprometo a respetar las normas de uso de instalaciones, conducta y
                    seguridad. El incumplimiento podrá conllevar suspensión de reservas/acceso según
                    normativa.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    9) Atención y consultas
                  </h3>
                  <p className="text-neutral/70">
                    Para dudas administrativas o incidencias:{' '}
                    <a
                      href="mailto:info@farrayscenter.com"
                      className="text-primary-accent hover:underline"
                    >
                      info@farrayscenter.com
                    </a>
                  </p>
                </section>

                {/* ANEXO 2 */}
                <div className="my-12 py-6 border-y border-secondary-accent/50 text-center bg-dark-surface/30 rounded-lg">
                  <h2 className="text-xl font-display font-bold text-secondary-accent">
                    ANEXO 2 — ACEPTACIÓN PARA RESERVA Y PARTICIPACIÓN EN ACTIVIDADES (CLUB)
                  </h2>
                  <p className="text-neutral/60 text-sm mt-2">
                    CLUB ESPORTIU FARRAY BARCELONA – NIF G67317701 – Registre 18821
                  </p>
                </div>

                <section className="mb-12">
                  <p className="text-neutral/70 mb-4 italic">
                    Al reservar y/o participar en una actividad del Club, declaro y acepto:
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    1) Salud y aptitud
                  </h3>
                  <p className="text-neutral/70">
                    Estoy en condiciones físicas adecuadas para participar y, en caso de duda,
                    consultaré con un profesional sanitario. Me comprometo a informar al Club de
                    cualquier limitación relevante que pueda afectar a mi seguridad.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    2) Asunción de riesgos
                  </h3>
                  <p className="text-neutral/70">
                    Entiendo que la actividad física conlleva riesgos (lesiones, caídas, etc.) y
                    acepto participar de forma voluntaria asumiendo los riesgos inherentes. Esta
                    aceptación no limita los derechos irrenunciables que me reconoce la ley ni
                    excluye la responsabilidad del Club cuando legalmente proceda.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    3) Normas de instalaciones y conducta
                  </h3>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      Respetaré las normas de uso (calzado adecuado, higiene, seguridad, silencio de
                      móviles, etc.).
                    </li>
                    <li>Está prohibida la grabación de audio/vídeo sin autorización del Club.</li>
                    <li>
                      El Club podrá suspender la participación por motivos de seguridad, convivencia
                      o incumplimiento de normas.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    4) Reservas y cancelaciones (resumen)
                  </h3>
                  <ul className="text-neutral/70 list-disc pl-6 space-y-2">
                    <li>
                      Debo cancelar con al menos 2 horas de antelación para recuperar el crédito.
                    </li>
                    <li>Cancelación tardía o no asistencia: el crédito se considera consumido.</li>
                    <li>
                      Si el Club cancela una actividad, se devolverá el crédito o se ofrecerá
                      alternativa razonable.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    5) Protección de datos
                  </h3>
                  <p className="text-neutral/70 mb-2">
                    He leído y acepto la Política de Privacidad del Club y entiendo que la gestión
                    se realiza mediante Momence:
                  </p>
                  <a
                    href="https://momence.com/privacy-policy/"
                    className="text-primary-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://momence.com/privacy-policy/
                  </a>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">6) Menores</h3>
                  <p className="text-neutral/70">
                    Si reservo para un/a menor, declaro ser su madre/padre/tutor/a legal o contar
                    con autorización suficiente, y acepto estas condiciones en su nombre.
                  </p>

                  <h3 className="text-xl font-semibold text-light-text/90 mt-6 mb-3">
                    7) Emergencias
                  </h3>
                  <p className="text-neutral/70">
                    Autorizo a que, en caso de urgencia, el Club pueda contactar con el teléfono de
                    emergencia que conste en mi ficha (si lo facilito) o activar servicios de
                    emergencia si fuera necesario.
                  </p>
                </section>
              </div>

              {/* Back to top */}
              <div className="text-center mt-12 pt-8 border-t border-neutral/10">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-primary-accent hover:text-primary-accent/80 transition-colors text-sm"
                >
                  {t('terms_back_to_top')}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TermsConditionsPage;
