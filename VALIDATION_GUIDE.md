# 🔍 Guía de Validación Google Rich Results Test

## ✅ Cambios Implementados

### 1. Meta Descriptions Optimizadas (< 160 caracteres)

| Página | Antes | Después | Reducción |
|--------|-------|---------|-----------|
| **Clases Particulares** | 178 chars | 124 chars | -54 chars ✅ |
| **About - Presente** | 218 chars | 124 chars | -94 chars ✅ |
| **Regala Baile** | 204 chars | 141 chars | -63 chars ✅ |

**Idiomas actualizados:** Español, Inglés, Catalán, Francés

### 2. VideoObject Schema Implementado

**Componente:** `components/YouTubeEmbed.tsx`

**Propiedades del schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Título del video",
  "description": "Descripción del video",
  "thumbnailUrl": ["https://i.ytimg.com/vi/{videoId}/maxresdefault.jpg"],
  "uploadDate": "2025-11-21",
  "duration": "PT5M",
  "embedUrl": "https://www.youtube.com/embed/{videoId}",
  "contentUrl": "https://www.youtube.com/watch?v={videoId}"
}
```

**Uso actualizado:**
```tsx
<YouTubeEmbed 
  videoId="dQw4w9WgXcQ"
  title="Clase de Dancehall"
  description="Aprende los fundamentos del Dancehall con Yunaisy Farray"
  uploadDate="2024-01-15"
  duration="PT10M30S"
/>
```

---

## 📋 Instrucciones de Validación

### Paso 1: Hacer Build de Producción

```powershell
# Construir el proyecto
npm run build

# Previsualizar localmente
npm run preview
```

### Paso 2: Desplegar en Vercel (Preview)

```bash
# Si no tienes cambios commiteados:
git add .
git commit -m "feat: optimize meta descriptions and add VideoObject schema"
git push

# Vercel generará automáticamente una URL de preview
# Ejemplo: https://web-local-git-main-fabio.vercel.app
```

### Paso 3: Validar con Google Rich Results Test

#### 🔗 **Herramienta:** https://search.google.com/test/rich-results

#### URLs a Validar:

1. **Página de Inicio**
   - `https://www.farrayscenter.com/es`
   - **Schema esperado:** Organization, LocalBusiness, BreadcrumbList

2. **Clases de Baile**
   - `https://www.farrayscenter.com/es/clases`
   - **Schema esperado:** BreadcrumbList, ItemList

3. **Dancehall (con video)**
   - `https://www.farrayscenter.com/es/clases/dancehall-barcelona`
   - **Schema esperado:** BreadcrumbList, VideoObject ✨

4. **About**
   - `https://www.farrayscenter.com/es/sobre-nosotros`
   - **Schema esperado:** Organization, BreadcrumbList

5. **Regala Baile**
   - `https://www.farrayscenter.com/es/regala-baile`
   - **Schema esperado:** BreadcrumbList, Product (opcional)

6. **Clases Particulares**
   - `https://www.farrayscenter.com/es/clases-particulares`
   - **Schema esperado:** BreadcrumbList, Service

---

## ✅ Checklist de Validación

### Por Cada URL:

- [ ] **Schema válido:** Sin errores en Google Rich Results Test
- [ ] **Meta description:** Aparece correctamente (< 160 caracteres)
- [ ] **Title tag:** Correcto y único por página
- [ ] **Canonical URL:** Presente y correcto
- [ ] **Open Graph:** Todas las propiedades presentes
- [ ] **Twitter Cards:** Configuradas correctamente
- [ ] **Hreflang:** 4 idiomas declarados (es/en/ca/fr)

### Específico para VideoObject:

- [ ] **thumbnailUrl válido:** Imagen carga correctamente
- [ ] **duration:** Formato ISO 8601 (PT#M#S)
- [ ] **uploadDate:** Formato ISO 8601 (YYYY-MM-DD)
- [ ] **embedUrl:** URL válida de YouTube embed
- [ ] **contentUrl:** URL válida de YouTube watch

---

## 🐛 Troubleshooting

### Error: "Missing required field"
**Solución:** Verificar que todas las propiedades obligatorias del schema estén presentes.

### Error: "Invalid URL"
**Solución:** Asegurarse de que las URLs sean absolutas (incluir `https://`).

### Error: "Invalid date format"
**Solución:** Usar formato ISO 8601: `YYYY-MM-DD` o `YYYY-MM-DDTHH:MM:SSZ`.

### Warning: "Recommended field missing"
**Acción:** Opcional, pero mejorar añadiendo campos recomendados como `author`, `publisher`, etc.

---

## 📊 Resultados Esperados

### ✅ **PASS** - Schema Válido
- Todos los schemas detectados correctamente
- Sin errores críticos
- Warnings opcionales permitidos

### ⚠️ **WARNING** - Mejorable
- Schema válido pero faltan campos recomendados
- **Acción:** Opcional mejorar

### ❌ **ERROR** - Requiere Corrección
- Schema inválido o propiedades faltantes
- **Acción:** Corregir antes de deploy a producción

---

## 🚀 Siguiente Paso

Una vez validado exitosamente:

```bash
# Mergear a main
git checkout main
git merge tu-rama
git push origin main

# Vercel desplegará automáticamente a producción
# URL final: https://www.farrayscenter.com
```

---

## 📝 Notas Adicionales

### VideoObject Schema - Mejores Prácticas

1. **Duration exacta:** Si conoces la duración exacta del video, úsala
   ```tsx
   duration="PT10M23S"  // 10 minutos 23 segundos
   ```

2. **Upload Date real:** Usa la fecha real de publicación del video
   ```tsx
   uploadDate="2024-06-15"
   ```

3. **Description descriptiva:** Añade una descripción SEO-friendly
   ```tsx
   description="Clase completa de Dancehall para principiantes con Yunaisy Farray en Barcelona"
   ```

### Meta Descriptions - Reglas de Oro

- ✅ **Máximo 155-160 caracteres**
- ✅ **Incluir palabra clave principal**
- ✅ **Call-to-action implícito**
- ✅ **Única por página (no duplicar)**
- ❌ **No usar comillas dobles** (usar simples)
- ❌ **No exceder caracteres** (Google truncará)

---

**Última actualización:** 21 Noviembre 2025  
**Versión:** 1.0
