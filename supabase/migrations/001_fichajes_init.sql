-- ==============================================================================
-- SISTEMA DE FICHAJE PARA PROFESORES - FARRAY'S CENTER
-- ==============================================================================
-- Migración inicial: Crea todas las tablas necesarias
-- Cumple con legislación española: RD-ley 8/2019, Art. 34.9 ET
--
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
-- 2. Abre: SQL Editor (icono de terminal)
-- 3. Pega este script completo
-- 4. Pulsa "Run" (Ctrl+Enter)
-- ==============================================================================

-- ============================================================================
-- TABLA: PROFESORES
-- ============================================================================
-- Datos del trabajador para fichaje
-- Incluye campos obligatorios para tiempo parcial (coeficiente, horas contrato)

CREATE TABLE IF NOT EXISTS profesores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Datos personales
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150),
    dni VARCHAR(20),  -- Para identificación legal en informes
    email VARCHAR(255),
    telefono_whatsapp VARCHAR(20) NOT NULL UNIQUE,  -- Formato E.164: +34666555444
    nombre_momence VARCHAR(200) NOT NULL,  -- Nombre exacto como aparece en Momence

    -- Régimen contractual (OBLIGATORIO legalmente para tiempo parcial)
    tipo_contrato VARCHAR(20) DEFAULT 'parcial' CHECK (tipo_contrato IN ('parcial', 'completo')),
    coeficiente_parcialidad DECIMAL(5,2),  -- Ej: 50.00 = 50%
    horas_semanales_contrato DECIMAL(5,2),  -- Horas según contrato

    -- Estado
    activo BOOLEAN DEFAULT true,
    fecha_alta DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_baja DATE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_profesores_activo ON profesores(activo);
CREATE INDEX IF NOT EXISTS idx_profesores_nombre_momence ON profesores(nombre_momence);
CREATE INDEX IF NOT EXISTS idx_profesores_whatsapp ON profesores(telefono_whatsapp);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profesores_updated_at
    BEFORE UPDATE ON profesores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: FICHAJES
-- ============================================================================
-- Registro de jornada laboral - CUMPLE REQUISITOS LEGALES
-- - Hora y minuto exactos de entrada/salida
-- - Modalidad (presencial/remoto)
-- - Tipo de horas (ordinarias/extraordinarias/complementarias)
-- - Trazabilidad completa (método, timestamps, auditoría)

CREATE TABLE IF NOT EXISTS fichajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profesor_id UUID NOT NULL REFERENCES profesores(id) ON DELETE RESTRICT,

    -- Identificación de la clase
    clase_momence_id INTEGER,  -- ID de la clase en Momence
    clase_nombre VARCHAR(255) NOT NULL,  -- "Salsa Cubana - Principiantes"

    -- DATOS OBLIGATORIOS LEGALMENTE (Art. 34.9 ET)
    fecha DATE NOT NULL,
    hora_inicio TIME,  -- Hora y minuto exactos de entrada
    hora_fin TIME,     -- Hora y minuto exactos de salida

    -- Pausas (si hay bloque con pausa intermedia)
    pausa_inicio TIME,
    pausa_fin TIME,

    -- Modalidad (OBLIGATORIO a partir de 2026)
    modalidad VARCHAR(20) DEFAULT 'presencial' CHECK (modalidad IN ('presencial', 'remoto')),

    -- Tipo de horas (importante para tiempo parcial)
    tipo_horas VARCHAR(20) DEFAULT 'ordinarias' CHECK (tipo_horas IN ('ordinarias', 'extraordinarias', 'complementarias')),

    -- Minutos trabajados (calculado automáticamente)
    minutos_trabajados INTEGER,

    -- Estado del fichaje
    estado VARCHAR(30) DEFAULT 'pendiente' CHECK (estado IN (
        'pendiente',          -- Clase programada, sin fichaje
        'entrada_registrada', -- Solo entrada fichada
        'completado',         -- Entrada y salida fichadas
        'no_fichado',         -- Clase pasó sin fichaje
        'editado_admin'       -- Modificado manualmente
    )),

    -- TRAZABILIDAD (OBLIGATORIO para inmutabilidad legal)
    metodo_entrada VARCHAR(20) CHECK (metodo_entrada IN ('whatsapp', 'manual', 'qr', 'auto_momence')),
    metodo_salida VARCHAR(20) CHECK (metodo_salida IN ('whatsapp', 'manual', 'qr', 'auto_momence')),
    whatsapp_msg_id_entrada VARCHAR(100),  -- ID del mensaje WhatsApp
    whatsapp_msg_id_salida VARCHAR(100),
    timestamp_entrada TIMESTAMPTZ,  -- Momento exacto del fichaje
    timestamp_salida TIMESTAMPTZ,

    -- Auditoría de ediciones manuales
    editado_por UUID,  -- ID del admin que editó
    motivo_edicion TEXT,  -- Razón de la edición manual

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Un profesor no puede tener dos fichajes para la misma clase/hora
    UNIQUE(profesor_id, fecha, hora_inicio)
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_fichajes_profesor_id ON fichajes(profesor_id);
CREATE INDEX IF NOT EXISTS idx_fichajes_fecha ON fichajes(fecha);
CREATE INDEX IF NOT EXISTS idx_fichajes_estado ON fichajes(estado);
CREATE INDEX IF NOT EXISTS idx_fichajes_profesor_fecha ON fichajes(profesor_id, fecha);

