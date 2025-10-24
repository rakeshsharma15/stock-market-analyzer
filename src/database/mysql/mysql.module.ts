import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySQLDatabaseService } from './mysql.service';
// import { DatabaseService } from './database.service.ts';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3307,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_NAME || 'market_analyzer',
      entities: [],
      synchronize: true,
    })
  ],
  providers: [MySQLDatabaseService],
  exports: [MySQLDatabaseService],
})
export class MySQLDatabaseModule {}