import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

export interface FacilityRoom {
  id: string;
  titleKey: string;
  sizeKey: string;
  floorTypeKey: string;
  descKey: string;
  imageUrl?: string;
  icon: 'large' | 'medium' | 'small' | 'xlarge';
}

interface FacilityCardProps {
  room: FacilityRoom;
  t: (key: string) => string;
  index: number;
}

const iconMap = {
  xlarge: (
    <svg className="w-16 h-16 text-primary-accent" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
    </svg>
  ),
  large: (
    <svg className="w-14 h-14 text-primary-accent" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
    </svg>
  ),
  medium: (
    <svg className="w-12 h-12 text-primary-accent" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 5h6v6H5V5zm8 0h6v6h-6V5zM5 13h6v6H5v-6zm8 0h6v6h-6v-6z" />
    </svg>
  ),
  small: (
    <svg className="w-10 h-10 text-primary-accent" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 6h5v5H6V6zm7 0h5v5h-5V6zM6 13h5v5H6v-5zm7 0h5v5h-5v-5z" />
    </svg>
  ),
};

const FacilityCard: React.FC<FacilityCardProps> = ({ room, t, index }) => {
  return (
    <AnimateOnScroll delay={index * 100} className="[perspective:1000px]">
      <div className="group h-full p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
        <div className="mb-6 flex justify-center">{iconMap[room.icon]}</div>
        <h3 className="text-2xl font-bold text-neutral mb-3 text-center holographic-text">
          {t(room.titleKey)}
        </h3>
        <div className="space-y-2 mb-4">
          <p className="text-lg font-semibold text-primary-accent text-center">{t(room.sizeKey)}</p>
          <p className="text-sm text-neutral/75 text-center italic">{t(room.floorTypeKey)}</p>
        </div>
        <p className="text-neutral/90 leading-relaxed text-center">{t(room.descKey)}</p>
      </div>
    </AnimateOnScroll>
  );
};

export default FacilityCard;
