import { MODE } from '@/constants/config';

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const CURRENT_LEVEL =
  MODE === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

function formatMessage(
  level: keyof typeof LOG_LEVELS,
  message: string,
  meta: Record<string, unknown>
) {
  return {
    level,
    message,
    meta,
    time: new Date().toISOString(),
  };
}

function output(level: keyof typeof LOG_LEVELS, data: unknown) {
  switch (level) {
    case 'DEBUG':
      console.debug(data);
      break;
    case 'INFO':
      console.info(data);
      break;
    case 'WARN':
      console.warn(data);
      break;
    case 'ERROR':
      console.error(data);
      break;
  }
}

export const logger = {
  debug(message: string, meta: Record<string, unknown> = {}) {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
      output('DEBUG', formatMessage('DEBUG', message, meta));
    }
  },

  info(message: string, meta: Record<string, unknown> = {}) {
    if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
      output('INFO', formatMessage('INFO', message, meta));
    }
  },

  warn(message: string, meta: Record<string, unknown> = {}) {
    if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
      output('WARN', formatMessage('WARN', message, meta));
    }
  },

  error(message: string, meta: Record<string, unknown> = {}) {
    if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
      output('ERROR', formatMessage('ERROR', message, meta));
    }
  },
};
