import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDatabaseService } from './mongo.service';
const MONGODB_URI = process.env.DB_HOST || 'mongodb://max:secret@127.0.0.1:27018/stock-market?authSource=admin&directConnection=true';
@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    }),
  ],
  providers: [MongoDatabaseService],
  exports: [MongoDatabaseService],
})
export class MongoDatabaseModule {}


// mongodb://max:secret@127.0.0.1:27018/?authSource=admin&directConnection=true