import { AuthorizeCommand } from './Authorize';
import { Command } from './Command';

export { Command };
export const COMMANDS: Command[] = [
    new AuthorizeCommand(),
];
