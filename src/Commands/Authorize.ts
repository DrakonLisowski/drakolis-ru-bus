import { validate } from 'jsonschema';
import { Command } from './Command';
import { Log } from '../Utilities/Log';
import { formatValidatorErrors } from '../Formatters';

export class AuthorizeCommand implements Command {

  private myLogger = new Log(`Authorize`).getLogger();

  public getEventName(): string {
    return 'authorize';
  }

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
      return verify.valid;
    } else {
      this.myLogger.error(`Request ${object} is invalid: ${formatValidatorErrors(verify.errors)}`);
    }
  }


}
