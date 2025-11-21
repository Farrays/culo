import React from 'react';
type Props = {
  basePath: string; // ej. "/images/classes/dancehall/img/dancehall-classes-barcelona-01"
  alt: string;
  widths?: number[]; // ej. [640, 960, 1440]
  className?: string;
  aspectRatio?: string; // ej. "4/5" o "16/9" para reservar altura (evitar CLS)
};

export default function ResponsiveImage({
  basePath,
  alt,
  widths = [640, 960, 1440],
  className,
  aspectRatio = '4/5',
}: Props): React.ReactElement {
  const srcWebp = widths.map(w => `${basePath}_${w}.webp ${w}w`).join(', ');
  const srcJpg = widths.map(w => `${basePath}_${w}.jpg ${w}w`).join(', ');

  return (
    <picture className={className} style={{ display: 'block' }}>
      <source type="image/webp" srcSet={srcWebp} />
      <source type="image/jpeg" srcSet={srcJpg} />
      <img
        src={`${basePath}_${widths[0]}.jpg`}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ aspectRatio, width: '100%', height: 'auto' }}
        sizes="(min-width:1024px) 50vw, 100vw"
      />
    </picture>
  );
}
