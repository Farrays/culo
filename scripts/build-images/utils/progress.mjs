/**
 * Image Build System - Progress Reporter
 * =======================================
 * Beautiful progress bars and logging
 */

import cliProgress from 'cli-progress';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

/**
 * Create a styled progress bar
 */
export function createProgressBar() {
  return new cliProgress.SingleBar({
    format: `  ${colors.cyan}{bar}${colors.reset} | {percentage}% | {value}/{total} | ${colors.dim}{filename}${colors.reset}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
    clearOnComplete: false,
    stopOnComplete: true,
  }, cliProgress.Presets.shades_classic);
}

/**
 * Create a multi-bar for parallel processing
 */
export function createMultiBar() {
  return new cliProgress.MultiBar({
    format: `  ${colors.cyan}{bar}${colors.reset} | {class} | {percentage}% | {value}/{total}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
    clearOnComplete: false,
    stopOnComplete: true,
  }, cliProgress.Presets.shades_classic);
}

/**
 * Log a styled header
 */
export function logHeader(text) {
  const line = '='.repeat(60);
  console.log(`\n${colors.bright}${colors.cyan}${line}${colors.reset}`);
  console.log(`${colors.bright}  ${text}${colors.reset}`);
  console.log(`${colors.cyan}${line}${colors.reset}\n`);
}

/**
 * Log a section title
 */
export function logSection(text) {
  console.log(`\n${colors.bright}${colors.blue}> ${text}${colors.reset}`);
}

/**
 * Log success message
 */
export function logSuccess(text) {
  console.log(`  ${colors.green}✓${colors.reset} ${text}`);
}

/**
 * Log warning message
 */
export function logWarning(text) {
  console.log(`  ${colors.yellow}⚠${colors.reset} ${text}`);
}

/**
 * Log error message
 */
export function logError(text) {
  console.log(`  ${colors.red}✗${colors.reset} ${text}`);
}

/**
 * Log info message
 */
export function logInfo(text) {
  console.log(`  ${colors.dim}${text}${colors.reset}`);
}

/**
 * Log a stats summary
 */
export function logStats(stats) {
  console.log(`\n${colors.bright}Summary:${colors.reset}`);
  console.log(`  ${colors.green}Processed:${colors.reset} ${stats.processed} images`);
  console.log(`  ${colors.yellow}Skipped:${colors.reset} ${stats.skipped} (cached)`);
  console.log(`  ${colors.blue}Generated:${colors.reset} ${stats.generated} files`);
  console.log(`  ${colors.magenta}Size:${colors.reset} ${formatBytes(stats.totalBytes)}`);
  console.log(`  ${colors.cyan}Time:${colors.reset} ${formatDuration(stats.duration)}`);
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format duration in ms to human readable
 */
export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const mins = Math.floor(ms / 60000);
  const secs = ((ms % 60000) / 1000).toFixed(0);
  return `${mins}m ${secs}s`;
}

export default {
  createProgressBar,
  createMultiBar,
  logHeader,
  logSection,
  logSuccess,
  logWarning,
  logError,
  logInfo,
  logStats,
  formatBytes,
  formatDuration,
};
