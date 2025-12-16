/**
 * Timba Page - Using FullDanceClassTemplate
 *
 * Unified page for Timba en Pareja + Lady Timba classes.
 * All configuration is centralized in constants/timba-config.ts
 */
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { TIMBA_PAGE_CONFIG } from '../constants/timba-config';

const TimbaPage: React.FC = () => {
  return <FullDanceClassTemplate config={TIMBA_PAGE_CONFIG} />;
};

export default TimbaPage;
