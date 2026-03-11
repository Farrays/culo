-- ==============================================================================
-- CRM DE LEADS - FARRAY'S CENTER
-- ==============================================================================
-- Migración 002: Sistema de leads, interacciones y nurturing automatizado
-- Soporta omnicanal: WhatsApp, Instagram, Voz, Web
-- Cumple RGPD/LOPDGDD: consentimientos explícitos, trazabilidad
--
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
-- 2. Abre: SQL Editor (icono de terminal)
-- 3. Pega este script completo
-- 4. Pulsa "Run" (Ctrl+Enter)
--
-- NOTA: Requiere que 001_fichajes_init.sql ya esté ejecutada
-- (usa la función update_updated_at_column() creada allí)
-- ==============================================================================

-- ============================================================================
-- TABLA: LEADS
-- ============================================================================
-- Perfil unificado de cada lead (potencial alumno)
-- Un lead = un teléfono único (E.164), puede venir de múltiples canales
-- Se crea automáticamente cuando alguien escribe por WhatsApp/IG/Web

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identificación (phone es la clave natural, E.164: 34612345678)
    phone VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200),
    email VARCHAR(255),

    -- Origen y canal
    source VARCHAR(50),          -- 'meta_ads', 'organic', 'referral', 'website', 'walk_in'
    source_id VARCHAR(100),      -- ID de campaña Meta, UTM, etc.
    channel VARCHAR(20) NOT NULL DEFAULT 'whatsapp'
        CHECK (channel IN ('whatsapp', 'instagram', 'web', 'voice', 'manual')),

    -- Lead scoring (persistencia del LeadScorer)
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    tier VARCHAR(10) DEFAULT 'cold'
        CHECK (tier IN ('hot', 'warm', 'cold')),
    signals TEXT[] DEFAULT '{}',  -- Array de señales activas: {'asked_price', 'mentioned_booking', ...}

    -- Estado del lead en el pipeline
    status VARCHAR(30) DEFAULT 'new'
        CHECK (status IN (
            'new',              -- Acaba de contactar
            'engaged',          -- Ha respondido / interactuado
            'qualified',        -- Ha dado datos (email, nombre)
            'booked',           -- Ha reservado clase de prueba
            'attended',         -- Asistió a la clase
            'converted',        -- Se hizo miembro / compró bono
            'lost',             -- No convirtió (nurturing agotado)
            'dormant'           -- Inactivo >30 días
        )),

    -- Preferencias de baile
    dance_styles TEXT[] DEFAULT '{}',  -- {'salsa', 'bachata', 'hip-hop'}
    level VARCHAR(20),                 -- 'principiante', 'basico', 'intermedio', 'avanzado'
    preferred_schedule VARCHAR(100),   -- 'tardes', 'mañanas', 'fines de semana'

    -- Datos de contacto enriquecidos
    language VARCHAR(5) DEFAULT 'es',  -- Idioma detectado: es, ca, en, fr

    -- Seguimiento
    first_contact TIMESTAMPTZ DEFAULT NOW(),
    last_contact TIMESTAMPTZ DEFAULT NOW(),
    next_followup TIMESTAMPTZ,         -- Próximo contacto programado (cron nurturing)
    followup_count INTEGER DEFAULT 0,  -- Veces que se le ha hecho follow-up
    assigned_to VARCHAR(100),          -- 'laura' (bot) o nombre de persona

    -- Consentimientos (RGPD / Ley Atención Cliente 2025)
    consent_marketing BOOLEAN DEFAULT false,  -- Puede recibir plantillas marketing WhatsApp
    consent_calls BOOLEAN DEFAULT false,      -- Puede recibir llamadas automáticas
    consent_date TIMESTAMPTZ,                 -- Fecha del consentimiento
    consent_renewed TIMESTAMPTZ,              -- Última renovación (obligatorio cada 2 años)

    -- Atribución Meta Ads
    meta_fbclid VARCHAR(255),
    meta_fbc VARCHAR(255),
    meta_fbp VARCHAR(255),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(200),
    utm_term VARCHAR(200),
    utm_content VARCHAR(200),

    -- Momence (enriquecimiento)
    momence_member_id INTEGER,
    membership_status VARCHAR(20) DEFAULT 'none'
        CHECK (membership_status IN ('none', 'active', 'expired', 'frozen', 'unknown')),
    membership_name VARCHAR(200),

    -- Tags libres para segmentación manual
    tags TEXT[] DEFAULT '{}',

    -- Notas del equipo
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries frecuentes del dashboard
-- (phone ya tiene índice implícito por UNIQUE constraint)
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_tier ON leads(tier);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_channel ON leads(channel);
CREATE INDEX IF NOT EXISTS idx_leads_next_followup ON leads(next_followup)
    WHERE next_followup IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_last_contact ON leads(last_contact DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);

