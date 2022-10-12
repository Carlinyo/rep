import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { Socket } from 'socket.io';

export class SocketIoClientStrategy
  extends Server
  implements CustomTransportStrategy {
  constructor(private client: Socket) {
    super();
  }

  listen(callback: () => void) {
    this.client.on('connection', () => {
      console.log('connect');
    });
    this.client.on('error', (error) => {
      console.log(error);
    });

    this.messageHandlers.forEach((handler, pattern) => {
      this.client.on(pattern, (data: any) => {
        handler(data, this.client);
      });
    });

    callback();
  }

  close() {
    this.client.disconnect();
  }
}