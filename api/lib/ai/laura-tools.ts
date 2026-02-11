/**
 * Laura Tools - Claude tool_use integration for Momence actions
 *
 * Defines 5 tools that Laura can use during WhatsApp conversations:
 * 1. search_upcoming_classes - Real-time class schedule
 * 2. get_member_info - Credits, membership status
 * 3. get_member_bookings - Upcoming reservations
 * 4. create_booking - Book a class
 * 5. cancel_booking - Cancel a reservation
 */

import type { Redis } from '@upstash/redis';
import type Anthropic from '@anthropic-ai/sdk';
import { getMemberLookup } from './member-lookup.js';
import { getMomenceClient } from '../momence-client.js';

// ============================================================================
// TYPES
// ============================================================================

export interface ToolContext {
  redis: Redis;
  phone: string;
  memberId?: number;
}

// ============================================================================
// TOOL DEFINITIONS (Anthropic format)
// ============================================================================

export const LAURA_TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_upcoming_classes',
    description:
      'Buscar clases disponibles en los próximos días. Usa cuando pregunten por horarios, disponibilidad o clases de un estilo concreto.',
    input_schema: {
      type: 'object' as const,
      properties: {
        style: {
          type: 'string',
          description:
            'Estilo de baile (ej: "salsa", "bachata", "twerk", "hip hop", "ballet", "contemporaneo", "heels", "femmology", "sexy style", "stretching")',
        },
        days_ahead: {
          type: 'number',
          description: 'Número de días a buscar (default: 7, máximo: 14)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_member_info',
    description:
      'Obtener información del miembro: créditos disponibles, membresía activa, estado. Usa cuando pregunten por sus créditos, membresía o cuenta.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_member_bookings',
    description:
      'Ver las próximas reservas/clases del miembro. Usa cuando pregunten "qué clases tengo" o quieran cancelar.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'create_booking',
    description:
      'Reservar una clase para el miembro. IMPORTANTE: Solo usar después de que el usuario confirme que quiere reservar. Necesitas el session_id de la clase.',
    input_schema: {
      type: 'object' as const,
      properties: {
        session_id: {
          type: 'number',
          description: 'ID de la sesión de Momence (obtenido de search_upcoming_classes)',
        },
      },
      required: ['session_id'],
    },
  },
  {
    name: 'cancel_booking',
    description:
      'Cancelar una reserva. IMPORTANTE: SIEMPRE pide confirmación al usuario antes de ejecutar. Pregunta "¿Seguro que quieres cancelar [nombre clase]?"',
    input_schema: {
      type: 'object' as const,
      properties: {
        booking_id: {
          type: 'number',
          description: 'ID de la reserva a cancelar (obtenido de get_member_bookings)',
        },
      },
      required: ['booking_id'],
    },
  },
];

// ============================================================================
// TOOL EXECUTION
// ============================================================================

export async function executeTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  context: ToolContext
): Promise<string> {
  const startTime = Date.now();
  console.log(`[laura-tools] Executing tool: ${toolName}`, JSON.stringify(toolInput));

  try {
    // 5-second timeout for each tool execution
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let result: string;
    switch (toolName) {
      case 'search_upcoming_classes':
        result = await executeSearchClasses(toolInput, context);
        break;
      case 'get_member_info':
        result = await executeGetMemberInfo(context);
        break;
      case 'get_member_bookings':
        result = await executeGetMemberBookings(context);
        break;
      case 'create_booking':
        result = await executeCreateBooking(toolInput, context);
        break;
      case 'cancel_booking':
        result = await executeCancelBooking(toolInput, context);
        break;
      default:
        result = JSON.stringify({ error: `Herramienta desconocida: ${toolName}` });
    }

    clearTimeout(timeoutId);
    console.log(`[laura-tools] ${toolName} completed in ${Date.now() - startTime}ms`);
    return result;
  } catch (error) {
    console.error(`[laura-tools] ${toolName} error:`, error);
    if (error instanceof Error && error.name === 'AbortError') {
      return JSON.stringify({ error: 'Timeout: la consulta tardó demasiado. Inténtalo de nuevo.' });
    }
    return JSON.stringify({
      error: 'Error técnico al consultar el sistema. Inténtalo de nuevo en unos segundos.',
    });
  }
}

// ============================================================================
// TOOL IMPLEMENTATIONS
// ============================================================================