-- Trigger para updated_at (reutiliza función de 001)
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: LEAD_INTERACTIONS
-- ============================================================================
-- Historial de CADA interacción con un lead, en cualquier canal
-- Permite construir timeline cross-canal en el dashboard

CREATE TABLE IF NOT EXISTS lead_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

    -- Canal y dirección
    channel VARCHAR(20) NOT NULL
        CHECK (channel IN ('whatsapp', 'instagram', 'voice', 'web', 'email', 'manual')),
    direction VARCHAR(10) NOT NULL
        CHECK (direction IN ('inbound', 'outbound')),

    -- Tipo de interacción
    type VARCHAR(30) NOT NULL
        CHECK (type IN (
            'message',          -- Mensaje de texto (WA, IG, email)
            'voice_note',       -- Nota de voz WhatsApp
            'image',            -- Imagen enviada/recibida
            'call',             -- Llamada de voz (AI o humana)
            'booking',          -- Reserva creada
            'booking_cancel',   -- Reserva cancelada
            'booking_reschedule', -- Reserva reprogramada
            'checkin',          -- Check-in a clase
            'payment',          -- Pago realizado
            'escalation',       -- Escalación a humano
            'nurture_step',     -- Paso automático de secuencia
            'note'              -- Nota interna del equipo
        )),

    -- Contenido
    content TEXT,               -- Texto del mensaje, transcripción de llamada, etc.
    content_summary TEXT,       -- Resumen corto para timeline (generado por AI)
    metadata JSONB DEFAULT '{}', -- Datos extra: {className, eventId, duration_seconds, sentiment, ...}

    -- AI
    ai_model VARCHAR(50),       -- 'haiku', 'sonnet', null (si es humano)
    sentiment VARCHAR(20),      -- 'positive', 'neutral', 'negative', 'angry'
    intent VARCHAR(50),         -- 'booking_intent', 'price_inquiry', 'objection', ...

    -- Duración (para llamadas)
    duration_seconds INTEGER,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries del timeline y analytics
