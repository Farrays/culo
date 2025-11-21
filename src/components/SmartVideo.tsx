import { useEffect, useRef, useState } from 'react';

type Props = {
  poster?: string;
  mp4?: string; // si self-host
  webm?: string; // si self-host
  embed?: string; // iframe src (YouTube/Vimeo) o URL completa
  className?: string;
  captionsVtt?: string; // opcional
};

export default function SmartVideo({
  poster,
  mp4,
  webm,
  embed,
  className,
  captionsVtt,
}: Props): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      entries => {
        const e = entries[0];
        if (e && e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {!visible ? (
        <div style={{ aspectRatio: '16/9' }} className="bg-white/10 rounded-2xl" />
      ) : embed ? (
        <div className="relative" style={{ aspectRatio: '16/9' }}>
          <iframe
            src={embed}
            title="Vídeo"
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
            className="absolute inset-0 w-full h-full rounded-2xl border border-white/10"
          />
        </div>
      ) : (
        <video
          controls
          preload="metadata"
          poster={poster}
          style={{ aspectRatio: '16/9' }}
          className="w-full rounded-2xl border border-white/10"
        >
          {webm && <source src={webm} type="video/webm" />}
          {mp4 && <source src={mp4} type="video/mp4" />}
          {captionsVtt && (
            <track kind="captions" src={captionsVtt} srcLang="es" label="ES" default />
          )}
        </video>
      )}
    </div>
  );
}
