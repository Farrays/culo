import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fb_landing_first_visit';
const DEFAULT_HOURS = 72;

interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

/**
 * useCountdown - Hook para countdown de urgencia
 *
 * Guarda el timestamp de la primera visita en localStorage
 * y cuenta regresiva desde ese momento (default 72h)
 */
export function useCountdown(hoursFromFirstVisit: number = DEFAULT_HOURS): CountdownState {
  const [timeLeft, setTimeLeft] = useState<CountdownState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    totalSeconds: 0,
  });

  const calculateTimeLeft = useCallback((): CountdownState => {
    // Obtener o establecer timestamp de primera visita
    let firstVisit = localStorage.getItem(STORAGE_KEY);

    if (!firstVisit) {
      firstVisit = Date.now().toString();
      localStorage.setItem(STORAGE_KEY, firstVisit);
    }

    const firstVisitTime = parseInt(firstVisit, 10);
    const expirationTime = firstVisitTime + hoursFromFirstVisit * 60 * 60 * 1000;
    const now = Date.now();
    const difference = expirationTime - now;

    if (difference <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        totalSeconds: 0,
      };
    }

    const totalSeconds = Math.floor(difference / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours,
      minutes,
      seconds,
      isExpired: false,
      totalSeconds,
    };
  }, [hoursFromFirstVisit]);

  useEffect(() => {
    // Calcular inmediatamente
    setTimeLeft(calculateTimeLeft());

    // Actualizar cada segundo
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
}

/**
 * Formatea el countdown para display
 */
export function formatCountdown(state: CountdownState): string {
  if (state.isExpired) return '00:00:00';

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(state.hours)}:${pad(state.minutes)}:${pad(state.seconds)}`;
}

export default useCountdown;
