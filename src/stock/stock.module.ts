import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { MongooseModule } from '@nestjs/mongoose';
import {Stock , StockSchema} from './schemas/stock.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }])],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}

