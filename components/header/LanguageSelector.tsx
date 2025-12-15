import React from 'react';
import { GlobeIcon, ChevronDownIcon } from '../../lib/icons';
import type { Locale } from '../../types';
import { SUPPORTED_LOCALES } from '../../types';

interface LanguageSelectorProps {
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
  handleLanguageChange: (lang: Locale) => void;
  languageNames: Record<Locale, string>;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  locale,
  isOpen,
  onToggle,
  handleLanguageChange,
  languageNames,
}) => {
  return (
    <div className="relative language-dropdown">
      <button
        onClick={onToggle}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="flex items-center space-x-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-300 border border-white/10 hover:border-primary-accent/50"
        aria-expanded={isOpen}
      >
        <GlobeIcon className="w-4 h-4 text-primary-accent" />
        <span className="text-sm font-medium text-white">{locale.toUpperCase()}</span>
        <ChevronDownIcon
          className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-primary-accent/10 overflow-hidden min-w-[160px] animate-fadeIn">
          {SUPPORTED_LOCALES.map(lang => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                locale === lang
                  ? 'bg-primary-accent text-white'
                  : 'text-neutral/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{languageNames[lang]}</span>
              <span className="text-xs opacity-70">{lang.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
