import { Command } from './Command';
import { Socket } from 'socket.io';

export class RequestCommand implements Command {

  public eventName: string;
  public isValid(object: object): boolean {
    throw new Error("Method not implemented.");
  }
  public initHandler(socket: Socket): Promise<string> {
    throw new Error("Method not implemented.");
  }


}
