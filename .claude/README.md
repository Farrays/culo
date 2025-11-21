# 📚 Documentación del Proyecto - Farray's Dance Center

Bienvenido a la documentación completa del sistema de desarrollo para el sitio web de Farray's International Dance Center. Este sistema está diseñado para trabajar de forma **segura, rápida y escalable** con Claude Code y VSCode.

---

## 🎯 Objetivo del Sistema

**Crear y mantener páginas de clases de baile de forma eficiente:**
1. ✅ **Sin romper producción** → Trabajo aislado en ramas
2. ✅ **Con preview antes de deploy** → Vercel genera URLs temporales
3. ✅ **Usando plantillas** → Generar páginas automáticamente
4. ✅ **Con calidad 10/10** → SEO, performance, i18n, accesibilidad

---

## 📂 Estructura de la Documentación

### **1. [WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md)** - Guía Completa de Flujo de Trabajo
**¿Para qué?** Aprender el flujo de trabajo Git + Vercel desde cero.

**Contenido:**
- Cómo crear ramas de trabajo
- Cómo hacer commits y push
- Cómo abrir Pull Requests (PRs)
- Cómo revisar Vercel Previews
- Cómo mergear a producción
- Cómo revertir cambios si algo sale mal
- Troubleshooting de problemas comunes

**Cuándo usarlo:**
- 📖 Primera vez trabajando con este sistema
- 🔄 Cuando olvidas cómo se hace algo
- 🆘 Cuando algo sale mal y no sabes qué hacer

---

### **2. [PROMPT_TEMPLATES.md](./PROMPT_TEMPLATES.md)** - Plantillas de Instrucciones para Claude
**¿Para qué?** Instrucciones listas para copiar y pegar cuando trabajas con Claude Code.

**Contenido:**
- 🆕 Crear nueva página de clase
- 🎨 Personalizar contenido (textos, imágenes, FAQs)
- 🐛 Corregir errores (TypeScript, SEO, responsive)
- 🔗 Añadir enlaces internos
- 🎯 Optimización SEO avanzada
- 🧪 Testing y QA
- 🚀 Deployment y PRs
- 🔄 Mantenimiento
- 🆘 Troubleshooting

**Cuándo usarlo:**
- 🤖 Cada vez que necesites pedirle algo a Claude Code
- ✍️ Para que Claude sepa exactamente qué hacer y qué NO tocar
- 📋 Para mantener consistencia en todas las páginas

---

### **3. [QA_CHECKLIST.md](./QA_CHECKLIST.md)** - Checklist de Calidad Pre-Deploy
**¿Para qué?** Asegurar que cada cambio cumple con todos los estándares antes de mergear a producción.

**Contenido:**
- ✅ Funcionalidad básica
- 📱 Responsive design (Mobile/Tablet/Desktop)
- 🔍 SEO completo (meta tags, Open Graph, hreflang)
- 📊 Datos estructurados (Schema.org)
- ⚡ Performance (Lighthouse)
- 🖼️ Imágenes optimizadas
- 🌍 Internacionalización (4 idiomas)
- 🔗 Enlaces internos
- 📝 Contenido de calidad
- 💻 Código limpio
- 🔧 Git y PRs

**Cuándo usarlo:**
- 🚀 Antes de mergear CADA PR
- 🧪 Después de hacer cambios significativos
- 📊 Para verificar que todo está 10/10

---

### **4. [../EJEMPLO_USO_IMAGENES.md](../EJEMPLO_USO_IMAGENES.md)** - Guía de Imágenes
**¿Para qué?** Aprender a usar el sistema de imágenes optimizadas.

**Contenido:**
- Cómo usar ResponsiveImage component
- Cómo usar SmartVideo component
- Flujo completo para añadir nuevas imágenes
- Props disponibles
- Troubleshooting de imágenes

**Cuándo usarlo:**
- 🖼️ Cuando añadas nuevas imágenes a una página
- 📐 Cuando necesites entender los tamaños y aspect ratios
- 🔧 Cuando las imágenes no se vean correctamente

---

## 🚀 Inicio Rápido

### **Para crear una nueva página de clase:**

```bash
# 1. Generar la página automáticamente
npm run create:class -- --name=bachata --instructor="Carlos Martínez" --specialty="Bachata Sensual"

# 2. Seguir los pasos del output:
#    - Copiar claves i18n
#    - Subir 3 imágenes
#    - Ejecutar npm run build:images
#    - Personalizar textos

# 3. Probar localmente
npm run dev

# 4. Crear rama y PR
git checkout -b feat/bachata-page
git add .
git commit -m "feat: Add Bachata class page"
git push -u origin feat/bachata-page

# 5. Abrir PR en GitHub, revisar preview de Vercel, mergear
```

