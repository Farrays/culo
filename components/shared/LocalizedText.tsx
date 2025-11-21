import type { ReactNode } from 'react';

/**
 * LocalizedText Props Interface
 */
interface LocalizedTextProps {
  /** Text content (can be string or ReactNode) */
  children: ReactNode;
  /** Language code (e.g., 'es', 'en', 'ca', 'fr') */
  lang: string;
  /** HTML element type to render (default: 'span') */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  /** Additional CSS classes */
  className?: string;
}

/**
 * LocalizedText Component
 *
 * Wraps translated text with proper `lang` attribute for accessibility.
 * Helps screen readers pronounce text correctly in the appropriate language.
 *
 * **WCAG 3.1.2 (Language of Parts) - Level AA**
 *
 * @example
 * ```tsx
 * import { useI18n } from '../hooks/useI18n';
 *
 * const { t, locale } = useI18n();
 *
 * <LocalizedText lang={locale}>
 *   {t('homepageTitle')}
 * </LocalizedText>
 * ```
 */
export const LocalizedText: React.FC<LocalizedTextProps> = ({
  children,
  lang,
  as: Component = 'span',
  className = '',
}) => {
  return (
    <Component lang={lang} className={className}>
      {children}
    </Component>
  );
};

export default LocalizedText;
