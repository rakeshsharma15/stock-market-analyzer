// op-28/githubspyne/market-anlayzer/src/database/database.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MySQLDatabaseService {
  constructor(private dataSource: DataSource) {}

  async executeQuery(query: string, parameters?: any[]): Promise<any> {
    return await this.dataSource.query(query, parameters);
  }
}