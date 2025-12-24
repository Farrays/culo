import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'fb_landing_spots';
const STORAGE_TIMESTAMP_KEY = 'fb_landing_spots_timestamp';

interface SpotsConfig {
  initialSpots: number;
  minSpots: number;
  decrementIntervalMs: number;
  resetDayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
}

const DEFAULT_CONFIG: SpotsConfig = {
  initialSpots: 10,
  minSpots: 3,
  decrementIntervalMs: 45000, // 45 segundos
  resetDayOfWeek: 1, // Lunes
};

interface SpotsState {
  spotsLeft: number;
  isLow: boolean; // < 5 plazas
  isCritical: boolean; // <= minSpots
}

/**
 * useSpotsCounter - Hook para contador de plazas disponibles
 *
 * Simula escasez de plazas con decremento gradual
 * - Se guarda en localStorage para persistencia
 * - Se resetea cada lunes
 * - Decrementa mientras el usuario está en la página
 */
export function useSpotsCounter(config: Partial<SpotsConfig> = {}): SpotsState {
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    // We intentionally list individual properties to avoid re-creating on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.initialSpots, config.minSpots, config.decrementIntervalMs, config.resetDayOfWeek]
  );

  const getInitialSpots = useCallback((): number => {
    // Verificar si necesitamos resetear (nuevo lunes)
    const storedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    const now = new Date();

    if (storedTimestamp) {
      const lastUpdate = new Date(parseInt(storedTimestamp, 10));
      const daysSinceLastUpdate = Math.floor(
        (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Si ha pasado más de una semana o estamos en un nuevo lunes
      if (
        daysSinceLastUpdate >= 7 ||
        (now.getDay() === finalConfig.resetDayOfWeek &&
          lastUpdate.getDay() !== finalConfig.resetDayOfWeek)
      ) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, now.getTime().toString());
        return finalConfig.initialSpots;
      }
    } else {
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, now.getTime().toString());
    }

    // Obtener plazas guardadas o usar inicial
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const spots = parseInt(stored, 10);
      return Math.max(spots, finalConfig.minSpots);
    }

    return finalConfig.initialSpots;
  }, [finalConfig]);

  const [spots, setSpots] = useState<number>(finalConfig.initialSpots);

  // Inicializar desde localStorage
  useEffect(() => {
    setSpots(getInitialSpots());
  }, [getInitialSpots]);

  // Decrementar gradualmente mientras está en la página
  useEffect(() => {
    const decrementSpots = () => {
      setSpots(current => {
        if (current <= finalConfig.minSpots) return current;

        // 70% probabilidad de decrementar (para que sea más natural)
        if (Math.random() > 0.7) return current;

        const newSpots = current - 1;
        localStorage.setItem(STORAGE_KEY, newSpots.toString());
        return newSpots;
      });
    };

    const timer = window.setInterval(decrementSpots, finalConfig.decrementIntervalMs);
    return () => window.clearInterval(timer);
  }, [finalConfig]);

  return {
    spotsLeft: spots,
    isLow: spots < 5,
    isCritical: spots <= finalConfig.minSpots,
  };
}

export default useSpotsCounter;
