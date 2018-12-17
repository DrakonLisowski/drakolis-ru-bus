import { COMMANDS, Command } from './Commands';
import { Socket } from 'socket.io';

export function initBusCommands(socket: Socket) {
    COMMANDS.forEach((command: Command) => {
        socket.on('authorize', (data) => {
            command.isValid(data);
        });
    });
}
