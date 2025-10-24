import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema({ timestamps: true })
export class Stock {
  @Prop({ required: true, unique: true })
  stockId: string;

  @Prop({ required: true })
  stockName: string;

  @Prop({ required: true, enum: ['mid', 'large', 'small'], default: 'mid' })
  stockSize: 'mid' | 'large' | 'small';

  @Prop()
  stockDescription?: string;

  // ✅ Added fields
  @Prop({ required: false, unique: true, uppercase: true })
  symbol: string; // e.g., "TCS", "INFY", "WIPRO"

  @Prop({ required: true, enum: ['NSE', 'BSE'], default: 'NSE' })
  exchange: 'NSE' | 'BSE';

  @Prop({ type: Number, required: true })
  currentPrice: number; // current market price

  @Prop({ type: Number, default: 0 })
  changePercent?: number; // percentage change

  @Prop({ type: Number, default: 0 })
  volume?: number; // traded volume

  @Prop({ type: String })
  sector?: string; // IT, Banking, Pharma, etc.

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Object })
  analysis: Object; // Store the full analysis JSON

  @Prop({ type: Date })
  lastUpdatedAt?: Date;
}

export const StockSchema = SchemaFactory.createForClass(Stock);

// ✅ Optional: Hooks & Indexes
// StockSchema.pre<StockDocument>('save', function (next) {
//   this.lastUpdatedAt = new Date();
//   next();
// });

// ✅ Example Index for better search performance
StockSchema.index({ stockName: 1, symbol: 1 });