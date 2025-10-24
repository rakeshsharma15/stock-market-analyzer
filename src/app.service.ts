import { Injectable,Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
// import { AwsService } from './aws/aws.service';
import { MySQLDatabaseService } from './database/mysql/mysql.service';
import { MongoDatabaseService } from './database/mongo/mongo.service';
import { PromptService } from './prompt/prompt.service';
import { StockService } from './stock/stock.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    // private readonly awsService: AwsService,
    private readonly mysqlDB: MySQLDatabaseService,
    private readonly mongoDB: MongoDatabaseService,
    private readonly promptService: PromptService,
    private readonly stockService: StockService
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
  private safeParseAnalysis(text: string): any | null {
    if (!text) return null;
    try {
      const clean = text.replace(/```json\n|```/g, '');
      return JSON.parse(clean);
    } catch (err) {
      this.logger.warn('Failed to parse analysis JSON', err as any);
      return null;
    }
  }
  private buildStockPayload(jsonData: any) {
    return {
      stockId : uuidv4(),
      stockName: jsonData.StockName,
      stockSize: 'mid',
      stockDescription: jsonData?.Outlook?.Reasoning || 'No description available',
      symbol: (jsonData.Symbol || '').toUpperCase(),
      exchange: jsonData?.Exchange || 'NSE',
      currentPrice: jsonData?.PriceMetrics?.CurrentPrice || 0,
      changePercent: jsonData?.PriceMetrics?.DailyChangePercent || 0,
      volume: jsonData?.PriceMetrics?.Volume || 0,
      sector: jsonData?.Sector || 'Unknown',
      isActive: true,
      lastUpdatedAt: new Date(),
      analysis: jsonData || {}
    };
  }
  @Cron(CronExpression.EVERY_3_HOURS)
  async handleCron() {
    try {
      const result = await this.mysqlDB.executeQuery(
        'SELECT * FROM stock_cron_config    WHERE is_active = 1 AND next_run_at <= NOW() limit 1',
        []
      );
      const analysis = await this.promptService.analyzeStock(result[0].name);
      let responseText = analysis?.output?.[0]?.content?.[0]?.text;
      const jsonData = this.safeParseAnalysis(responseText);
      const stockData = this.buildStockPayload(jsonData);
    const savedStock = await this.stockService.createStock(stockData);
     await this.mysqlDB.executeQuery(
        `UPDATE stock_cron_config
         SET last_run_at = NOW()
         WHERE id = ?`,
        [result[0].id]
      );
    console.log('Stock created successfully:', savedStock);
    } catch (error) {
      console.error('Database query failed:', error);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async dailyStockAnalysis(): Promise<any> {
    try {
      const analysis = await this.promptService.dailyStockAnalysis();
      const responseText = analysis?.output?.[0]?.content?.[0]?.text;
      const jsonData = this.safeParseAnalysis(responseText);
      const stockData = [];
      jsonData.Stocks.forEach(stock => {
        stockData.push(this.buildStockPayload(stock));
      });
      const savedStock = await this.stockService.createStocksBulk(stockData);
    this.logger.log(`Stock created successfully: ${savedStock}`);
    } catch (error) {
      this.logger.error('Error during daily stock analysis:', error);
    }

  }
}
