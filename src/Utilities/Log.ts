import { format, Logger, createLogger, transports } from 'winston';
import * as appRoot from 'app-root-path';
import { Format } from 'logform';

export class Log {

  private static optionsConstructor(type: 'file' | 'console', label: string, messageFormat: Format) {
    switch (type) {
      case 'file':
        return {
          level: 'info',
          filename: `${appRoot}/logs/app.log`,
          handleExceptions: true,
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          format: format.combine(
            format.label({ label }),
            format.timestamp(),
            messageFormat,
          ),
        };
      case 'console':
        return {
          level: 'debug',
          handleExceptions: true,
          format: format.combine(
            format.label({ label }),
            format.timestamp(),
            format.json(),
            format.colorize({ level: true }),
            messageFormat,
          ),
        };
      default:
        throw new Error('Not implemented!');
    }
  }

  protected logger: Logger;
  private messageFormat = format.printf((info) => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });
  private label: string = 'Unknown';

  constructor(label: string) {
    this.label = label;
    this.logger = createLogger({
      transports: [
        new transports.File(Log.optionsConstructor('file', label, this.messageFormat)),
        new transports.Console(Log.optionsConstructor('console', label, this.messageFormat)),
      ],
      exitOnError: false, // do not exit on handled exceptions
    });
  }

}
