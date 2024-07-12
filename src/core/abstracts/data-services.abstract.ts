import { IGenericRepository } from './generic-repository.abstract';
import { PaymentMethod } from 'src/frameworks/data-services/mongo/entities/payment.model';
import { Transaction } from 'src/frameworks/data-services/mongo/entities/transaction.model';

export abstract class IDataServices {
  abstract payments: IGenericRepository<PaymentMethod>;
  abstract transactions: IGenericRepository<Transaction>;
}
