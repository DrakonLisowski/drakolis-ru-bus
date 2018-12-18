import { AuthorizeCommand } from './Authorize';
import { Command } from './Command';

export { Command };

export const AUTHORIZE = new AuthorizeCommand();

export const COMMANDS: Command[] = [
    AUTHORIZE,
];
