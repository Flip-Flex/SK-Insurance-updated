// System Logger and Monitoring Module for SK Smart Investments

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  AUTH: 'AUTH'
};

const formatMessage = (level, message, context = {}) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message} ${Object.keys(context).length ? JSON.stringify(context) : ''}`;
};

export const logger = {
  info: (message, context) => {
    console.log(formatMessage(LOG_LEVELS.INFO, message, context));
  },
  warn: (message, context) => {
    console.warn(formatMessage(LOG_LEVELS.WARN, message, context));
  },
  error: (message, context) => {
    console.error(formatMessage(LOG_LEVELS.ERROR, message, context));
  },
  auth: (message, success, context = {}) => {
    const status = success ? 'SUCCESS' : 'FAILURE';
    console.log(formatMessage(LOG_LEVELS.AUTH, `[${status}] ${message}`, context));
  }
};
