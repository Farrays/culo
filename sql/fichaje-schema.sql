-- ============================================
-- SISTEMA DE FICHAJE - SCHEMA PARA SUPABASE
-- ============================================
-- Ejecutar en Supabase → SQL Editor
-- Cumple con RD-ley 8/2019, Art. 34.9 ET
-- ============================================

-- 1. TABLA DE PROFESORES
-- ============================================
CREATE TABLE IF NOT EXISTS profesores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150),
    dni VARCHAR(20),
    email VARCHAR(255),
    telefono_whatsapp VARCHAR(20) NOT NULL UNIQUE,
    nombre_momence VARCHAR(200) NOT NULL,

    -- Régimen contractual (obligatorio legalmente para tiempo parcial)
    tipo_contrato VARCHAR(20) DEFAULT 'parcial' CHECK (tipo_contrato IN ('parcial', 'completo')),
    coeficiente_parcialidad DECIMAL(5,2),
    horas_semanales_contrato DECIMAL(5,2),

    activo BOOLEAN DEFAULT true,
    fecha_alta DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_baja DATE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA DE FICHAJES
-- ============================================
CREATE TABLE IF NOT EXISTS fichajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profesor_id UUID NOT NULL REFERENCES profesores(id) ON DELETE RESTRICT,

    -- Identificación clase (para sincronización con Momence)
    clase_momence_id INTEGER,
    clase_nombre VARCHAR(255) NOT NULL,

    -- DATOS OBLIGATORIOS LEGALMENTE
    fecha DATE NOT NULL,
    hora_inicio TIME,      -- Hora exacta de entrada
    hora_fin TIME,         -- Hora exacta de salida

    -- Pausas (si aplica)
    pausa_inicio TIME,
    pausa_fin TIME,

    -- Modalidad (obligatorio 2026)
    modalidad VARCHAR(20) DEFAULT 'presencial' CHECK (modalidad IN ('presencial', 'remoto')),

    -- Tipo de horas
    tipo_horas VARCHAR(20) DEFAULT 'ordinarias' CHECK (tipo_horas IN ('ordinarias', 'extraordinarias', 'complementarias')),

    -- Horas calculadas
    minutos_trabajados INTEGER,

    -- Estado del fichaje
    estado VARCHAR(30) DEFAULT 'pendiente' CHECK (estado IN (
        'pendiente',           -- Creado, esperando fichaje
        'entrada_registrada',  -- Entrada fichada, falta salida
        'completado',          -- Entrada y salida fichadas
        'no_fichado',          -- El profesor no fichó
        'editado_admin',       -- Editado manualmente por admin
        'clase_cancelada'      -- La clase fue cancelada en Momence
    )),

    -- Trazabilidad (OBLIGATORIO para inmutabilidad legal)
    metodo_entrada VARCHAR(20) CHECK (metodo_entrada IN ('whatsapp', 'manual', 'qr', 'auto_momence')),
    metodo_salida VARCHAR(20) CHECK (metodo_salida IN ('whatsapp', 'manual', 'qr', 'auto_momence')),
    whatsapp_msg_id_entrada VARCHAR(100),
    whatsapp_msg_id_salida VARCHAR(100),
    timestamp_entrada TIMESTAMPTZ,
    timestamp_salida TIMESTAMPTZ,

    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    editado_por UUID,
    motivo_edicion TEXT,

    -- Evitar duplicados: un profesor no puede tener dos fichajes a la misma hora el mismo día
    UNIQUE(profesor_id, fecha, hora_inicio)
);

-- 3. TABLA DE AUDITORÍA (OBLIGATORIA para trazabilidad legal)
-- ============================================
CREATE TABLE IF NOT EXISTS fichajes_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fichaje_id UUID NOT NULL REFERENCES fichajes(id) ON DELETE CASCADE,
    accion VARCHAR(20) NOT NULL CHECK (accion IN ('crear', 'editar', 'eliminar', 'cancelar')),
    campo_modificado VARCHAR(50),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    usuario_id UUID,
    ip_address VARCHAR(45),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE CONFIGURACIÓN
-- ============================================
CREATE TABLE IF NOT EXISTS configuracion_fichaje (
    id INTEGER PRIMARY KEY DEFAULT 1,
    minutos_antes_clase INTEGER DEFAULT 10,      -- Enviar WhatsApp X min antes
    minutos_despues_clase INTEGER DEFAULT 5,     -- Enviar WhatsApp X min después
    umbral_pausa_minutos INTEGER DEFAULT 15,     -- Si hay >15min entre clases = nuevo bloque
    timezone VARCHAR(50) DEFAULT 'Europe/Madrid',
    notificar_no_fichados BOOLEAN DEFAULT true,
    email_admin VARCHAR(255)
);

