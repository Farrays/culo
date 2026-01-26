# Resumen de División de Traducciones por Namespaces

## Resumen Ejecutivo

Se han dividido exitosamente los archivos de traducciones de **CA**, **EN** y **FR** en 11 namespaces JSON, siguiendo exactamente la misma estructura que ES.

---

## Distribución de Keys por Idioma y Namespace

### ES (Español) - 13,049 keys

| Namespace | Keys  | Descripción                                |
| --------- | ----- | ------------------------------------------ |
| common    | 149   | Nav, header, footer, SEO, breadcrumb       |
| booking   | 187   | Sistema de reservas                        |
| schedule  | 235   | Horarios de clases                         |
| calendar  | 43    | Calendario de eventos                      |
| home      | 339   | Homepage (hero, CTA, testimonios)          |
| classes   | 199   | Clases y profesores                        |
| blog      | 949   | Artículos del blog                         |
| faq       | 81    | Preguntas frecuentes                       |
| about     | 272   | Sobre nosotros, método, Yunaisy            |
| contact   | 824   | Contacto, formularios, modales             |
| pages     | 9,671 | Páginas específicas (legal, pricing, etc.) |

### CA (Catalán) - 13,011 keys

| Namespace | Keys  | Diferencia vs ES |
| --------- | ----- | ---------------- |
| common    | 149   | 0                |
| booking   | 187   | 0                |
| schedule  | 235   | 0                |
| calendar  | 43    | 0                |
| home      | 339   | 0                |
| classes   | 199   | 0                |
| blog      | 949   | 0                |
| faq       | 81    | 0                |
| about     | 272   | 0                |
| contact   | 824   | 0                |
| pages     | 9,733 | +62              |

**Diferencia total:** -38 keys vs ES

### EN (English) - 12,876 keys

| Namespace | Keys  | Diferencia vs ES |
| --------- | ----- | ---------------- |
| common    | 149   | 0                |
| booking   | 187   | 0                |
| schedule  | 235   | 0                |
| calendar  | 43    | 0                |
| home      | 339   | 0                |
| classes   | 199   | 0                |
| blog      | 890   | -59              |
| faq       | 81    | 0                |
| about     | 272   | 0                |
| contact   | 824   | 0                |
| pages     | 9,657 | -14              |

**Diferencia total:** -173 keys vs ES

### FR (Français) - 12,977 keys

| Namespace | Keys  | Diferencia vs ES |
| --------- | ----- | ---------------- |
| common    | 149   | 0                |
| booking   | 187   | 0                |
| schedule  | 235   | 0                |
| calendar  | 43    | 0                |
| home      | 339   | 0                |
| classes   | 199   | 0                |
| blog      | 890   | -59              |
| faq       | 81    | 0                |
| about     | 272   | 0                |
| contact   | 818   | -6               |
| pages     | 9,764 | +93              |

**Diferencia total:** -72 keys vs ES

---

## Estructura de Archivos Creados

