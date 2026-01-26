/**
 * TypeScript type definitions for i18next
 *
 * This file provides type safety and autocompletion for translation keys.
 * Types will be auto-generated after running i18next-parser.
 *
 * For now, we use a generic string type. After migration is complete,
 * run: npm run i18n:extract
 */

import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    // Use literal string types for better type safety
    // After migration, generate types with i18next-parser
    defaultNS: 'common';
    resources: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      common: any; // Will be replaced with generated types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      booking: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      schedule: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      calendar: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      home: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      classes: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blog: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      faq: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      about: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contact: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pages: any;
    };
  }
}
