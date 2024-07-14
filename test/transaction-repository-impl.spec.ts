import { Transaction } from 'src/frameworks/data-services/mongo/entities/transaction.model';
import { TransactionRepositoryImpl } from 'src/frameworks/data-services/mongo/gateways/transaction.repository';

// Mock do modelo Transaction
const mockTransactionModel = () => ({
  find: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  }),
  findById: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
});

describe('TransactionRepositoryImpl', () => {
  let repository: TransactionRepositoryImpl;
  let transactionModel: ReturnType<typeof mockTransactionModel>;

  beforeEach(async () => {
    transactionModel = mockTransactionModel() as any;

    repository = new TransactionRepositoryImpl(transactionModel as any);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getTransactionByStatus', () => {
    it('should return an array of transactions with the given status', async () => {
      const status = 'completed';
      const transactions = [
        { status: 'completed', total: 100, paymentMethod: { name: 'Credit Card', description: 'Visa' } } as Transaction,
        { status: 'completed', total: 200, paymentMethod: { name: 'Debit Card', description: 'MasterCard' } } as Transaction,
      ];
      transactionModel.find().exec.mockResolvedValue(transactions);

      const result = await repository.getTransactionByStatus(status);
      expect(result).toEqual(transactions);
      expect(transactionModel.find).toHaveBeenCalledWith({ status });
    });

    it('should return an empty array if no transactions are found', async () => {
      const status = 'completed';
      transactionModel.find().exec.mockResolvedValue([]);

      const result = await repository.getTransactionByStatus(status);
      expect(result).toEqual([]);
      expect(transactionModel.find).toHaveBeenCalledWith({ status });
    });
  });

  describe('getAll', () => {
    it('should return an array of transactions', async () => {
      const transactions = [
        { status: 'completed', total: 100, paymentMethod: { name: 'Credit Card', description: 'Visa' } } as Transaction,
        { status: 'pending', total: 200, paymentMethod: { name: 'Debit Card', description: 'MasterCard' } } as Transaction,
      ];
      transactionModel.find().exec.mockResolvedValue(transactions);

      const result = await repository.getAll();
      expect(result).toEqual(transactions);
      expect(transactionModel.find).toHaveBeenCalled();
    });

    it('should return an empty array if no transactions are found', async () => {
      transactionModel.find().exec.mockResolvedValue([]);

      const result = await repository.getAll();
      expect(result).toEqual([]);
      expect(transactionModel.find).toHaveBeenCalled();
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction by ID', async () => {
      const transactionId = '123456789012345678901234';
      const transaction = { _id: transactionId, status: 'completed', total: 100, paymentMethod: { name: 'Credit Card', description: 'Visa' } } as Transaction;
      transactionModel.findById().exec.mockResolvedValue(transaction);

      const result = await repository.get(transactionId);
      expect(result).toEqual(transaction);
      expect(transactionModel.findById).toHaveBeenCalledWith(transactionId);
    });

    it('should return null if no transaction is found', async () => {
      const transactionId = '123456789012345678901234';
      transactionModel.findById().exec.mockResolvedValue(null);

      const result = await repository.get(transactionId);
      expect(result).toBeNull();
      expect(transactionModel.findById).toHaveBeenCalledWith(transactionId);
    });
  });

  describe('create', () => {
    it('should create and return a new transaction', async () => {
      const transaction = { status: 'completed', total: 100, paymentMethod: { name: 'Credit Card', description: 'Visa' } } as Transaction;
      transactionModel.create.mockResolvedValue(transaction);

      const result = await repository.create(transaction);
      expect(result).toEqual(transaction);
      expect(transactionModel.create).toHaveBeenCalledWith(transaction);
    });
  });

  describe('update', () => {
    it('should update and return the transaction', async () => {
      const transactionId = '123';
      const transaction = { _id: transactionId, status: 'completed', total: 200, paymentMethod: { name: 'Credit Card', description: 'Visa' } } as Transaction;
      transactionModel.findByIdAndUpdate.mockResolvedValue(transaction);

      const result = await repository.update(transactionId, transaction);
      expect(result).toEqual(transaction);
      expect(transactionModel.findByIdAndUpdate).toHaveBeenCalledWith(transactionId, transaction, { new: true });
    });
  });

  describe('delete', () => {
    it('should delete the transaction', async () => {
      const transactionId = '123456789012345678901234';
      transactionModel.findByIdAndDelete().exec.mockResolvedValue({ _id: transactionId } as unknown as Transaction);

      await repository.delete(transactionId);
      expect(transactionModel.findByIdAndDelete).toHaveBeenCalledWith(transactionId);
    });
  });
});