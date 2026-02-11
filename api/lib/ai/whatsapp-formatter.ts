/**
 * WhatsApp Formatter - Convierte formato Claude/Markdown a formato WhatsApp
 *
 * WhatsApp usa su propia sintaxis (NO es markdown):
 * - *bold*     (un asterisco, NO dos)
 * - _italic_   (guion bajo)
 * - ~strike~   (una tilde, NO dos)
 * - ```code``` (triple backtick)
 *
 * @see https://faq.whatsapp.com/539178204879377/
 */

/**
 * Convierte markdown de Claude a formato WhatsApp.
 * Claude genera **bold** pero WhatsApp necesita *bold*.
 */
export function markdownToWhatsApp(text: string): string {
  return (
    text
      // **bold** -> *bold* (debe ir antes de cualquier limpieza de *)
      .replace(/\*\*(.+?)\*\*/g, '*$1*')
      // ~~strikethrough~~ -> ~strikethrough~
      .replace(/~~(.+?)~~/g, '~$1~')
      // [text](url) -> text: url (WhatsApp no soporta links markdown)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1: $2')
      // Limpiar headers markdown residuales (### Header -> Header)
      .replace(/^#{1,3}\s+/gm, '')
  );
}

/**
 * Divide un mensaje largo en burbujas separadas para WhatsApp.
 * Solo divide si el mensaje supera un umbral de longitud.
 *
 * Reglas:
 * - Divide por parrafos (doble salto de linea)
 * - Solo si > minLengthToSplit caracteres
 * - Maximo maxBubbles mensajes
 * - Fusiona segmentos muy cortos con el anterior
 */
export function splitIntoBubbles(
  text: string,
  options?: {
    minLengthToSplit?: number;
    maxBubbles?: number;
    minSegmentLength?: number;
  }
): string[] {
  const { minLengthToSplit = 300, maxBubbles = 3, minSegmentLength = 40 } = options || {};

  // No dividir mensajes cortos
  if (text.length <= minLengthToSplit) {
    return [text];
  }

  const rawSegments = text.split(/\n\n+/).filter(s => s.trim().length > 0);

  // Si solo hay 1 segmento, no dividir
  if (rawSegments.length <= 1) {
    return [text];
  }

  // Fusionar segmentos muy cortos con el anterior
  const merged: string[] = [];
  for (const segment of rawSegments) {
    if (merged.length > 0 && segment.trim().length < minSegmentLength) {
      merged[merged.length - 1] += '\n\n' + segment;
    } else {
      merged.push(segment.trim());
    }
  }

  // Limitar a maxBubbles fusionando los ultimos
  while (merged.length > maxBubbles) {
    const last = merged.pop();
    if (!last) break;
    merged[merged.length - 1] += '\n\n' + last;
  }

  return merged;
}