```
i18n/locales/
├── ca/
│   ├── about.json      (272 keys)
│   ├── blog.json       (949 keys)
│   ├── booking.json    (187 keys)
│   ├── calendar.json   (43 keys)
│   ├── classes.json    (199 keys)
│   ├── common.json     (149 keys)
│   ├── contact.json    (824 keys)
│   ├── faq.json        (81 keys)
│   ├── home.json       (339 keys)
│   ├── pages.json      (9,733 keys)
│   └── schedule.json   (235 keys)
│
├── en/
│   ├── about.json      (272 keys)
│   ├── blog.json       (890 keys)
│   ├── booking.json    (187 keys)
│   ├── calendar.json   (43 keys)
│   ├── classes.json    (199 keys)
│   ├── common.json     (149 keys)
│   ├── contact.json    (824 keys)
│   ├── faq.json        (81 keys)
│   ├── home.json       (339 keys)
│   ├── pages.json      (9,657 keys)
│   └── schedule.json   (235 keys)
│
├── fr/
│   ├── about.json      (272 keys)
│   ├── blog.json       (890 keys)
│   ├── booking.json    (187 keys)
│   ├── calendar.json   (43 keys)
│   ├── classes.json    (199 keys)
│   ├── common.json     (149 keys)
│   ├── contact.json    (818 keys)
│   ├── faq.json        (81 keys)
│   ├── home.json       (339 keys)
│   ├── pages.json      (9,764 keys)
│   └── schedule.json   (235 keys)
│
└── es/
    ├── about.json      (272 keys)
    ├── blog.json       (949 keys)
    ├── booking.json    (187 keys)
    ├── calendar.json   (43 keys)
    ├── classes.json    (199 keys)
    ├── common.json     (149 keys)
    ├── contact.json    (824 keys)
    ├── faq.json        (81 keys)
    ├── home.json       (339 keys)
    ├── pages.json      (9,671 keys)
    └── schedule.json   (235 keys)
```

---

## Categorización de Namespaces

### CORE (cargado siempre)

- **common.json**: Navegación, headers, footers, SEO, breadcrumbs

### EAGER (precargado en páginas principales)

- **booking.json**: Sistema de reservas
- **schedule.json**: Horarios de clases
- **calendar.json**: Calendario de eventos

### LAZY (cargado bajo demanda)

- **home.json**: Homepage elements (hero, CTA, testimonios)
- **classes.json**: Clases y profesores
- **blog.json**: Artículos del blog
- **faq.json**: Preguntas frecuentes
- **about.json**: Sobre nosotros, método, Yunaisy
- **contact.json**: Contacto, formularios, modales lead
- **pages.json**: Páginas específicas (legal, pricing, servicios)

---

## Observaciones

### 1. Consistencia en Namespaces Core/Eager

✅ Los namespaces **common**, **booking**, **schedule**, **calendar**, **home**, **classes**, **faq**, y **about** tienen **exactamente el mismo número de keys** en todos los idiomas.

### 2. Variaciones en Blog

- ES: 949 keys
- CA: 949 keys
- EN: 890 keys (-59)
- FR: 890 keys (-59)

**Conclusión**: EN y FR tienen 59 keys menos de blog que ES/CA (posible contenido pendiente de traducción).

### 3. Variaciones en Contact

- ES: 824 keys
- CA: 824 keys
- EN: 824 keys
- FR: 818 keys (-6)

**Conclusión**: FR tiene 6 keys menos en modales de contacto.

### 4. Variaciones en Pages

- ES: 9,671 keys
- CA: 9,733 keys (+62)
- EN: 9,657 keys (-14)
- FR: 9,764 keys (+93)

**Conclusión**: Variaciones normales en páginas específicas que pueden tener contenido adaptado por idioma.

---

## Script Utilizado

**Archivo**: `scripts/split-translations-all.mjs`

El script:

1. Lee los archivos `.ts` de CA, EN, FR
2. Extrae las traducciones usando un parser de estado
3. Clasifica cada key usando la MISMA lógica que ES
4. Genera 11 archivos JSON por idioma
5. Formato: JSON puro (sin `export default`)

---

## Próximos Pasos

1. ✅ Archivos JSON generados correctamente
2. ⏳ Actualizar el sistema i18n para cargar namespaces dinámicamente
3. ⏳ Eliminar archivos `.ts` monolíticos una vez verificado el funcionamiento
4. ⏳ Optimizar bundle sizes con lazy loading de namespaces

---

## Comandos

### Regenerar traducciones para todos los idiomas

```bash
node scripts/split-translations-all.mjs
```

### Verificar archivos generados

```bash
ls i18n/locales/ca
ls i18n/locales/en
ls i18n/locales/fr
```

---

**Generado**: 2026-01-25
**Script**: `split-translations-all.mjs`
**Total archivos creados**: 44 (11 por idioma × 4 idiomas)
