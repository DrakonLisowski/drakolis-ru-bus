import {Category,CategoryLogMessage,LoggerType,CategoryServiceFactory,CategoryConfiguration,LogLevel} from "typescript-logging";
import {Logger, QueryRunner} from "typeorm";
import moment from "moment";
import chalk from "chalk";

const config = new CategoryConfiguration(LogLevel.Trace, LoggerType.Console);
config.formatterLogMessage = (msg: CategoryLogMessage): string => {
  return [
    moment(msg.date).format('YYYY-MM-DD HH:mm:ss,SSS'),
    formatLogLevel(msg.level),
    `<${msg.categories.map(cat => cat.name).join(',')}>`,
    msg.messageAsString,
    msg.error,
    msg.errorAsStack
  ].join(' ');
};

function formatLogLevel(level: LogLevel): string {
  switch (level) {
    case LogLevel.Trace:
      return chalk.bgCyan(` ${LogLevel[level].toUpperCase()} `)
    case LogLevel.Debug:
      return chalk.bgBlue(` ${LogLevel[level].toUpperCase()} `)
    case LogLevel.Info:
      return chalk.bgGreen(` ${LogLevel[level].toUpperCase()} `)
    case LogLevel.Warn:
      return chalk.bgYellow(` ${LogLevel[level].toUpperCase()} `)
    case LogLevel.Error:
      return chalk.bgRed(` ${LogLevel[level].toUpperCase()} `)
    case LogLevel.Fatal:
      return chalk.bgRedBright(` ${LogLevel[level].toUpperCase()} `)
  }
}

CategoryServiceFactory.setDefaultConfiguration(config);

export const LogSocket = new Category(chalk.magenta("WS"));
export const LogHTTP = new Category(chalk.green("HTTP"));
export const LogSQL = new Category(chalk.blue("SQL"));
export const LogJWT = new Category(chalk.red("JWT"));

export function Emphasise(val: string): string {
  return chalk.bold(val);
}

export class LogSQLWrapper implements Logger {

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    LogSQL.debug(`Executed ${query} with parameters: ${parameters}`);
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    LogSQL.error(`Error ${error} on ${query} with parameters: ${parameters}`, new Error(error));
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    LogSQL.warn(`Executed slow ${query} with parameters: ${parameters} (${time})`);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    LogSQL.info(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    LogSQL.info(message);
  }

  log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
    (<any>LogSQL)[level](message);
  }


}