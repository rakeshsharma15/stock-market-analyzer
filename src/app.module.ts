import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsModule } from './aws/aws.module';
import { MySQLDatabaseModule } from './database/mysql/mysql.module';
import { PromptModule } from './prompt/prompt.module';
import { MongoDatabaseModule } from './database/mongo/mongo.module';
import { StockModule } from './stock/stock.module';

@Module({
   imports: [
      ScheduleModule.forRoot(),
      AwsModule,
      StockModule,
      MySQLDatabaseModule,
      PromptModule,
      MongoDatabaseModule
   ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
