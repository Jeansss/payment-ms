
import { Transaction } from '../entities/transaction.model';
import { MongoGenericRepository } from '../external/mongo-generic-repository';

export class TransactionRepositoryImpl extends MongoGenericRepository<Transaction> {

  getTransactionByStatus(status: string) {
    return this._repository
      .find({ status: status })
      .exec();
  }
}
