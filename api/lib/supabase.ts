/**
 * Supabase Client
 *
 * Cliente configurado para el sistema de fichaje de profesores.
 * Cumple con la legislación española (RD-ley 8/2019, Art. 34.9 ET).
 *
 * @see https://supabase.com/docs/reference/javascript
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================================
// DATABASE TYPES
// ============================================================================

/**
 * Profesor - Datos del trabajador para fichaje
 */
export interface Profesor {
  id: string;
  nombre: string;
  apellidos: string | null;
  dni: string | null;
  email: string | null;
  telefono_whatsapp: string;
  nombre_momence: string;

  // Datos contractuales (obligatorio legalmente para tiempo parcial)
  tipo_contrato: 'parcial' | 'completo';
  coeficiente_parcialidad: number | null;
  horas_semanales_contrato: number | null;

  activo: boolean;
  fecha_alta: string;
  fecha_baja: string | null;

  created_at: string;
  updated_at: string;
}

/**
 * Fichaje - Registro de jornada laboral
 * Cumple requisitos legales: hora exacta entrada/salida, modalidad, tipo horas
 */
export interface Fichaje {
  id: string;
  profesor_id: string;

  // Identificación clase
  clase_momence_id: number | null;
  clase_nombre: string;

  // DATOS OBLIGATORIOS LEGALMENTE
  fecha: string; // YYYY-MM-DD
  hora_inicio: string | null; // HH:MM:SS
  hora_fin: string | null;

  // Pausas
  pausa_inicio: string | null;
  pausa_fin: string | null;

  // Modalidad (obligatorio 2026)
  modalidad: 'presencial' | 'remoto';

  // Tipo de horas
  tipo_horas: 'ordinarias' | 'extraordinarias' | 'complementarias';

  // Horas calculadas
  minutos_trabajados: number | null;

  // Estado del fichaje
  estado: 'pendiente' | 'entrada_registrada' | 'completado' | 'no_fichado' | 'editado_admin';

  // Trazabilidad (OBLIGATORIO para inmutabilidad legal)
  metodo_entrada: 'whatsapp' | 'manual' | 'qr' | 'auto_momence' | null;
  metodo_salida: 'whatsapp' | 'manual' | 'qr' | 'auto_momence' | null;
  whatsapp_msg_id_entrada: string | null;
  whatsapp_msg_id_salida: string | null;
  timestamp_entrada: string | null;
  timestamp_salida: string | null;

  // Auditoría
  created_at: string;
  updated_at: string;
  editado_por: string | null;
  motivo_edicion: string | null;
}

/**
 * Registro de auditoría (OBLIGATORIO para trazabilidad legal)
 */
export interface FichajeAuditLog {
  id: string;
  fichaje_id: string;
  accion: 'crear' | 'editar' | 'eliminar';
  campo_modificado: string | null;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  usuario_id: string | null;
  ip_address: string | null;
  timestamp: string;
}

/**
 * Configuración del sistema de fichaje
 */
export interface ConfiguracionFichaje {
  id: number;
  minutos_antes_clase: number;
  minutos_despues_clase: number;
  umbral_pausa_minutos: number;
  timezone: string;
  notificar_no_fichados: boolean;
  email_admin: string | null;
}

/**
 * Resumen mensual para firma digital (tiempo parcial)
 */
export interface ResumenMensual {
  id: string;
  profesor_id: string;
  mes: string; // YYYY-MM-01

  total_horas: number;
  total_clases: number;
  horas_ordinarias: number;
  horas_complementarias: number;

  firmado: boolean;
  fecha_firma: string | null;
  ip_firma: string | null;
  hash_documento: string | null;
  pdf_url: string | null;

  created_at: string;
}

// ============================================================================
// DATABASE SCHEMA TYPE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profesores: {
        Row: Profesor;
        Insert: Omit<Profesor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profesor, 'id' | 'created_at'>>;
      };
      fichajes: {
        Row: Fichaje;
        Insert: Omit<Fichaje, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Fichaje, 'id' | 'created_at'>>;
      };
      fichajes_audit_log: {
        Row: FichajeAuditLog;
        Insert: Omit<FichajeAuditLog, 'id' | 'timestamp'>;
        Update: never;
      };
      configuracion_fichaje: {
        Row: ConfiguracionFichaje;
        Insert: Partial<ConfiguracionFichaje>;
        Update: Partial<ConfiguracionFichaje>;
      };
      resumen_mensual: {
        Row: ResumenMensual;
        Insert: Omit<ResumenMensual, 'id' | 'created_at'>;
        Update: Partial<Omit<ResumenMensual, 'id' | 'created_at'>>;
      };
    };
  };
}

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

// Singleton para reutilizar conexión entre invocaciones
let supabaseInstance: SupabaseClient<Database> | null = null;
let supabaseAdminInstance: SupabaseClient<Database> | null = null;

/**
 * Obtiene el cliente Supabase con clave anónima (para operaciones públicas)
 * Lanza error si las variables de entorno no están configuradas
 */
export function getSupabase(): SupabaseClient<Database> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const url = process.env['SUPABASE_URL'];
  const anonKey = process.env['SUPABASE_ANON_KEY'];

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
    );
  }

  supabaseInstance = createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseInstance;
}

/**
 * Obtiene el cliente Supabase con clave de servicio (para operaciones admin)
 * SOLO usar en backend - nunca exponer al cliente
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance;
  }

  const url = process.env['SUPABASE_URL'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!url || !serviceKey) {
    throw new Error(
      'Missing Supabase admin credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
  }

  supabaseAdminInstance = createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminInstance;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calcula minutos trabajados entre entrada y salida
 */
export function calcularMinutosTrabajados(
  horaInicio: string,
  horaFin: string,
  pausaInicio?: string | null,
  pausaFin?: string | null
): number {
  const [hiH = 0, hiM = 0] = horaInicio.split(':').map(Number);
  const [hfH = 0, hfM = 0] = horaFin.split(':').map(Number);

  let minutos = hfH * 60 + hfM - (hiH * 60 + hiM);

  // Restar pausas si existen
  if (pausaInicio && pausaFin) {
    const [piH = 0, piM = 0] = pausaInicio.split(':').map(Number);
    const [pfH = 0, pfM = 0] = pausaFin.split(':').map(Number);
    const pausa = pfH * 60 + pfM - (piH * 60 + piM);
    minutos -= pausa;
  }

  return Math.max(0, minutos);
}

/**
 * Formatea minutos a formato legible (ej: "2h 30min")
 */
export function formatearDuracion(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;

  if (horas === 0) return `${mins}min`;
  if (mins === 0) return `${horas}h`;
  return `${horas}h ${mins}min`;
}

/**
 * Obtiene la fecha actual en timezone de España
 */
export function getFechaHoyEspana(): string {
  return new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Europe/Madrid',
  });
}

/**
 * Obtiene la hora actual en timezone de España (HH:MM)
 */
export function getHoraAhoraEspana(): string {
  return new Date().toLocaleTimeString('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
