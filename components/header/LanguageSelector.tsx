import React from 'react';
import { GlobeIcon, ChevronDownIcon } from '../../lib/icons';
import type { Locale } from '../../types';

interface LanguageSelectorProps {
  locale: Locale;
  isLangDropdownOpen: boolean;
  setIsLangDropdownOpen: (open: boolean) => void;
  handleLanguageChange: (lang: Locale) => void;
  languageNames: Record<Locale, string>;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  locale,
  isLangDropdownOpen,
  setIsLangDropdownOpen,
  handleLanguageChange,
  languageNames,
}) => {
  return (
    <div className="relative language-dropdown">
      <button
        onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsLangDropdownOpen(!isLangDropdownOpen);
          } else if (e.key === 'Escape') {
            setIsLangDropdownOpen(false);
          }
        }}
        className="flex items-center space-x-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-300 border border-white/10 hover:border-primary-accent/50"
        aria-label="Select language"
        aria-expanded={isLangDropdownOpen}
      >
        <GlobeIcon className="w-4 h-4 text-primary-accent" />
        <span className="text-sm font-medium text-white">{locale.toUpperCase()}</span>
        <ChevronDownIcon
          className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isLangDropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isLangDropdownOpen && (
        <div className="absolute top-full mt-2 right-0 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-primary-accent/10 overflow-hidden min-w-[160px] animate-fadeIn">
          {(['es', 'ca', 'en', 'fr'] as Locale[]).map(lang => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                locale === lang
                  ? 'bg-primary-accent text-white'
                  : 'text-neutral/90 hover:bg-white/10 hover:text-white'
              }`}
              aria-label={`Switch to ${languageNames[lang]}`}
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
