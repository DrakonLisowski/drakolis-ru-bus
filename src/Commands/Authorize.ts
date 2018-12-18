import { validate } from 'jsonschema';
import { Socket } from 'socket.io';
import { Command } from './Command';
import { Log } from '../Utilities/Log';
import { formatValidatorErrors, capitalize } from '../Utilities/Formatters';

export class AuthorizeCommand implements Command {

  public eventName = 'authorize';
  private myLogger = new Log(capitalize(this.eventName)).getLogger();

  public isValid(object: object): boolean {
    const verify = validate(object, {
      command: {
          name: 'authorize',
          version: '1.0',
          service: 'Bus',
        },
        meta: {
          requestId: {type: 'string'},
        },
        data: {
          name: {type: 'string'},
          key: {type: 'string'},
        },
    });

    if (verify.valid) {
      return true;
    } else {
      this.myLogger.error(`Request ${object} is invalid: ${formatValidatorErrors(verify.errors)}`);
      return false;
    }
  }

  public initHandler(socket: Socket): Promise<string> {
    return new Promise((res, rej) => {
        socket.on(
            this.eventName,
            (data) => {
              if (!this.isValid(data)) {
                rej('Validation error');
              }
              res('UndefinedService');
            },
        );
        setTimeout(
            () => { rej('Timeout'); },
            5 * 1000,
        );
    });
  }

}
