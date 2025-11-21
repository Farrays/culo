# 📖 Ejemplo de Uso: Página Dancehall

## Cómo usar las imágenes optimizadas en tus páginas

### Ejemplo completo de una página de clase

```tsx
// src/pages/Dancehall.tsx
import React from "react";
import ResponsiveImage from "@/components/ResponsiveImage";
import SmartVideo from "@/components/SmartVideo";
import { useTranslation } from "@/i18n"; // o tu sistema de i18n

export default function DancehallPage() {
  const { t } = useTranslation();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight">
          {t("dancehallHeroTitle")}
        </h1>
        <p className="text-white/80 mt-2">
          {t("dancehallHeroSubtitle")}
        </p>
      </header>

      {/* Imagen Hero Principal */}
      <ResponsiveImage
        basePath="/images/classes/dancehall/img/dancehall-classes-barcelona-01"
        alt={t("dancehallImage1Alt")}
        widths={[640, 960, 1440]}
        aspectRatio="4/5"
        className="rounded-2xl overflow-hidden shadow-2xl"
      />

      {/* Galería de 3 imágenes */}
      <section className="grid md:grid-cols-3 gap-6 mt-12">
        <ResponsiveImage
          basePath="/images/classes/dancehall/img/dancehall-classes-barcelona-01"
          alt={t("dancehallImage1Alt")}
          widths={[640, 960, 1440]}
          aspectRatio="4/5"
          className="rounded-xl overflow-hidden hover:scale-105 transition-transform"
        />

        <ResponsiveImage
          basePath="/images/classes/dancehall/img/dancehall-dance-students-02"
          alt={t("dancehallImage2Alt")}
          widths={[640, 960, 1440]}
          aspectRatio="4/5"
          className="rounded-xl overflow-hidden hover:scale-105 transition-transform"
        />

        <ResponsiveImage
          basePath="/images/classes/dancehall/img/dancehall-dancing-barcelona-03"
          alt={t("dancehallImage3Alt")}
          widths={[640, 960, 1440]}
          aspectRatio="4/5"
          className="rounded-xl overflow-hidden hover:scale-105 transition-transform"
        />
      </section>

      {/* Sección de texto */}
      <section className="my-12 prose prose-invert max-w-none">
        <h2>{t("dancehallAboutTitle")}</h2>
        <p>{t("dancehallAboutDesc1")}</p>
        <p>{t("dancehallAboutDesc2")}</p>
      </section>

      {/* Vídeo embebido (YouTube/Vimeo) */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">{t("dancehallVideoTitle")}</h2>
        <SmartVideo
          embed="https://www.youtube.com/embed/YOUR_VIDEO_ID"
          poster="/images/classes/dancehall/img/dancehall-classes-barcelona-01_960.jpg"
          className="max-w-4xl mx-auto"
        />
      </section>

      {/* CTA final */}
      <section className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">{t("dancehallCtaTitle")}</h2>
        <button className="bg-gradient-to-r from-red-600 to-pink-600 px-8 py-3 rounded-full font-bold">
          {t("enrollNow")}
        </button>
      </section>
    </main>
  );
}
```

## Casos de uso específicos

### 1. Card de clase en listado
```tsx
function ClassCard({ slug, titleKey, imageIndex }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition">
      <ResponsiveImage
        basePath={`/images/classes/${slug}/img/${slug}-classes-barcelona-0${imageIndex}`}
        alt={t(`${slug}Image${imageIndex}Alt`)}
        widths={[480, 960]}
        aspectRatio="1/1"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold">{t(titleKey)}</h3>
      </div>
    </div>
  );
}
```

### 2. Hero de página principal (16:9)
```tsx
<ResponsiveImage
  basePath="/images/hero/main-hero"
  alt={t("heroImageAlt")}
  widths={[640, 1280, 1920]}
  aspectRatio="16/9"
  className="w-full h-auto"
/>
```

