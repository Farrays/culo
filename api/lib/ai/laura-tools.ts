/**
 * Laura Tools - Claude tool_use integration for Momence actions
 *
 * Defines 13 tools that Laura can use during WhatsApp conversations:
 * 1. search_upcoming_classes - Real-time class schedule
 * 2. get_member_info - Credits, membership status
 * 3. get_member_bookings - Upcoming reservations
 * 4. create_booking - Book a class
 * 5. cancel_booking - Cancel a reservation
 * 6. get_membership_options - Available membership plans/prices
 * 7. add_to_waitlist - Add to waitlist when class is full
 * 8. get_class_details - Detailed info about a specific class
 * 9. check_in_member - Remote check-in for a booking
 * 10. transfer_to_human - Transfer conversation to human agent
 * 11. get_credit_details - Detailed credit breakdown per bought membership
 * 12. get_visit_history - Past class attendance history
 * 13. update_member_email - Update member email address
 */

import type { Redis } from '@upstash/redis';
import type Anthropic from '@anthropic-ai/sdk';
import { getMemberLookup } from './member-lookup.js';
import { getMomenceClient } from '../momence-client.js';
import { activateTakeover, addNotification } from './human-takeover.js';

// ============================================================================
// MOMENCE URL CONFIG
// ============================================================================

const MOMENCE_BUSINESS_SLUG = "Farray's-International-Dance-Center";

/**
 * Builds a direct link to a class session on Momence.
 * Users can pay for a single drop-in class from this page.
 */