-- (lead_id cubierto como prefijo del índice compuesto lead_created)
CREATE INDEX IF NOT EXISTS idx_interactions_lead_created ON lead_interactions(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_channel ON lead_interactions(channel);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON lead_interactions(type);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON lead_interactions(created_at DESC);

-- ============================================================================
-- TABLA: NURTURE_SEQUENCES
-- ============================================================================
-- Definición de cadencias de seguimiento automático
-- Config-driven como las landing pages: se define la estructura, el cron la ejecuta

CREATE TABLE IF NOT EXISTS nurture_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identificación
    name VARCHAR(200) NOT NULL,
    description TEXT,

    -- Cuándo se activa esta secuencia
    trigger_type VARCHAR(30) NOT NULL
        CHECK (trigger_type IN (
            'new_lead',         -- Lead nuevo (primer contacto)
            'post_trial',       -- Después de clase de prueba
            'no_show',          -- No asistió a clase
            'abandoned',        -- Empezó booking pero no completó
            'dormant',          -- Lead inactivo X días
            'manual'            -- Activada manualmente desde dashboard
        )),
    trigger_conditions JSONB DEFAULT '{}',  -- Condiciones extra: {min_score: 40, channel: 'whatsapp', ...}

    -- Pasos de la secuencia (array ordenado)
    -- Cada paso: {delay_hours, channel, action, template_name, content_key, ...}
    steps JSONB NOT NULL DEFAULT '[]',

    -- Estado
    active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,  -- Mayor = se ejecuta primero si hay conflicto

    -- Métricas
    total_enrolled INTEGER DEFAULT 0,
    total_completed INTEGER DEFAULT 0,
    total_converted INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sequences_active ON nurture_sequences(active)
    WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_sequences_trigger ON nurture_sequences(trigger_type);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_nurture_sequences_updated_at ON nurture_sequences;
CREATE TRIGGER update_nurture_sequences_updated_at
    BEFORE UPDATE ON nurture_sequences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: NURTURE_EXECUTIONS
-- ============================================================================
-- Log de ejecución: qué paso se ejecutó para qué lead, cuándo, y resultado

CREATE TABLE IF NOT EXISTS nurture_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    sequence_id UUID NOT NULL REFERENCES nurture_sequences(id) ON DELETE CASCADE,

    -- Progreso
    step_index INTEGER NOT NULL DEFAULT 0,  -- Paso actual (0-based)
    total_steps INTEGER NOT NULL,

    -- Estado de la ejecución completa
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN (
            'active',           -- En progreso, esperando próximo paso
            'completed',        -- Todos los pasos ejecutados
            'converted',        -- Lead convirtió antes de completar
            'paused',           -- Pausada manualmente
            'cancelled',        -- Cancelada (lead respondió, pidió parar, etc.)
            'failed'            -- Error en ejecución
        )),

    -- Scheduling
    scheduled_at TIMESTAMPTZ,   -- Cuándo se ejecutará el próximo paso
    last_executed_at TIMESTAMPTZ,

    -- Resultado del último paso
    last_step_result JSONB DEFAULT '{}',  -- {delivered: true, opened: true, replied: false, ...}

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Un lead solo puede tener UNA ejecución activa por secuencia
-- (pero puede tener múltiples completed/cancelled del mismo sequence)
CREATE UNIQUE INDEX IF NOT EXISTS idx_executions_one_active_per_sequence
    ON nurture_executions(lead_id, sequence_id)
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_executions_lead_id ON nurture_executions(lead_id);
CREATE INDEX IF NOT EXISTS idx_executions_sequence_id ON nurture_executions(sequence_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON nurture_executions(status);
CREATE INDEX IF NOT EXISTS idx_executions_scheduled ON nurture_executions(scheduled_at)
    WHERE status = 'active' AND scheduled_at IS NOT NULL;
-- (idx_executions_one_active_per_sequence ya cubre queries por lead_id WHERE status='active')

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_nurture_executions_updated_at ON nurture_executions;
CREATE TRIGGER update_nurture_executions_updated_at
    BEFORE UPDATE ON nurture_executions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurture_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurture_executions ENABLE ROW LEVEL SECURITY;

-- Service role (backend) - acceso total
-- DROP + CREATE para idempotencia (CREATE POLICY no tiene IF NOT EXISTS)
DO $$ BEGIN
    DROP POLICY IF EXISTS "Service role full access leads" ON leads;
    DROP POLICY IF EXISTS "Service role full access interactions" ON lead_interactions;
    DROP POLICY IF EXISTS "Service role full access sequences" ON nurture_sequences;
    DROP POLICY IF EXISTS "Service role full access executions" ON nurture_executions;
END $$;

CREATE POLICY "Service role full access leads" ON leads
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access interactions" ON lead_interactions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access sequences" ON nurture_sequences
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access executions" ON nurture_executions
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- SECUENCIAS DE NURTURING POR DEFECTO
-- ============================================================================
-- Cadencia para leads nuevos que contactan por WhatsApp (basada en investigación)

-- Insertar solo si la tabla está vacía (idempotente para re-ejecución)
INSERT INTO nurture_sequences (name, description, trigger_type, trigger_conditions, steps, active)
SELECT * FROM (VALUES
(
    'Bienvenida Lead WhatsApp'::varchar(200),
    'Secuencia automática para leads que contactan por primera vez via WhatsApp. Cadencia de 14 días con follow-ups por WhatsApp y voz.'::text,
    'new_lead'::varchar(30),
    '{"channel": "whatsapp", "min_score": 0}'::jsonb,
    '[
        {"step": 0, "delay_hours": 1, "channel": "whatsapp", "action": "send_template", "template_name": "followup_info_clase", "description": "Enviar info de clase + link de reserva prueba"},
        {"step": 1, "delay_hours": 48, "channel": "whatsapp", "action": "send_template", "template_name": "recordatorio_prueba", "description": "Recordatorio clase de prueba gratuita + testimonio"},
        {"step": 2, "delay_hours": 72, "channel": "voice", "action": "ai_call", "description": "Llamada AI de seguimiento si no respondió"},
        {"step": 3, "delay_hours": 120, "channel": "whatsapp", "action": "send_template", "template_name": "video_testimonio", "description": "Video testimonio + oferta limitada"},
        {"step": 4, "delay_hours": 168, "channel": "voice", "action": "ai_call", "description": "Segunda llamada AI + manejo de objeciones"},
        {"step": 5, "delay_hours": 240, "channel": "whatsapp", "action": "send_template", "template_name": "ultimo_followup", "description": "Último follow-up con urgencia real"},
        {"step": 6, "delay_hours": 336, "channel": "whatsapp", "action": "send_template", "template_name": "nurture_largo", "description": "Nurturing largo plazo - contenido de valor"}
    ]'::jsonb,
    false
),
(
    'Recuperación No-Show',
    'Secuencia para leads que reservaron pero no asistieron. Más corta y directa.',
    'no_show',
    '{}'::jsonb,
    '[
        {"step": 0, "delay_hours": 2, "channel": "whatsapp", "action": "send_template", "template_name": "no_show_reschedule", "description": "Mensaje empático + link para reprogramar"},
        {"step": 1, "delay_hours": 48, "channel": "voice", "action": "ai_call", "description": "Llamada AI para entender por qué no vino"},
        {"step": 2, "delay_hours": 120, "channel": "whatsapp", "action": "send_template", "template_name": "segunda_oportunidad", "description": "Segunda oportunidad con fecha concreta"}
    ]'::jsonb,
    false
),
(
    'Post Clase de Prueba',
    'Secuencia para leads que asistieron a la prueba pero aún no se inscribieron.',
    'post_trial',
    '{}'::jsonb,
    '[
        {"step": 0, "delay_hours": 2, "channel": "whatsapp", "action": "send_template", "template_name": "feedback_post_clase", "description": "Pedir feedback + ofrecer inscripción con descuento"},
        {"step": 1, "delay_hours": 48, "channel": "whatsapp", "action": "send_template", "template_name": "oferta_inscripcion", "description": "Oferta especial de inscripción (plazas limitadas)"},
        {"step": 2, "delay_hours": 96, "channel": "voice", "action": "ai_call", "description": "Llamada AI para resolver dudas y cerrar"},
        {"step": 3, "delay_hours": 168, "channel": "whatsapp", "action": "send_template", "template_name": "ultima_oferta", "description": "Última oferta antes de pasar a nurturing largo"}
    ]'::jsonb,
    false
)
) AS v(name, description, trigger_type, trigger_conditions, steps, active)
WHERE NOT EXISTS (SELECT 1 FROM nurture_sequences LIMIT 1);

