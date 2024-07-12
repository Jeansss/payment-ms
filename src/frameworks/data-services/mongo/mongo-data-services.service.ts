import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { IGenericRepository } from 'src/core/abstracts/generic-repository.abstract';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from './external/mongo-generic-repository';
import { PaymentMethod, PaymentMethodDocument } from './entities/payment.model';
import { Transaction, TransactionDocument } from './entities/transaction.model';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap {
  payments: IGenericRepository<PaymentMethod>;
  transactions: IGenericRepository<Transaction>;

  constructor(
    @InjectModel(PaymentMethod.name)
    private PaymentRepository: Model<PaymentMethodDocument>,
    @InjectModel(Transaction.name)
    private TransactionRepository: Model<TransactionDocument>
  ) { }

  onApplicationBootstrap() {
    this.payments = new MongoGenericRepository(this.PaymentRepository);
    this.transactions = new MongoGenericRepository(this.TransactionRepository);
  }
}