### 3. Vídeo self-hosted (corto)
```tsx
<SmartVideo
  mp4="/images/classes/dancehall/video/intro-clip.mp4"
  webm="/images/classes/dancehall/video/intro-clip.webm"
  poster="/images/classes/dancehall/img/dancehall-classes-barcelona-01_1280.jpg"
  captionsVtt="/subtitles/dancehall-intro-es.vtt"
/>
```

### 4. Lightbox / Modal con imagen grande
```tsx
function ImageModal({ isOpen, onClose, imageBase, alt }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <ResponsiveImage
        basePath={imageBase}
        alt={alt}
        widths={[960, 1440]}
        aspectRatio="4/5"
        className="max-w-full max-h-full"
      />
      <button onClick={onClose} className="absolute top-4 right-4 text-white">
        ✕
      </button>
    </div>
  );
}
```

## Props de ResponsiveImage

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `basePath` | `string` | ✅ | - | Ruta base sin extensión ni tamaño (ej: "/images/classes/dancehall/img/dancehall-classes-barcelona-01") |
| `alt` | `string` | ✅ | - | Texto alternativo para SEO y accesibilidad |
| `widths` | `number[]` | ❌ | `[640, 960, 1440]` | Tamaños disponibles (deben existir los archivos) |
| `aspectRatio` | `string` | ❌ | `"4/5"` | Ratio CSS para evitar CLS (ej: "16/9", "1/1", "4/5") |
| `className` | `string` | ❌ | - | Classes de Tailwind/CSS |

## Props de SmartVideo

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `embed` | `string` | ❌ | - | URL de iframe (YouTube/Vimeo) |
| `mp4` | `string` | ❌ | - | Ruta a archivo MP4 (self-host) |
| `webm` | `string` | ❌ | - | Ruta a archivo WebM (self-host) |
| `poster` | `string` | ❌ | - | Imagen preview antes de reproducir |
| `captionsVtt` | `string` | ❌ | - | Subtítulos en formato VTT |
| `className` | `string` | ❌ | - | Classes de Tailwind/CSS |

## Flujo completo para añadir nuevas imágenes

1. **Sube las originales a `/raw`**
   ```bash
   public/images/classes/bachata/raw/
     bachata-sensual-01.jpg
     bachata-dominicana-02.jpg
   ```

2. **Actualiza el script** (añade "bachata" al array)
   ```js
   // scripts/build-images.mjs
   const classes = ["dancehall", "bachata"];
   ```

3. **Ejecuta la optimización**
   ```bash
   npm run build:images
   ```

4. **Añade los alt texts** (en los 4 idiomas)
   ```ts
   // i18n/locales/es.ts
   bachataImage1Alt: "Clase de Bachata Sensual en Farray's Center Barcelona",
   bachataImage2Alt: "Estudiantes practicando Bachata Dominicana",
   ```

5. **Usa en tu componente**
   ```tsx
   <ResponsiveImage
     basePath="/images/classes/bachata/img/bachata-sensual-01"
     alt={t("bachataImage1Alt")}
   />
   ```

## Verificar que todo funciona

1. **Build de producción:**
   ```bash
   npm run build
   ```

2. **Preview local:**
   ```bash
   npm run preview
   ```

3. **Inspecciona en DevTools:**
   - Network tab: verifica que carga WebP en navegadores modernos
   - Elements: verifica el `srcset` y `<picture>` tag
   - Lighthouse: debería dar 100/100 en Performance

## Troubleshooting

### ❌ Error: "Cannot find module 'sharp'"
```bash
npm install -D sharp --legacy-peer-deps
```

### ❌ Imágenes no se ven
- Verifica que el path es correcto (sin `/public` en el basePath)
- Asegúrate de haber ejecutado `npm run build:images`
- Verifica que los archivos existen en `/img`

### ❌ CLS (Layout Shift)
- Siempre usa `aspectRatio` que coincida con tus imágenes
- Inspecciona las dimensiones reales: `identify imagen.jpg` (ImageMagick)

### ❌ Vídeo no carga
- Si es YouTube: verifica que la URL tiene `/embed/` no `/watch?v=`
- Si es self-host: verifica que los archivos están en `public/`

---

🎉 ¡Ya tienes todo listo para gestionar imágenes y vídeos como un pro!
