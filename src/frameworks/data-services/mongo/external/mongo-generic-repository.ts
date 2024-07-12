import { Model } from 'mongoose';
import { IGenericRepository } from 'src/core/abstracts/generic-repository.abstract';

export class MongoGenericRepository<T> implements IGenericRepository<T> {
  _repository: Model<T>;
  _populateOnFind: string[];

  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  getAll(): Promise<T[]> {
    return this._repository.find().populate(this._populateOnFind).exec();
  }

  get(id: any): Promise<T> {
    return this._repository.findById(id).exec();
  }

  create(item: T): Promise<T> {
    return this._repository.create(item);
  }

  update(id: string, item: T) {
    return this._repository.findByIdAndUpdate(id, item, { new: true });
  }

  delete(id: string) {
    this._repository.findByIdAndDelete(id).exec();
  }
}