async function executeSearchClasses(
  input: Record<string, unknown>,
  context: ToolContext
): Promise<string> {
  const memberService = getMemberLookup(context.redis);
  const style = input['style'] as string | undefined;
  const daysAhead = Math.min(Number(input['days_ahead']) || 7, 14);

  const sessions = await memberService.fetchUpcomingSessions(style, daysAhead);

  if (sessions.length === 0) {
    return JSON.stringify({
      found: 0,
      message: style
        ? `No hay clases de ${style} disponibles en los próximos ${daysAhead} días.`
        : `No hay clases disponibles en los próximos ${daysAhead} días.`,
    });
  }

  // Return structured data for Claude to format nicely
  const classes = sessions.slice(0, 15).map(s => ({
    id: s.id,
    name: s.name,
    day: s.dayOfWeek,
    date: s.date,
    time: s.time,
    instructor: s.instructor,
    spots_available: s.spotsAvailable,
    is_full: s.isFull,
  }));

  return JSON.stringify({
    found: sessions.length,
    showing: classes.length,
    classes,
  });
}

async function executeGetMemberInfo(context: ToolContext): Promise<string> {
  if (!context.memberId) {
    return JSON.stringify({
      error: 'No se encontró tu perfil de miembro. ¿Estás registrado en Momence?',
    });
  }

  const memberService = getMemberLookup(context.redis);
  const membershipInfo = await memberService.fetchMembershipInfo(context.memberId);

  return JSON.stringify({
    memberId: context.memberId,
    hasActiveMembership: membershipInfo.hasActiveMembership,
    creditsAvailable: membershipInfo.creditsAvailable,
    membershipName: membershipInfo.membershipName || null,
  });
}

async function executeGetMemberBookings(context: ToolContext): Promise<string> {
  if (!context.memberId) {
    return JSON.stringify({
      error: 'No se encontró tu perfil de miembro. ¿Estás registrado en Momence?',
    });
  }

  const client = getMomenceClient(context.redis);
  const now = new Date();

  const result = await client.getMemberSessionBookings(context.memberId, {
    page: 0,
    pageSize: 20,
    startAfter: now.toISOString(),
  });

  const bookings = (result.payload || []).map(b => ({
    booking_id: b.id,
    class_name: b.session?.name || 'Clase',
    starts_at: b.session?.startsAt || '',
    checked_in: b.checkedIn || false,
    cancelled: !!b.cancelledAt,
  }));

  if (bookings.length === 0) {
    return JSON.stringify({
      found: 0,
      message: 'No tienes reservas próximas.',
    });
  }

  return JSON.stringify({
    found: bookings.length,
    bookings,
  });
}

async function executeCreateBooking(
  input: Record<string, unknown>,
  context: ToolContext
): Promise<string> {
  if (!context.memberId) {
    return JSON.stringify({
      error:
        'No se encontró tu perfil de miembro. Para reservar, hazlo desde la web: www.farrayscenter.com/es/horarios-clases-baile-barcelona',
    });
  }

  const sessionId = input['session_id'] as number;
  if (!sessionId) {
    return JSON.stringify({
      error: 'Falta el ID de la sesión. Busca primero las clases disponibles.',
    });
  }

  const client = getMomenceClient(context.redis);

  try {
    const result = await client.createFreeBooking(sessionId, context.memberId);
    return JSON.stringify({
      success: true,
      message: 'Reserva creada correctamente.',
      booking: result,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';

    // Parse common Momence errors
    if (errorMsg.includes('404')) {
      return JSON.stringify({ error: 'Esa clase no existe o ya no está disponible.' });
    }
    if (errorMsg.includes('409') || errorMsg.includes('already')) {
      return JSON.stringify({ error: 'Ya tienes una reserva para esta clase.' });
    }
    if (errorMsg.includes('full') || errorMsg.includes('capacity')) {
      return JSON.stringify({
        error: 'La clase está llena. ¿Quieres que te apunte a la lista de espera?',
      });
    }

    return JSON.stringify({ error: `No se pudo crear la reserva: ${errorMsg}` });
  }
}

async function executeCancelBooking(
  input: Record<string, unknown>,
  context: ToolContext
): Promise<string> {
  if (!context.memberId) {
    return JSON.stringify({ error: 'No se encontró tu perfil de miembro.' });
  }

  const bookingId = input['booking_id'] as number;
  if (!bookingId) {
    return JSON.stringify({
      error: 'Falta el ID de la reserva. Consulta primero tus reservas.',
    });
  }

  const client = getMomenceClient(context.redis);

  try {
    await client.cancelBooking(bookingId, {
      refund: true,
      disableNotifications: false,
      isLateCancellation: false,
    });

    return JSON.stringify({
      success: true,
      message: 'Reserva cancelada correctamente.',
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    return JSON.stringify({ error: `No se pudo cancelar: ${errorMsg}` });
  }
}
