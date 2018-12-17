import * as winston from 'winston';
import * as appRoot from 'app-root-path';

const myFormat = winston.format.printf((info) => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.label({ label: 'right meow!' }),
      winston.format.timestamp(),
      myFormat,
    ),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.label({ label: 'right meow!' }),
      wile(options.file),
      new winston.transports.Console(options.console),
    ],
    exitOnError: false, // do nston.format.timestamp(),
      winston.format.colorize({ level: true }),
      myFormat,
    ),
  },
};

export class Log {

  protected logger: winston.Logger;
  private label: string = 'Unknown';

  constructor(label: string) {
    this.label = label;
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console),
      ],
      exitOnError: false, // do not exit on handled exceptions
    });
  }

}