**Documentación detallada:**
- Script generador: [PROMPT_TEMPLATES.md - Sección 8.2](./PROMPT_TEMPLATES.md#82-añadir-nueva-clase-rápido)
- Workflow completo: [WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md)

---

### **Para actualizar contenido existente:**

```bash
# 1. Crear rama
git checkout -b content/dancehall-update

# 2. Pedir a Claude Code (usando plantillas de PROMPT_TEMPLATES.md):
# "Actualiza los textos de la página Dancehall siguiendo la plantilla 2.1"

# 3. Revisar cambios
git diff

# 4. Commit y push
git add .
git commit -m "content: Update Dancehall page texts"
git push -u origin content/dancehall-update

# 5. PR → Preview → Merge
```

**Documentación detallada:**
- Plantillas de instrucciones: [PROMPT_TEMPLATES.md - Sección 2](./PROMPT_TEMPLATES.md#-2-personalizar-contenido-de-una-página-existente)
- Workflow: [WORKFLOW_GUIDE.md - Sección 2-8](./WORKFLOW_GUIDE.md)

---

## 📖 Comandos Útiles

### **Desarrollo:**
```bash
npm run dev              # Servidor de desarrollo (http://localhost:5173)
npm run build            # Build de producción
npm run preview          # Preview del build local (http://localhost:4173)
npm run typecheck        # Verificar errores de TypeScript
npm run lint             # Verificar errores de ESLint
npm run format           # Formatear código con Prettier
```

### **Imágenes:**
```bash
npm run build:images     # Optimizar todas las imágenes (WebP + JPG)
```

### **Generación de páginas:**
```bash
npm run create:class     # Modo interactivo
npm run create:class -- --name=salsa --instructor="Ana" --specialty="Salsa Cubana"
```

### **Git:**
```bash
git status                                    # Ver archivos modificados
git diff                                      # Ver cambios línea por línea
git checkout -b feat/nueva-funcionalidad      # Crear nueva rama
git add .                                     # Añadir todos los cambios
git commit -m "feat: mensaje descriptivo"    # Hacer commit
git push -u origin feat/nueva-funcionalidad   # Push a GitHub (primera vez)
git push                                      # Push (después de la primera vez)
```

---

## 📁 Estructura del Proyecto

```
web/
├── .claude/                           # 📚 Documentación (ESTE DIRECTORIO)
│   ├── README.md                      # Índice principal
│   ├── WORKFLOW_GUIDE.md              # Flujo de trabajo Git + Vercel
│   ├── PROMPT_TEMPLATES.md            # Instrucciones para Claude Code
│   ├── QA_CHECKLIST.md                # Checklist de calidad
│   └── i18n-{clase}-template.txt      # Plantillas i18n generadas
│
├── components/                        # Componentes React
│   ├── DancehallPage.tsx              # Página de Dancehall (PLANTILLA)
│   ├── AfrobeatsPage.tsx              # Página de Afrobeats
│   ├── BachataPage.tsx                # (ejemplo: página generada)
│   ├── Header.tsx                     # Menú de navegación
│   ├── Footer.tsx                     # Footer
│   ├── FAQSection.tsx                 # Componente de FAQs
│   └── ...
│
├── i18n/locales/                      # Traducciones
│   ├── es.ts                          # Español
│   ├── en.ts                          # Inglés
│   ├── ca.ts                          # Catalán
│   └── fr.ts                          # Francés
│
├── public/images/classes/             # Imágenes de clases
│   ├── dancehall/
│   │   ├── raw/                       # Originales (sin optimizar)
│   │   └── img/                       # Optimizadas (WebP + JPG)
│   ├── afrobeats/
│   │   ├── raw/
│   │   └── img/
│   └── bachata/                       # (ejemplo)
│       ├── raw/
│       └── img/
│
├── scripts/                           # Scripts de automatización
│   ├── build-images.mjs               # Optimización de imágenes
│   └── create-class-page.mjs          # Generador de páginas
│
├── src/components/                    # Componentes reutilizables
│   ├── ResponsiveImage.tsx            # Imágenes responsive
│   └── SmartVideo.tsx                 # Videos optimizados
│
├── App.tsx                            # Router principal
├── package.json                       # Dependencias y scripts
├── vite.config.ts                     # Configuración de Vite
└── ...
```

---

## 🎓 Cómo Aprender el Sistema (Por Nivel)

### **Nivel 1: Principiante (nunca has usado Git/Vercel)**
1. Lee: [WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md) → Secciones 1-8
2. Practica: Crea una rama de prueba y haz un cambio pequeño (ej: typo en un texto)
3. Objetivo: Entender el flujo completo (rama → commit → push → PR → preview → merge)

### **Nivel 2: Intermedio (sabes Git básico, quieres trabajar más rápido)**
1. Usa: `npm run create:class` para generar una página nueva
2. Copia/pega instrucciones de: [PROMPT_TEMPLATES.md](./PROMPT_TEMPLATES.md)
3. Revisa con: [QA_CHECKLIST.md](./QA_CHECKLIST.md) antes de mergear
4. Objetivo: Crear una página completa en < 2 horas

### **Nivel 3: Avanzado (quieres dominar el sistema al 100%)**
1. Personaliza el script generador: [scripts/create-class-page.mjs](../scripts/create-class-page.mjs)
2. Crea tus propias plantillas de instrucciones para casos específicos
3. Configura protecciones de rama en GitHub (ver WORKFLOW_GUIDE.md - Sección "Protecciones")
4. Automatiza más: GitHub Actions para tests automáticos, etc.

---

## 🆘 Troubleshooting Rápido

### **❌ "Build falla"**
```bash
npm run typecheck  # Ver errores de TypeScript
npm run lint       # Ver errores de ESLint
```
→ Solución: Corregir los errores indicados

### **❌ "Imágenes no se ven"**
```bash
npm run build:images  # Regenerar imágenes
ls public/images/classes/{clase}/img  # Verificar que existen
```
→ Ver: [EJEMPLO_USO_IMAGENES.md - Troubleshooting](../EJEMPLO_USO_IMAGENES.md#troubleshooting)

### **❌ "Claude cambió archivos que no debía"**
```bash
git diff  # Ver qué cambió
git checkout -- archivo-no-deseado.ts  # Revertir archivo
```
→ Ver: [PROMPT_TEMPLATES.md - Troubleshooting 9.1](./PROMPT_TEMPLATES.md#91-claude-cambió-archivos-que-no-debía)

### **❌ "Preview de Vercel no funciona"**
1. Verificar que build local funciona: `npm run build`
2. Ver logs en el PR de GitHub → "Details" del check de Vercel
3. Corregir el error indicado en los logs

→ Ver: [PROMPT_TEMPLATES.md - Troubleshooting 9.2](./PROMPT_TEMPLATES.md#92-preview-de-vercel-no-funciona)

### **❌ "No sé qué hacer ahora"**
→ Vuelve a [WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md) y sigue los pasos del flujo

---

## 🎯 Principios del Sistema

1. **Nunca push directo a `main`** → Siempre trabaja en ramas
2. **Siempre revisa el preview de Vercel** → No confíes solo en local
3. **QA antes de mergear** → Usa la checklist SIEMPRE
4. **Commits pequeños y frecuentes** → Más fácil revertir si falla
5. **Instrucciones claras a Claude** → Lista qué puede y qué NO puede tocar
6. **Documenta cambios en el PR** → Tu yo del futuro te lo agradecerá

---

## 📚 Recursos Externos

### **Validadores:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- PageSpeed Insights: https://pagespeed.web.dev/
- W3C HTML Validator: https://validator.w3.org/
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

### **Documentación de herramientas:**
- React: https://react.dev/
- Vite: https://vitejs.dev/
- TailwindCSS: https://tailwindcss.com/docs
- Schema.org: https://schema.org/docs/schemas.html
- Git: https://git-scm.com/doc

### **Tutoriales:**
- Git Basics: https://www.atlassian.com/git/tutorials
- Vercel: https://vercel.com/docs

---

## 🎉 ¡Todo Listo!

Ahora tienes:
- ✅ **Sistema automatizado** para crear páginas (script generador)
- ✅ **Workflow seguro** (ramas + PRs + Vercel previews)
- ✅ **Plantillas de instrucciones** para Claude Code
- ✅ **Checklist de calidad** para mantener estándares 10/10
- ✅ **Documentación completa** para no perderte nunca

---

## 📞 Soporte

Si tienes dudas:
1. 🔍 Busca en esta documentación (usa Ctrl+F)
2. 📖 Lee la sección relevante en detalle
3. 🧪 Prueba en una rama de prueba primero
4. 🤖 Pregunta a Claude Code (con instrucciones claras)

---

**Versión:** 1.0.0
**Última actualización:** 2025-01-11
**Autor:** Sistema creado con Claude Code

🚀 **¡A crear páginas de baile increíbles!**
