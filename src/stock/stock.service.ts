// op-28/githubspyne/market-anlayzer/src/database/database.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock } from './schemas/stock.schema'
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StockService {

    constructor(
        @InjectModel(Stock.name) private stockModel: Model<Stock>
    ) {}
   async createStock(body): Promise<Stock | null> {
        const stockId = uuidv4();
        try {
            const stock = new this.stockModel({ ...body, stockId });
            const savedStock = await stock.save();

            // this.logger.log(`Successfully created stock with ID: ${savedStock.id}`);
            return savedStock;
        } catch (error) {
            console.log('Error creating stock:', error);
            return null;
        }
    }

    async createStocksBulk(bodies: Partial<Stock>[]): Promise<{ insertedCount: number; insertedDocs: any[]; errors?: any[] }> {
    if (!Array.isArray(bodies) || bodies.length === 0) {
      return { insertedCount: 0, insertedDocs: [] };
    }

    // const docs = bodies.map(b => ({
    //   stockId: b.stockId || uuidv4(),
    //   stockName: b.stockName,
    //   stockSize: b.stockSize || 'mid',
    //   stockDescription: b.stockDescription || b?.analysis?.Outlook?.Reasoning || 'No description available',
    //   symbol: (b.symbol || b.stockName || '').toUpperCase(),
    //   exchange: b.exchange || 'NSE',
    //   currentPrice: (b.currentPrice ?? 0),
    //   changePercent: (b.changePercent ?? 0),
    //   volume: (b.volume ?? 0),
    //   sector: b.sector || 'Unknown',
    //   isActive: (typeof b.isActive === 'boolean') ? b.isActive : true,
    //   lastUpdatedAt: b.lastUpdatedAt || new Date(),
    //   analysis: b.analysis || {}
    // }));

    try {
      const inserted = await this.stockModel.insertMany(bodies, { ordered: false });
      return { insertedCount: inserted.length, insertedDocs: inserted };
    } catch (err: any) {
      // insertMany may throw on duplicates; it may still have insertedDocs / writeErrors
      const insertedDocs = err?.insertedDocs ?? err?.result?.insertedIds ?? [];
      const writeErrors = err?.writeErrors ?? [err];
    //   this.logger.warn('Bulk insert had errors, partial success', writeErrors);
      return { insertedCount: Array.isArray(insertedDocs) ? insertedDocs.length : 0, insertedDocs: insertedDocs, errors: writeErrors };
    }
  }
}