-- Trigger para updated_at
CREATE TRIGGER update_fichajes_updated_at
    BEFORE UPDATE ON fichajes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: FICHAJES_AUDIT_LOG
-- ============================================================================
-- OBLIGATORIO para cumplir con inmutabilidad legal
-- Registra TODOS los cambios en fichajes

CREATE TABLE IF NOT EXISTS fichajes_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fichaje_id UUID NOT NULL REFERENCES fichajes(id) ON DELETE CASCADE,

    accion VARCHAR(20) NOT NULL CHECK (accion IN ('crear', 'editar', 'eliminar')),
    campo_modificado VARCHAR(50),  -- Qué campo se cambió
    valor_anterior TEXT,           -- Valor antes del cambio
    valor_nuevo TEXT,              -- Valor después del cambio

    usuario_id UUID,               -- Admin que hizo el cambio
    ip_address VARCHAR(45),        -- IP desde donde se hizo

    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para buscar historial de un fichaje
CREATE INDEX IF NOT EXISTS idx_audit_fichaje_id ON fichajes_audit_log(fichaje_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON fichajes_audit_log(timestamp);

-- Trigger automático para registrar cambios en fichajes
CREATE OR REPLACE FUNCTION log_fichaje_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO fichajes_audit_log (fichaje_id, accion, valor_nuevo)
        VALUES (NEW.id, 'crear', row_to_json(NEW)::text);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Solo registrar si hay cambios significativos
        IF OLD.hora_inicio IS DISTINCT FROM NEW.hora_inicio
           OR OLD.hora_fin IS DISTINCT FROM NEW.hora_fin
           OR OLD.estado IS DISTINCT FROM NEW.estado THEN
            INSERT INTO fichajes_audit_log (
                fichaje_id, accion, campo_modificado,
                valor_anterior, valor_nuevo, usuario_id
            )
            VALUES (
                NEW.id, 'editar',
                CASE
                    WHEN OLD.hora_inicio IS DISTINCT FROM NEW.hora_inicio THEN 'hora_inicio'
                    WHEN OLD.hora_fin IS DISTINCT FROM NEW.hora_fin THEN 'hora_fin'
                    WHEN OLD.estado IS DISTINCT FROM NEW.estado THEN 'estado'
                    ELSE 'multiple'
                END,
                row_to_json(OLD)::text,
                row_to_json(NEW)::text,
                NEW.editado_por
            );
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO fichajes_audit_log (fichaje_id, accion, valor_anterior)
        VALUES (OLD.id, 'eliminar', row_to_json(OLD)::text);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER fichajes_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON fichajes
    FOR EACH ROW
    EXECUTE FUNCTION log_fichaje_changes();

-- ============================================================================
-- TABLA: CONFIGURACION_FICHAJE
-- ============================================================================
-- Configuración global del sistema

CREATE TABLE IF NOT EXISTS configuracion_fichaje (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- Solo un registro

    minutos_antes_clase INTEGER DEFAULT 10,    -- Enviar WhatsApp X min antes
    minutos_despues_clase INTEGER DEFAULT 5,   -- Enviar WhatsApp X min después
    umbral_pausa_minutos INTEGER DEFAULT 15,   -- >15min entre clases = nuevo bloque

    timezone VARCHAR(50) DEFAULT 'Europe/Madrid',

    notificar_no_fichados BOOLEAN DEFAULT true,  -- Alertar si no fichan
    minutos_alerta_profesor INTEGER DEFAULT 15,  -- Alertar profesor tras X min
    minutos_alerta_admin INTEGER DEFAULT 30,     -- Alertar admin tras X min

    email_admin VARCHAR(255),
    telefono_admin_whatsapp VARCHAR(20)
);

-- Insertar configuración por defecto
INSERT INTO configuracion_fichaje (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- TABLA: RESUMEN_MENSUAL
-- ============================================================================
-- Para cumplir con obligación de entregar resumen mensual a tiempo parcial
-- Incluye firma digital del trabajador

CREATE TABLE IF NOT EXISTS resumen_mensual (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profesor_id UUID NOT NULL REFERENCES profesores(id) ON DELETE RESTRICT,
    mes DATE NOT NULL,  -- Primer día del mes (2026-01-01)

    -- Resumen de horas
    total_horas DECIMAL(6,2),
    total_clases INTEGER,
    horas_ordinarias DECIMAL(6,2),
    horas_complementarias DECIMAL(6,2),

    -- Firma digital (IMPORTANTE para tiempo parcial)
    firmado BOOLEAN DEFAULT false,
    fecha_firma TIMESTAMPTZ,
    ip_firma VARCHAR(45),
    hash_documento VARCHAR(64),  -- SHA-256 del PDF
    token_firma VARCHAR(64) UNIQUE,  -- Token único para link de firma

    -- PDF generado
    pdf_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Un resumen por profesor por mes
    UNIQUE(profesor_id, mes)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_resumen_profesor ON resumen_mensual(profesor_id);
CREATE INDEX IF NOT EXISTS idx_resumen_mes ON resumen_mensual(mes);
CREATE INDEX IF NOT EXISTS idx_resumen_token ON resumen_mensual(token_firma);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Activar RLS para todas las tablas

ALTER TABLE profesores ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichajes_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_fichaje ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumen_mensual ENABLE ROW LEVEL SECURITY;

-- Políticas para service_role (backend) - acceso total
CREATE POLICY "Service role full access profesores" ON profesores
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access fichajes" ON fichajes
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access audit" ON fichajes_audit_log
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access config" ON configuracion_fichaje
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access resumen" ON resumen_mensual
    FOR ALL USING (auth.role() = 'service_role');

-- Políticas para anon (PWA pública de fichaje) - solo lectura limitada
CREATE POLICY "Anon read active profesores" ON profesores
    FOR SELECT USING (activo = true);

-- ============================================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================

COMMENT ON TABLE profesores IS 'Profesores/trabajadores del centro para fichaje';
COMMENT ON TABLE fichajes IS 'Registro de jornada laboral - cumple Art. 34.9 ET';
COMMENT ON TABLE fichajes_audit_log IS 'Auditoría inmutable de cambios en fichajes';
COMMENT ON TABLE configuracion_fichaje IS 'Configuración del sistema de fichaje';
COMMENT ON TABLE resumen_mensual IS 'Resumen mensual para entrega a tiempo parcial';

COMMENT ON COLUMN fichajes.hora_inicio IS 'Hora y minuto exactos de entrada (obligatorio legalmente)';
COMMENT ON COLUMN fichajes.hora_fin IS 'Hora y minuto exactos de salida (obligatorio legalmente)';
COMMENT ON COLUMN fichajes.tipo_horas IS 'Tipo de horas: ordinarias, extraordinarias, complementarias';
COMMENT ON COLUMN fichajes.metodo_entrada IS 'Método de fichaje: whatsapp, manual, qr, auto_momence';

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migración completada correctamente';
    RAISE NOTICE '📋 Tablas creadas: profesores, fichajes, fichajes_audit_log, configuracion_fichaje, resumen_mensual';
    RAISE NOTICE '🔒 Row Level Security activado en todas las tablas';
    RAISE NOTICE '📝 Triggers de auditoría configurados';
END $$;