function buildClassUrl(className: string, sessionId: number): string {
  return `https://momence.com/${MOMENCE_BUSINESS_SLUG}/${encodeURIComponent(className)}/${sessionId}`;
}

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
      'Reservar una clase para el miembro. IMPORTANTE: Solo usar después de que el usuario confirme que quiere reservar. Necesitas el session_id y class_name de search_upcoming_classes.',
    input_schema: {
      type: 'object' as const,
      properties: {
        session_id: {
          type: 'number',
          description: 'ID de la sesión de Momence (obtenido de search_upcoming_classes)',
        },
        class_name: {
          type: 'string',
          description:
            'Nombre de la clase (obtenido de search_upcoming_classes). Necesario para generar enlace de compra si falla la reserva.',
        },
      },
      required: ['session_id', 'class_name'],
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
  {
    name: 'get_membership_options',
    description:
      'Obtener los planes de membresía/bonos disponibles con sus precios. Usa cuando pregunten por precios, bonos, tarifas o qué opciones de membresía hay.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'add_to_waitlist',
    description:
      'Apuntar al miembro a la lista de espera de una clase llena. Usa cuando una clase esté completa y el usuario quiera apuntarse a la lista de espera.',
    input_schema: {
      type: 'object' as const,
      properties: {
        session_id: {
          type: 'number',
          description: 'ID de la sesión llena (obtenido de search_upcoming_classes)',
        },
      },
      required: ['session_id'],
    },
  },
  {
    name: 'get_class_details',
    description:
      'Obtener información detallada de una clase específica: profesor, horario, plazas disponibles, capacidad. Usa cuando pregunten detalles de una clase concreta.',
    input_schema: {
      type: 'object' as const,
      properties: {
        session_id: {
          type: 'number',
          description: 'ID de la sesión (obtenido de search_upcoming_classes)',
        },
      },
      required: ['session_id'],
    },
  },
  {
    name: 'check_in_member',
    description:
      'Hacer check-in remoto de un miembro para una reserva. IMPORTANTE: Confirma con el usuario antes de ejecutar.',
    input_schema: {
      type: 'object' as const,
      properties: {
        booking_id: {
          type: 'number',
          description: 'ID de la reserva para hacer check-in (obtenido de get_member_bookings)',
        },
      },
      required: ['booking_id'],
    },
  },
  {
    name: 'transfer_to_human',
    description:
      'Transferir la conversación a un agente humano. Usa cuando el usuario pida hablar con una persona, cuando no puedas resolver su consulta, o cuando la situación requiera intervención humana.',
    input_schema: {
      type: 'object' as const,
      properties: {
        reason: {
          type: 'string',
          description:
            'Motivo de la transferencia (ej: "solicita hablar con persona", "consulta compleja sobre facturación")',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_credit_details',
    description:
      'Obtener desglose detallado de créditos por cada bono/membresía comprada: créditos usados, restantes, fechas, estado congelado. Usa cuando pregunten "cuántos créditos me quedan de cada bono" o quieran detalle por membresía.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_visit_history',
    description:
      'Ver historial de clases a las que ha asistido el miembro. Usa cuando pregunten "a qué clases he ido", "mi historial" o quieran ver asistencia pasada.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'update_member_email',
    description:
      'Actualizar el email del miembro en Momence. IMPORTANTE: Confirma el nuevo email con el usuario antes de ejecutar.',
    input_schema: {
      type: 'object' as const,
      properties: {
        email: {
          type: 'string',
          description: 'Nuevo email del miembro',
        },
      },
      required: ['email'],
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
      case 'get_membership_options':
        result = await executeGetMembershipOptions(context);
        break;
      case 'add_to_waitlist':
        result = await executeAddToWaitlist(toolInput, context);
        break;
      case 'get_class_details':
        result = await executeGetClassDetails(toolInput, context);
        break;
      case 'check_in_member':
        result = await executeCheckInMember(toolInput, context);
        break;
      case 'transfer_to_human':
        result = await executeTransferToHuman(toolInput, context);
        break;
      case 'get_credit_details':
        result = await executeGetCreditDetails(context);
        break;
      case 'get_visit_history':
        result = await executeGetVisitHistory(context);
        break;
      case 'update_member_email':
        result = await executeUpdateMemberEmail(toolInput, context);
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
  const sessionId = input['session_id'] as number;
  const className = input['class_name'] as string;

  if (!context.memberId) {
    const classUrl = sessionId && className ? buildClassUrl(className, sessionId) : null;
    return JSON.stringify({
      error:
        'No se encontró tu perfil de miembro. Puede comprar la clase directamente desde el enlace.',
      ...(classUrl && { class_url: classUrl }),
    });
  }

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

    // Include direct class link so user can pay for a single drop-in class
    const classUrl = className ? buildClassUrl(className, sessionId) : null;
    return JSON.stringify({
      error: `No se pudo crear la reserva: ${errorMsg}`,
      ...(classUrl && { class_url: classUrl }),
      hint: 'El usuario puede comprar la clase directamente desde el enlace.',
    });
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

async function executeGetMembershipOptions(context: ToolContext): Promise<string> {
  const client = getMomenceClient(context.redis);

  try {
    const result = await client.getMemberships({ page: 0, pageSize: 50 });
    const memberships = (result.payload || []).map(m => ({
      id: m.id,
      name: m.name,
      price: m.price,
      type: m.type,
    }));

    if (memberships.length === 0) {
      return JSON.stringify({
        found: 0,
        message: 'No hay planes de membresía configurados.',
      });
    }

    return JSON.stringify({
      found: memberships.length,
      memberships,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    return JSON.stringify({ error: `No se pudieron obtener las membresías: ${errorMsg}` });
  }
}

async function executeAddToWaitlist(
  input: Record<string, unknown>,
  context: ToolContext
): Promise<string> {
  if (!context.memberId) {
    return JSON.stringify({
      error: 'No se encontró tu perfil de miembro. ¿Estás registrado en Momence?',
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
    await client.addToWaitlist(sessionId, context.memberId);
    return JSON.stringify({
      success: true,
      message: 'Te has apuntado a la lista de espera. Te avisaremos si se libera una plaza.',
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';

    if (errorMsg.includes('404')) {
      return JSON.stringify({ error: 'Esa clase no existe o ya no está disponible.' });
    }
    if (errorMsg.includes('409') || errorMsg.includes('already')) {
      return JSON.stringify({ error: 'Ya estás en la lista de espera para esta clase.' });
    }

    return JSON.stringify({ error: `No se pudo apuntar a la lista de espera: ${errorMsg}` });
  }
}

async function executeGetClassDetails(
  input: Record<string, unknown>,
  context: ToolContext
): Promise<string> {
  const sessionId = input['session_id'] as number;
  if (!sessionId) {
    return JSON.stringify({
      error: 'Falta el ID de la sesión. Busca primero las clases disponibles.',
    });
  }

  const client = getMomenceClient(context.redis);

  try {
    const session = await client.getSession(sessionId);

    const capacity = session['capacity'] as number | undefined;
    const bookingCount = session['bookingCount'] as number | undefined;

    return JSON.stringify({
      id: session['id'],
      name: session['name'],
      startsAt: session['startsAt'],
      endsAt: session['endsAt'],
      capacity,
      bookingCount,
      spotsAvailable:
        typeof capacity === 'number' && typeof bookingCount === 'number'
          ? Math.max(0, capacity - bookingCount)
          : null,
      isFull:
        typeof capacity === 'number' && typeof bookingCount === 'number'
          ? bookingCount >= capacity
          : null,
      teacher: session['teacher'] || null,
      location: session['location'] || null,
      description: session['description'] || null,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';

    if (errorMsg.includes('404')) {
      return JSON.stringify({ error: 'Esa clase no existe o ya no está disponible.' });
    }

    return JSON.stringify({ error: `No se pudo obtener la información de la clase: ${errorMsg}` });
  }
}

async function executeCheckInMember(
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
    await client.checkIn(bookingId);
    return JSON.stringify({
      success: true,
      message: 'Check-in realizado correctamente.',
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';

    if (errorMsg.includes('404')) {
      return JSON.stringify({ error: 'Esa reserva no existe.' });
    }
    if (errorMsg.includes('already') || errorMsg.includes('409')) {
      return JSON.stringify({ error: 'Ya se ha hecho check-in para esta reserva.' });
    }

    return JSON.stringify({ error: `No se pudo hacer el check-in: ${errorMsg}` });
  }
}

async function executeTransferToHuman(
  input: Record<string, unknown>,
  context: ToolContext
): Promise<string> {
  const reason = (input['reason'] as string) || 'Solicitud del usuario';

  try {
    await activateTakeover(context.redis, context.phone, 'laura-transfer');

    // Notificar al admin
    await addNotification(
      context.redis,
      context.phone,
      `Laura ha transferido la conversación: ${reason}`,
      undefined,
      'escalation'
    ).catch(() => {});

    return JSON.stringify({
      success: true,
      message:
        'Conversación transferida a un agente humano. Un miembro del equipo te atenderá en breve.',
      reason,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    return JSON.stringify({ error: `No se pudo transferir: ${errorMsg}` });
  }
}

async function executeGetCreditDetails(context: ToolContext): Promise<string> {
  if (!context.memberId) {
    return JSON.stringify({
      error: 'No se encontró tu perfil de miembro. ¿Estás registrado en Momence?',
    });
  }

  const client = getMomenceClient(context.redis);

  try {
    const result = await client.getMemberBoughtMemberships(context.memberId, {
      page: 0,
      pageSize: 50,
    });

    const memberships = (result.payload || []).map(m => ({
      id: m.id,
      name: m.membership?.name || 'Membresía',
      type: m.type,
      startDate: m.startDate,
      endDate: m.endDate || null,
      isFrozen: m.isFrozen,
      eventCreditsLeft: m.eventCreditsLeft ?? null,
      eventCreditsTotal: m.eventCreditsTotal ?? null,
      moneyCreditsLeft: m.moneyCreditsLeft ?? null,
      moneyCreditsTotal: m.moneyCreditsTotal ?? null,
    }));

    if (memberships.length === 0) {
      return JSON.stringify({
        found: 0,
        message: 'No tienes membresías activas.',
      });
    }

    return JSON.stringify({
      found: memberships.length,
      memberships,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    return JSON.stringify({ error: `No se pudieron obtener los créditos: ${errorMsg}` });
  }
}

async function executeGetVisitHistory(context: ToolContext): Promise<string> {
  if (!context.memberId) {
    return JSON.stringify({
      error: 'No se encontró tu perfil de miembro. ¿Estás registrado en Momence?',
    });
  }

  const memberService = getMemberLookup(context.redis);

  try {
    const visits = await memberService.fetchMemberVisits(context.memberId);

    if (visits.length === 0) {
      return JSON.stringify({
        found: 0,
        message: 'No se encontraron visitas recientes.',
      });
    }

    return JSON.stringify({
      found: visits.length,
      visits: visits.map(v => ({
        class_name: v.className,
        date: v.date,
        instructor: v.instructorName || null,
      })),
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    return JSON.stringify({ error: `No se pudo obtener el historial: ${errorMsg}` });
  }
}

async function executeUpdateMemberEmail(
  input: Record<string, unknown>,
  context: ToolContext
): Promise<string> {
  if (!context.memberId) {
    return JSON.stringify({ error: 'No se encontró tu perfil de miembro.' });
  }

  const email = input['email'] as string;
  if (!email) {
    return JSON.stringify({ error: 'Falta el nuevo email.' });
  }

  const memberService = getMemberLookup(context.redis);

  try {
    const result = await memberService.updateMemberEmail(context.memberId, email);

    if (!result.success) {
      return JSON.stringify({ error: result.error || 'No se pudo actualizar el email.' });
    }

    return JSON.stringify({
      success: true,
      message: `Email actualizado correctamente a ${email}.`,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    return JSON.stringify({ error: `No se pudo actualizar el email: ${errorMsg}` });
  }
}
