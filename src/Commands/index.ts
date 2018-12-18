import { AuthorizeCommand } from './Authorize';
import { Command } from './Command';
import { RequestCommand } from './Request';
import { ResponseCommand } from './Response';

export { Command };

export const AUTHORIZE = new AuthorizeCommand();
export const REQUEST = new RequestCommand();
export const RESPONSE = new ResponseCommand();

export const COMMANDS: Command[] = [
    AUTHORIZE,
    REQUEST,
    RESPONSE,
];