-- 5. TABLA DE RESUMEN MENSUAL (para firma digital - tiempo parcial)
-- ============================================
CREATE TABLE IF NOT EXISTS resumen_mensual (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profesor_id UUID NOT NULL REFERENCES profesores(id),
    mes DATE NOT NULL,  -- Primer día del mes (ej: 2026-01-01)

    -- Datos del resumen
    total_horas DECIMAL(6,2),
    total_clases INTEGER,
    horas_ordinarias DECIMAL(6,2),
    horas_complementarias DECIMAL(6,2),

    -- Firma digital
    firmado BOOLEAN DEFAULT false,
    fecha_firma TIMESTAMPTZ,
    ip_firma VARCHAR(45),
    hash_documento VARCHAR(64),  -- SHA-256

    -- PDF generado
    pdf_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(profesor_id, mes)
);

-- ============================================
-- ÍNDICES PARA RENDIMIENTO
-- ============================================
CREATE INDEX IF NOT EXISTS idx_fichajes_profesor_fecha ON fichajes(profesor_id, fecha);
CREATE INDEX IF NOT EXISTS idx_fichajes_fecha ON fichajes(fecha);
CREATE INDEX IF NOT EXISTS idx_fichajes_estado ON fichajes(estado);
CREATE INDEX IF NOT EXISTS idx_fichajes_clase_momence ON fichajes(clase_momence_id);
CREATE INDEX IF NOT EXISTS idx_profesores_activo ON profesores(activo);
CREATE INDEX IF NOT EXISTS idx_profesores_nombre_momence ON profesores(nombre_momence);
CREATE INDEX IF NOT EXISTS idx_audit_fichaje ON fichajes_audit_log(fichaje_id);
CREATE INDEX IF NOT EXISTS idx_resumen_profesor_mes ON resumen_mensual(profesor_id, mes);

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profesores_updated_at ON profesores;
CREATE TRIGGER profesores_updated_at
    BEFORE UPDATE ON profesores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS fichajes_updated_at ON fichajes;
CREATE TRIGGER fichajes_updated_at
    BEFORE UPDATE ON fichajes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- TRIGGER PARA AUDIT LOG AUTOMÁTICO
-- ============================================
CREATE OR REPLACE FUNCTION log_fichaje_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- Log cambios en hora_inicio
        IF OLD.hora_inicio IS DISTINCT FROM NEW.hora_inicio THEN
            INSERT INTO fichajes_audit_log (fichaje_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_id)
            VALUES (NEW.id, 'editar', 'hora_inicio', OLD.hora_inicio::TEXT, NEW.hora_inicio::TEXT, NEW.editado_por);
        END IF;

        -- Log cambios en hora_fin
        IF OLD.hora_fin IS DISTINCT FROM NEW.hora_fin THEN
            INSERT INTO fichajes_audit_log (fichaje_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_id)
            VALUES (NEW.id, 'editar', 'hora_fin', OLD.hora_fin::TEXT, NEW.hora_fin::TEXT, NEW.editado_por);
        END IF;

        -- Log cambios en estado
        IF OLD.estado IS DISTINCT FROM NEW.estado THEN
            INSERT INTO fichajes_audit_log (fichaje_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_id)
            VALUES (NEW.id, 'editar', 'estado', OLD.estado, NEW.estado, NEW.editado_por);
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fichajes_audit_trigger ON fichajes;
CREATE TRIGGER fichajes_audit_trigger
    AFTER UPDATE ON fichajes
    FOR EACH ROW EXECUTE FUNCTION log_fichaje_changes();

-- ============================================
-- INSERTAR CONFIGURACIÓN POR DEFECTO
-- ============================================
INSERT INTO configuracion_fichaje (id, minutos_antes_clase, minutos_despues_clase, umbral_pausa_minutos)
VALUES (1, 10, 5, 15)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Opcional pero recomendado
-- ============================================
-- Descomentar si quieres habilitar RLS

-- ALTER TABLE profesores ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE fichajes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE fichajes_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy para service_role (backend) - acceso total
-- CREATE POLICY "Service role has full access to profesores" ON profesores
--     FOR ALL USING (auth.role() = 'service_role');
-- CREATE POLICY "Service role has full access to fichajes" ON fichajes
--     FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- DATOS DE PRUEBA (OPCIONAL - COMENTAR EN PRODUCCIÓN)
-- ============================================
-- INSERT INTO profesores (nombre, apellidos, telefono_whatsapp, nombre_momence, tipo_contrato, activo, fecha_alta)
-- VALUES
--   ('Yunaisy', 'Farray', '+34622247085', 'Yunaisy Farray', 'parcial', true, '2022-03-01'),
--   ('Profesor', 'Test', '+34600000000', 'Profesor Test', 'parcial', true, CURRENT_DATE);
