# 📸 Sistema de Gestión de Imágenes y Vídeos

## 🎯 Flujo de Trabajo Simple

### 1. **Subir imágenes originales**
Coloca tus fotos originales (JPG/PNG de alta resolución) en la carpeta `raw/`:

```
public/images/classes/
  dancehall/
    raw/
      dancehall-classes-barcelona-01.jpg  ← Sube aquí
      dancehall-dance-students-02.jpg     ← Sube aquí
      dancehall-dancing-barcelona-03.jpg  ← Sube aquí
```

### 2. **Ejecutar el script de optimización**
El script genera automáticamente todas las versiones optimizadas:

```bash
npm run build:images
```

Esto crea en la carpeta `img/`:
- 3 tamaños por imagen: 640px, 960px, 1440px
- 2 formatos: WebP (moderno) + JPEG (fallback)
- ✅ Total: 18 archivos optimizados desde 3 originales

**Resultado**: Imágenes 300x más ligeras (de 30MB → 100KB) 🚀

### 3. **Usar en React**

#### Imagen simple:
```tsx
import ResponsiveImage from "@/components/ResponsiveImage";

<ResponsiveImage
  basePath="/images/classes/dancehall/img/dancehall-classes-barcelona-01"
  alt="Clases de Dancehall en Barcelona - Estudiantes bailando en Farray's Center"
  widths={[640, 960, 1440]}
  aspectRatio="4/5"
/>
```

#### Vídeo lazy-loaded:
```tsx
import SmartVideo from "@/components/SmartVideo";

<SmartVideo
  embed="https://www.youtube.com/embed/VIDEO_ID"
  poster="/images/classes/dancehall/img/dancehall-classes-barcelona-01_960.jpg"
/>
```

## 📐 Dimensiones Recomendadas

### Hero / Portadas (16:9)
- 640px, 1280px, 1920px
- Peso objetivo: ≤ 300 KB (1920px)

### Cards / Miniaturas (1:1 o 4:5)
- 480px, 960px, 1440px
- Peso objetivo: ≤ 150 KB (1440px)

### Verticales (3:4)
- 640px, 960px, 1440px
- Peso objetivo: ≤ 200 KB (1440px)

## 🌍 SEO Multiidioma

Los textos ALT están en los archivos i18n:

```typescript
// i18n/locales/es.ts
dancehallImage1Alt: "Clases de Dancehall en Barcelona - Estudiantes bailando..."

// i18n/locales/en.ts
dancehallImage1Alt: "Dancehall Classes in Barcelona - Students dancing..."

// i18n/locales/ca.ts
dancehallImage1Alt: "Classes de Dancehall a Barcelona - Estudiants ballant..."

// i18n/locales/fr.ts
dancehallImage1Alt: "Cours de Dancehall à Barcelone - Étudiants dansant..."
```

Uso en componente:
```tsx
import { useTranslation } from "@/i18n";

const { t } = useTranslation();

<ResponsiveImage
  basePath="/images/classes/dancehall/img/dancehall-classes-barcelona-01"
  alt={t("dancehallImage1Alt")}
/>
```

## 🎬 Vídeos: Recomendaciones

### Opción 1: YouTube/Vimeo (Recomendado)
- Sube a YouTube (no listado) o Vimeo
- Usa el componente SmartVideo con `embed`
- ✅ Sin coste de almacenamiento/bandwidth

### Opción 2: Cloudflare Stream
- Para vídeos propios sin anuncios
- Mejor rendimiento que self-hosting
- Integración simple con SmartVideo

### Opción 3: Self-host (solo clips cortos)
- Codifica H.264 MP4 + WebM VP9
- Máximo 15-20 MB por vídeo
- Usa preload="metadata"

## 🔄 Añadir Nueva Clase

1. **Crear estructura de carpetas:**
```bash
mkdir -p public/images/classes/nueva-clase/raw
mkdir -p public/images/classes/nueva-clase/img
mkdir -p public/images/classes/nueva-clase/video
```

2. **Añadir al script:**
```javascript
// scripts/build-images.mjs
const classes = ["dancehall", "nueva-clase"]; // ← añade aquí
```

3. **Añadir textos i18n:**
```typescript
// En los 4 archivos: es.ts, en.ts, ca.ts, fr.ts
nuevaClaseImage1Alt: "Descripción en [idioma]...",
nuevaClaseImage2Alt: "Descripción en [idioma]...",
```

4. **Ejecutar optimización:**
```bash
npm run build:images
```

## 📊 Beneficios del Sistema

✅ **Rendimiento**: Imágenes 300x más ligeras
✅ **SEO**: Alt texts en 4 idiomas
✅ **Responsive**: Tamaños adaptativos automáticos
✅ **Modernos**: WebP/AVIF con fallback JPEG
✅ **Lazy Loading**: Carga solo cuando se ve
✅ **Sin CLS**: `aspect-ratio` reserva el espacio
✅ **Mantenible**: Script automatizado

## 🚀 Deploy en Vercel

El build automático incluye la optimización:

```json
{
  "scripts": {
    "build": "npm run build:images && vite build && node prerender.mjs"
  }
}
```

Las imágenes se cachean agresivamente (opcional en vercel.json):

```json
{
  "headers": [{
    "source": "/(.*)\\.(webp|jpg|jpeg|png)$",
    "headers": [{
      "key": "Cache-Control",
      "value": "public, max-age=31536000, immutable"
    }]
  }]
}
```

---

¿Preguntas? Revisa los componentes:
- [ResponsiveImage.tsx](../../src/components/ResponsiveImage.tsx)
- [SmartVideo.tsx](../../src/components/SmartVideo.tsx)
- [build-images.mjs](../../scripts/build-images.mjs)
