import { Socket } from 'socket.io';
import { COMMANDS } from './Commands';

export function authorizationCheck(socket: Socket): Promise<string> {
    return new Promise((res, rej) => {
        socket.on(
            COMMANDS[0].getEventName(),
            () => { res('UndefinedService'); },
        );
        setTimeout(
            () => { rej(); },
            5 * 1000,
        );
    });
}
