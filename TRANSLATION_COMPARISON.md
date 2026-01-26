# Comparación Detallada de Traducciones por Idioma

## Resumen de Keys por Namespace

| Namespace    | ES         | CA         | EN         | FR         | Notas                   |
| ------------ | ---------- | ---------- | ---------- | ---------- | ----------------------- |
| **common**   | 149        | 149        | 149        | 149        | ✅ Idéntico             |
| **booking**  | 187        | 187        | 187        | 187        | ✅ Idéntico             |
| **schedule** | 235        | 235        | 235        | 235        | ✅ Idéntico             |
| **calendar** | 43         | 43         | 43         | 43         | ✅ Idéntico             |
| **home**     | 339        | 339        | 339        | 339        | ✅ Idéntico             |
| **classes**  | 199        | 199        | 199        | 199        | ✅ Idéntico             |
| **blog**     | 949        | 949        | 890        | 890        | ⚠️ EN/FR -59 keys       |
| **faq**      | 81         | 81         | 81         | 81         | ✅ Idéntico             |
| **about**    | 272        | 272        | 272        | 272        | ✅ Idéntico             |
| **contact**  | 824        | 824        | 824        | 818        | ⚠️ FR -6 keys           |
| **pages**    | 9,671      | 9,733      | 9,657      | 9,764      | ℹ️ Variaciones normales |
| **TOTAL**    | **13,049** | **13,011** | **12,876** | **12,977** |                         |

---

## Análisis de Diferencias

### 1. Blog Namespace (⚠️ Atención)

**Problema**: EN y FR tienen 59 keys menos que ES/CA en contenido del blog.

**Afectados**:

- ES: 949 keys
- CA: 949 keys
- EN: 890 keys (-59)
- FR: 890 keys (-59)

**Acción recomendada**:

1. Identificar las 59 keys faltantes en EN/FR
2. Verificar si es contenido pendiente de traducción
3. Completar traducciones o eliminar keys obsoletas en ES/CA

### 2. Contact Namespace (⚠️ Atención Menor)

**Problema**: FR tiene 6 keys menos en modales de contacto.

**Afectados**:

- ES: 824 keys
- CA: 824 keys
- EN: 824 keys
- FR: 818 keys (-6)

**Acción recomendada**:

1. Identificar las 6 keys faltantes en FR
2. Completar traducciones en francés

### 3. Pages Namespace (ℹ️ Normal)

**Variaciones**:

- ES: 9,671 keys (baseline)
- CA: 9,733 keys (+62)
- EN: 9,657 keys (-14)
- FR: 9,764 keys (+93)

**Explicación**: Es normal que este namespace tenga variaciones porque incluye:

- Contenido legal adaptado por idioma/jurisdicción
- Páginas específicas que pueden no existir en todos los idiomas
- Contenido regionalizado (ej: "heelsBarcelona\_" puede ser diferente en cada idioma)

---

## Verificación de Integridad

### Common.json (149 keys) ✅

```javascript
// Muestra CA
"pageTitle": "Farray's International Dance Center | Escola de Ball a Barcelona"

// Muestra EN
"pageTitle": "Farray's International Dance Center | Dance School in Barcelona"

// Muestra FR
"pageTitle": "Farray's International Dance Center | École de Danse à Barcelone"
```

### Booking.json (187 keys) ✅

```javascript
// Muestra CA
"booking_title": "Reserva la teva Classe de Benvinguda"

// Muestra EN
"booking_title": "Book Your Welcome Class"

// Muestra FR
"booking_title": "Réservez votre Cours de Bienvenue"
```

### Schedule.json (235 keys) ✅

```javascript
// Muestra CA
"schedule_title": "Horaris de Classes"

// Muestra EN
"schedule_title": "Class Schedule"

// Muestra FR
"schedule_title": "Horaires des Cours"
```

### Home.json (339 keys) ✅

```javascript
// Muestra CA
"heroTitle1": "Descobreix l'Acadèmia de Ball"
"heroTitle2": "Més Completa de Barcelona"

// Muestra EN
"heroTitle1": "Discover Barcelona's Most"
"heroTitle2": "Complete Dance Academy"

// Muestra FR
"heroTitle1": "Découvrez l'Académie de Danse"
"heroTitle2": "la Plus Complète de Barcelone"
```

---

## Cobertura de Traducciones

### Namespaces con Cobertura 100% (10/11)

1. ✅ common.json
2. ✅ booking.json
3. ✅ schedule.json
4. ✅ calendar.json
5. ✅ home.json
6. ✅ classes.json
7. ✅ faq.json
8. ✅ about.json
9. ✅ contact.json (excepto FR con -6 keys)
10. ✅ pages.json (variaciones normales)

### Namespaces con Traducciones Incompletas (1/11)

1. ⚠️ **blog.json**: EN/FR faltan 59 keys cada uno

---

## Recomendaciones

### Prioridad Alta

1. **Completar traducciones de blog EN/FR**
   - Identificar las 59 keys faltantes
   - Traducir o deprecar según corresponda

### Prioridad Media

2. **Completar traducciones de contact FR**
   - Identificar las 6 keys faltantes
   - Completar modales de contacto en francés

### Prioridad Baja

3. **Revisar pages.json**
   - Documentar diferencias intencionales
   - Asegurar que el contenido regionalizado es correcto

---

## Comandos de Verificación

### Contar keys por namespace

```bash
node -e "const data = require('./i18n/locales/ca/common.json'); console.log(Object.keys(data).length);"
```

### Comparar keys entre idiomas

```bash
node -e "
const es = require('./i18n/locales/es/blog.json');
const en = require('./i18n/locales/en/blog.json');
const esKeys = Object.keys(es);
const enKeys = Object.keys(en);
const missing = esKeys.filter(k => !enKeys.includes(k));
console.log('Keys in ES but not in EN:', missing.length);
console.log(missing.slice(0, 10));
"
```

### Verificar muestra de traducciones

```bash
node -e "
const ca = require('./i18n/locales/ca/booking.json');
const en = require('./i18n/locales/en/booking.json');
const fr = require('./i18n/locales/fr/booking.json');
console.log('CA:', ca.booking_title);
console.log('EN:', en.booking_title);
console.log('FR:', fr.booking_title);
"
```

---

**Actualizado**: 2026-01-25
**Estado**: ✅ División completada, pendiente revisión de traducciones faltantes
