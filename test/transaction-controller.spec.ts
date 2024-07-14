import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from 'src/controllers/transaction/transaction.controller';
import { TransactionUseCases } from 'src/use-cases/transaction/transaction.use-case';
import { TransactionDTO } from 'src/dto/transaction.dto';
import { Transaction } from 'src/frameworks/data-services/mongo/entities/transaction.model';

const mockTransactionUseCases = () => ({
  createTransaction: jest.fn(),
  getTransactionById: jest.fn(),
});

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: TransactionUseCases, useFactory: mockTransactionUseCases },
      ],
    }).compile();

    transactionController = module.get<TransactionController>(TransactionController);
    transactionUseCases = module.get<TransactionUseCases>(TransactionUseCases);
  });

  it('should be defined', () => {
    expect(transactionController).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create and return a new transaction', async () => {
      const transactionDTO: TransactionDTO = { paymentMethodId: 'Credit Card' };
      const cartId = 'cart123';
      const transaction = { _id: 'transaction123', ...transactionDTO } as unknown as Transaction;

      transactionUseCases.createTransaction.mockResolvedValue(transaction);

      const result = await transactionController.createTransaction(cartId, transactionDTO);
      expect(result).toEqual(transaction);
      expect(transactionUseCases.createTransaction).toHaveBeenCalledWith(transactionDTO, cartId);
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction by ID', async () => {
      const transactionId = '123456789012345678901234';
      const transaction = { _id: transactionId, status: 'completed', total: 100, paymentMethod: { name: 'Credit Card', description: 'Visa' } } as Transaction;

      transactionUseCases.getTransactionById.mockResolvedValue(transaction);

      const result = await transactionController.getTransactionById(transactionId);
      expect(result).toEqual(transaction);
      expect(transactionUseCases.getTransactionById).toHaveBeenCalledWith(transactionId);
    });

    it('should throw an error when the ID is invalid', async () => {
      const transactionId = 'invalid-id';
      transactionUseCases.getTransactionById.mockRejectedValue(new Error('Invalid ID'));
      
      try {
        await transactionController.getTransactionById(transactionId);
      } catch (error) {
        expect(error.message).toEqual('Invalid ID');
      }
    });
  });
});