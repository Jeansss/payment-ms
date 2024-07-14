import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { TransactionUseCases } from 'src/use-cases/transaction/transaction.use-case';
import { TransactionFactoryService } from 'src/use-cases/transaction/transaction-factory.service';
import { Transaction } from 'src/frameworks/data-services/mongo/entities/transaction.model';
import { TransactionDTO } from 'src/dto/transaction.dto';
import { WebhookDTO } from 'src/dto/webhook-transaction.dto';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Cart } from 'src/frameworks/data-services/mongo/entities/cart.model';
import { PaymentMethod } from 'src/frameworks/data-services/mongo/entities/payment.model';
import { IOrderPort, IOrderPortToken } from 'src/frameworks/api-services/http/ports/order.port';
import { OrderAdapter } from 'src/frameworks/api-services/http/adapters/order.adapter';

const mockDataServices = () => ({
  transactions: {
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  payments: {
    get: jest.fn(),
  },
});

const mockHttpService = () => ({
  axiosRef: {
    get: jest.fn(),
  },
});

const mockOrderClient = () => ({
  getCartById: jest.fn(),
});

const mockTransactionFactoryService = () => ({
  createNewTransaction: jest.fn(),
  orderClient: {
    getCartById: jest.fn()
  }
});

describe('TransactionUseCases', () => {
  let transactionUseCases: TransactionUseCases;
  let dataServices;
  let transactionFactoryService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionUseCases,
        { provide: IDataServices, useFactory: mockDataServices },
        { provide: TransactionFactoryService, useFactory: mockTransactionFactoryService },
      ],
    }).compile();

    transactionUseCases = module.get<TransactionUseCases>(TransactionUseCases);
    dataServices = module.get<IDataServices>(IDataServices);
    transactionFactoryService = module.get<TransactionFactoryService>(TransactionFactoryService);
  });

  it('should be defined', () => {
    expect(transactionUseCases).toBeDefined();
  });

  describe('getTransactionById', () => {
    it('should return a transaction when found', async () => {
      const transactionId = '123456789012345678901234';
      const transaction = { _id: transactionId, status: 'completed', total: 100 } as unknown as Transaction;
      dataServices.transactions.get.mockResolvedValue(transaction);

      const result = await transactionUseCases.getTransactionById(transactionId);
      expect(result).toEqual(transaction);
      expect(dataServices.transactions.get).toHaveBeenCalledWith(transactionId);
    });

    it('should throw NotFoundException when transaction is not found', async () => {
      const transactionId = '123456789012345678901234';
      dataServices.transactions.get.mockResolvedValue(null);

      await expect(transactionUseCases.getTransactionById(transactionId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid id format', async () => {
      const invalidId = 'invalid-id';

      await expect(transactionUseCases.getTransactionById(invalidId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('createTransaction', () => {
    it('should create and return a new transaction', async () => {
      const transactionDTO: TransactionDTO = { paymentMethodId: '1234567891011' };
      const cartId = 'cart123';
      const transaction = { _id: 'transaction123', ...transactionDTO } as unknown as Transaction;
      transactionFactoryService.createNewTransaction.mockReturnValue(transaction);
      dataServices.transactions.create.mockResolvedValue(transaction);

      const result = await transactionUseCases.createTransaction(transactionDTO, cartId);
      expect(result).toEqual(transaction);
      expect(transactionFactoryService.createNewTransaction).toHaveBeenCalledWith(transactionDTO, cartId);
      expect(dataServices.transactions.create).toHaveBeenCalledWith(transaction);
    });
  });

  describe('updateTransactionStatus', () => {
    it('should update the status of a transaction', async () => {
      const transactionId = '123456789012345678901234';
      const webhookDTO: WebhookDTO = {
        transactionId, status: 'completed',
        orderId: ''
      };
      const transaction = { _id: transactionId, status: 'pending', total: 100 } as unknown as Transaction;
      dataServices.transactions.get.mockResolvedValue(transaction);
      const updatedTransaction = { ...transaction, status: 'completed' };
      dataServices.transactions.update.mockResolvedValue(updatedTransaction);

      const result = await transactionUseCases.updateTransactionStatus(webhookDTO);
      expect(result).toEqual(updatedTransaction);
      expect(dataServices.transactions.get).toHaveBeenCalledWith(transactionId);
      expect(dataServices.transactions.update).toHaveBeenCalledWith(transactionId, updatedTransaction);
    });

    it('should throw NotFoundException when transaction is not found for updating status', async () => {
      const transactionId = '123456789012345678901234';
      const webhookDTO: WebhookDTO = {
        transactionId, status: 'completed',
        orderId: ''
      };
      dataServices.transactions.get.mockResolvedValue(null);

      await expect(transactionUseCases.updateTransactionStatus(webhookDTO)).rejects.toThrow(NotFoundException);
    });
  });

  describe('TransactionFactoryService', () => {
    let transactionFactoryService: TransactionFactoryService;
    let dataServices;
    let orderClient;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TransactionFactoryService,
          { provide: IOrderPortToken, useFactory: mockOrderClient },
          { provide: IDataServices, useFactory: mockDataServices },
        ],
      }).compile();

      transactionFactoryService = module.get<TransactionFactoryService>(TransactionFactoryService);
      dataServices = module.get<IDataServices>(IDataServices);
      orderClient = module.get<IOrderPort>(IOrderPortToken);
    });

    it('should be defined', () => {
      expect(transactionFactoryService).toBeDefined();
    });

    describe('createNewTransaction', () => {
      it('should create and return a new transaction', async () => {
        const transactionDTO: TransactionDTO = { paymentMethodId: 'payment123' };
        const cartId = 'cart123';
        const paymentMethod = { name: 'Credit Card', description: 'Visa' } as PaymentMethod;
        const cartData: AxiosResponse<Cart> = {
          data: { total: 100 } as Cart,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {
            headers: undefined
          },
        };

        dataServices.payments.get.mockResolvedValue(paymentMethod);
        orderClient.getCartById.mockResolvedValue(cartData);

        const result = await transactionFactoryService.createNewTransaction(transactionDTO, cartId);

        expect(result.paymentMethod).toEqual(paymentMethod);
        expect(result.total).toEqual(cartData.data.total);
        expect(result.status).toEqual('Pendente');
        expect(dataServices.payments.get).toHaveBeenCalledWith(transactionDTO.paymentMethodId);
        expect(orderClient.getCartById).toHaveBeenCalledWith(`${cartId}`);
      });
    });
  });

  describe('OrderAdapter', () => {

    let orderAdapter: OrderAdapter;
    let httpService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OrderAdapter,
          { provide: HttpService, useFactory: mockHttpService },
        ],
      }).compile();

      orderAdapter = module.get<OrderAdapter>(OrderAdapter);
      httpService = module.get<HttpService>(HttpService);
    });


    it('should be defined', () => {
      expect(orderAdapter).toBeDefined();
    });

    describe('getCartById', () => {
      it('should return cart data from local URL', async () => {
        const cartId = 'cart123';
        const cartData: AxiosResponse<Cart> = {
          data: { total: 100 } as Cart,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {
            headers: undefined
          },
        };


        httpService.axiosRef.get.mockResolvedValueOnce(cartData);

        const result = await orderAdapter.getCartById(cartId);
        expect(result).toEqual(cartData);
        expect(httpService.axiosRef.get).toHaveBeenCalledWith(`http://0.0.0.0:3001/carts/id/${cartId}`);
      });

      it('should return cart data from container URL if local URL fails', async () => {
        const cartId = 'cart123';
        const cartData: AxiosResponse<Cart> = {
          data: { total: 100 } as Cart,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {
            headers: undefined
          },
        };

        httpService.axiosRef.get
          .mockRejectedValueOnce(new Error('Local URL failed'))
          .mockResolvedValueOnce(cartData);

        const result = await orderAdapter.getCartById(cartId);
        expect(result).toEqual(cartData);
        expect(httpService.axiosRef.get).toHaveBeenCalledWith(`http://0.0.0.0:3001/carts/id/${cartId}`);
        expect(httpService.axiosRef.get).toHaveBeenCalledWith(`http://order_ms:3001/carts/id/${cartId}`);
      });
    });

  });

});