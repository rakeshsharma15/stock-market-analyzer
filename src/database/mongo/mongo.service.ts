import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongoDatabaseService {
  constructor(@InjectConnection() private connection: Connection) {}

  async executeQuery(collection: string, query: any): Promise<any> {
    try {
      const result = await this.connection
        .collection(collection)
        .find(query)
        .toArray();
      return result;
    } catch (error) {
      console.error('MongoDB query failed:', error);
      throw error;
    }
  }

  async insertDocument(collection: string, document: any): Promise<any> {
    try {
      return await this.connection
        .collection(collection)
        .insertOne(document);
    } catch (error) {
      console.error('MongoDB insert failed:', error);
      throw error;
    }
  }
}