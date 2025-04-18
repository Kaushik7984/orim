import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Controller()
export class AppController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get('test-db')
  async testDb() {
    try {
      // Check if MongoDB is connected
      const isConnected =
        this.connection.readyState === ConnectionStates.connected;

      // Get list of collections
      const collections =
        (await this.connection.db?.listCollections().toArray()) || [];
      const collectionNames = collections.map((c) => c.name);

      return {
        status: 'success',
        connected: isConnected,
        collections: collectionNames,
        message: isConnected
          ? 'MongoDB is connected'
          : 'MongoDB is not connected',
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'error',
        message: errorMessage,
        error: error,
      };
    }
  }
}
