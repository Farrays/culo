import { Fragment } from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb Item Interface
 * Represents a single item in the breadcrumb navigation trail
 */
export interface BreadcrumbItem {
  /** Display name of the breadcrumb item */
  name: string;
  /** URL path for the breadcrumb item (without domain) */
  url: string;
  /** Whether this is the current/active page */
  isActive?: boolean;
}

/**
 * Breadcrumb Props Interface
 */
interface BreadcrumbProps {
  /** Array of breadcrumb items to display */
  items: BreadcrumbItem[];
  /** Base URL for absolute paths (default: https://www.farrayscenter.com) */
  baseUrl?: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** Text color class (default: text-neutral/90 for better WCAG contrast) */
  textColor?: string;
  /** Hover color class (default: hover:text-primary-accent) */
  hoverColor?: string;
}

/**
 * Breadcrumb Component with Microdata
 *
 * Provides both visual breadcrumb navigation and structured data markup:
 * - **Visual HTML**: Rendered breadcrumb trail with links
 * - **Microdata**: itemscope, itemtype, itemprop attributes for search engines
 * - **JSON-LD**: Companion schema should be added separately in page Helmet
 *
 * **SEO Best Practice**: This component adds redundant microdata markup alongside
 * the existing JSON-LD schema. Google recommends having both for maximum compatibility.
 *
 * @example
 * ```tsx
 * const breadcrumbItems = [
 *   { name: 'Home', url: `/${locale}` },
 *   { name: 'Clases', url: `/${locale}/clases` },
 *   { name: 'Dancehall', url: `/${locale}/clases/dancehall-barcelona`, isActive: true }
 * ];
 *
 * <Breadcrumb items={breadcrumbItems} />
 * ```
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  baseUrl = 'https://www.farrayscenter.com',
  className = 'mb-8',
  textColor = 'text-neutral/90',
  hoverColor = 'hover:text-primary-accent',
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className={`flex items-center justify-center gap-2 text-sm ${textColor}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isActive = item.isActive ?? isLast;
          const absoluteUrl = `${baseUrl}${item.url}`;

          return (
            <Fragment key={index}>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                {!isActive ? (
                  <>
                    <Link
                      to={item.url}
                      itemProp="item"
                      className={`transition-colors ${hoverColor}`}
                    >
                      <span itemProp="name">{item.name}</span>
                    </Link>
                    <meta itemProp="position" content={String(index + 1)} />
                  </>
                ) : (
                  <>
                    <span
                      itemProp="item"
                      itemScope
                      itemType="https://schema.org/WebPage"
                      itemID={absoluteUrl}
                    >
                      <span itemProp="name" className="text-neutral/90">
                        {item.name}
                      </span>
                    </span>
                    <meta itemProp="position" content={String(index + 1)} />
                  </>
                )}
              </li>
              {!isLast && <li aria-hidden="true">/</li>}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
