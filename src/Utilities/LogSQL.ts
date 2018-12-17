import { Logger, QueryRunner } from 'typeorm';
import { Log } from './Log';

export class LogSQL extends Log implements Logger {

  constructor() {
    super('SQL');
  }

  public logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.debug(`Executed ${query} with parameters: ${parameters}`);
  }

  public logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.error(`Error ${error} on ${query} with parameters: ${parameters}`, new Error(error));
  }

  public logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.warn(`Executed slow ${query} with parameters: ${parameters} (${time})`);
  }

  public logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.info(message);
  }

  public logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.info(message);
  }

  public log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    (this.logger as any)[level](message);
  }

}
