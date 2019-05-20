import * as winston from 'winston';
import config from './config';
const logLevel = config.logLevel;
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      level: logLevel
    })
  ]
});

export default logger;