-- ============================================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================

COMMENT ON TABLE leads IS 'Perfil unificado de leads (potenciales alumnos) - omnicanal';
COMMENT ON TABLE lead_interactions IS 'Historial de interacciones cross-canal con cada lead';
COMMENT ON TABLE nurture_sequences IS 'Definición de cadencias de seguimiento automático';
COMMENT ON TABLE nurture_executions IS 'Log de ejecución de pasos de nurturing por lead';

COMMENT ON COLUMN leads.phone IS 'Teléfono en formato E.164 sin +: 34612345678';
COMMENT ON COLUMN leads.score IS 'Lead score 0-100 calculado por LeadScorer';
COMMENT ON COLUMN leads.tier IS 'Tier del lead: hot (70-100), warm (40-69), cold (0-39)';
COMMENT ON COLUMN leads.signals IS 'Array de señales activas del LeadScorer';
COMMENT ON COLUMN leads.next_followup IS 'Próximo contacto programado (cron-nurturing lo lee)';
COMMENT ON COLUMN leads.consent_calls IS 'Consentimiento para llamadas automáticas (obligatorio España)';
COMMENT ON COLUMN leads.consent_marketing IS 'Consentimiento para mensajes marketing WhatsApp';

COMMENT ON COLUMN lead_interactions.metadata IS 'Datos extra en JSON: className, eventId, duration, sentiment, etc.';
COMMENT ON COLUMN lead_interactions.content_summary IS 'Resumen corto para mostrar en timeline del dashboard';

COMMENT ON COLUMN nurture_sequences.steps IS 'Array JSON de pasos: [{delay_hours, channel, action, template_name, description}]';
COMMENT ON COLUMN nurture_sequences.trigger_conditions IS 'Condiciones extra JSON: {min_score, channel, dance_style, ...}';

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migración 002 completada correctamente';
    RAISE NOTICE '📋 Tablas creadas: leads, lead_interactions, nurture_sequences, nurture_executions';
    RAISE NOTICE '🔒 Row Level Security activado en todas las tablas';
    RAISE NOTICE '📊 3 secuencias de nurturing por defecto insertadas (desactivadas)';
    RAISE NOTICE '⚡ Índices optimizados para dashboard de analytics';
END $$;
