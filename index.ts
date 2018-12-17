import {createServer, Server} from 'http';
import express from 'express';
import socketIo from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import {createConnection, getConnectionOptions} from 'typeorm';
import 'reflect-metadata';
import { Log } from './src/Utilities/Log';
import { LogSQL } from './src/Utilities/LogSQL';
import { LogHTTP } from './src/Utilities/LogHTTP';

getConnectionOptions().then(async (connectionOptions) => {
  return createConnection(Object.assign(connectionOptions, {logger: new LogSQL()}))
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
    this.app.use(new LogHTTP().getMiddleware());
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
      this.port = process.env.PORT || BusServer.PORT;
  }

  private sockets(): void {
    const LogSocket = new Log('Socket').getLogger();
    // @ts-ignore
    this.io = socketIo(this.server, {
      serveClient: true,
      // below are engine.IO options
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      logger: LogSocket,
    });
    // logging
    this.io.on('connection', (soc) => {
      LogSocket.debug(`<${soc.id}> Connected`);

      soc.on('connect', () => {
        LogSocket.debug(`<${soc.id}> Connected`);
      });

      soc.on('connect_error', (err) => {
        LogSocket.debug(`<${soc.id}> Failed to connect: ${JSON.stringify(err)}`);
      });
      soc.on('connect_timeout', (err) => {
        LogSocket.debug(`<${soc.id}> Connection timed out: ${JSON.stringify(err)}`);
      });

      soc.on('error', (err) => {
        LogSocket.debug(`<${soc.id}> Error: ${JSON.stringify(err)}`);
      });

      soc.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          LogSocket.debug(`<${soc.id}> Disconnected by server`);
        }
        LogSocket.debug(`<${soc.id}> Disconnected from server`);
      });

      soc.on('reconnect', (attempt) => {
        LogSocket.debug(`<${soc.id}> Reconnected on attempt #${attempt}`);
      });
      soc.on('reconnecting', (attempt) => {
        LogSocket.debug(`<${soc.id}> Reconnecting attempt #${attempt}`);
      });
      soc.on('reconnect_error', (err) => {
        LogSocket.debug(`<${soc.id}> Failed to reconnect: ${JSON.stringify(err)}`);
      });
      soc.on('reconnect_failed', (attempt) => {
        LogSocket.debug(`<${soc.id}> Reconnect failed`);
      });
    });
  }

  private listen(): void {
      this.server.listen(this.port, () => {
          // LogHTTP.info(`Running server on port ${this.port}`);
      });
  }
}

const app = new BusServer().getApp();
export { app };

/*
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
