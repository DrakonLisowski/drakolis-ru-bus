// @ts-ignore
import expressWinston from 'express-winston';
import { transports } from 'winston';
import { Log } from './Log';

export class LogHTTP extends Log {

  private middleware: any;

  constructor() {
    super('HTTP');
    this.middleware = expressWinston.logger({
      winstonInstance: this.logger,
      expressFormat: true,
      level: 'debug',
      statusLevels: true,
      });
  }

  public getMiddleware() {
    return this.middleware;
  }
}
