import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { MongoDataServices } from './mongo-data-services.service';
import { ConfigModule } from '@nestjs/config';
import { PaymentMethod, PaymentMethodSchema } from './entities/payment.model';
import { Transaction, TransactionSchema } from './entities/transaction.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
      { name: Transaction.name, schema: TransactionSchema}
    ]),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule {}
