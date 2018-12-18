import { Socket } from 'socket.io';

export interface Command {
    eventName: string;
    isValid(object: object): boolean;
    initHandler(socket: Socket): Promise<string>;
}
