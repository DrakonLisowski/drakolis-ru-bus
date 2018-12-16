import {createServer, Server} from 'http';
import express from 'express';
import socketIo from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import {createConnection, getConnectionOptions} from 'typeorm';
import 'reflect-metadata';
import { LogSQLWrapper, LogHTTP, LogSocket } from './src/Utilities/Log';

getConnectionOptions().then(async (connectionOptions) => {
  return createConnection(Object.assign(connectionOptions, {logger: new LogSQLWrapper()}))
});

class BusServer {

  public static readonly PORT: number = 4000;
  private app: express.Express;
  private server: Server;
  private io: socketIo.Server;
  private port: string | number;

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  public getApp(): express.Application {
    return this.app;
  }

  private createApp(): void {
    this.app = express();
    this.app.use(bodyParser.json());       // to support JSON-encoded bodies
    this.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true,
    }));
    this.app.use(cors());
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
      this.port = process.env.PORT || BusServer.PORT;
  }

  private sockets(): void {
    this.io = socketIo(this.server, {
      serveClient: false,
      // below are engine.IO options
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
    });

    this.io.on('connection', (soc) => {
      LogSocket.debug(`Connected: ${soc.id}`);
    });
  }

  private listen(): void {
      this.server.listen(this.port, () => {
          LogHTTP.info(`Running server on port ${this.port}`);
      });
  }
}

const app = new BusServer().getApp();
export { app };

/*
### Authorize ###
{
  command: {
    type: 'authorize',
    version: '1.0',
    service: 'Bus'
  },
  meta: {...},
  data: {
    name: 'SomeService',
    key: '123'
  }
}

### Request ###
{
  command: {
    type: 'request',
    version: '1.0',
    service: 'SomeService'
  },
  meta: {...},
  data: {...}
}
### Response ###
{
  command: {
    type: 'response',
    version: '1.0',
    service: 'bus'
  },
  meta: {...}, // copied from request (can be used for verification on end)
  data: {...}
}

### Subscribe ###
{
  command: {
    type: 'subscribe',
    version: '1.0',
    service: 'SomeService'
  },
  meta: {...},
  data: {...}
}
### Event ###
{
  command: {
    type: 'authorize',
    version: '1.0',
    service: 'SomeService'
  },
  meta: {}, // always empty
  data: {...}
}
*/
