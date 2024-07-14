import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { PaymentUseCases } from 'src/use-cases/payment/payment.use-case';
import { PaymentFactoryService } from 'src/use-cases/payment/payment-factory.service';
import { PaymentMethod } from 'src/frameworks/data-services/mongo/entities/payment.model';
import { PaymentDTO } from 'src/dto/payment.dto';

const mockDataServices = () => ({
  payments: {
    getAll: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

const mockPaymentFactoryService = () => ({
  createNewPayment: jest.fn(),
  updatePayment: jest.fn(),
});

describe('PaymentUseCases', () => {
  let paymentUseCases: PaymentUseCases;
  let dataServices;
  let paymentFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentUseCases,
        { provide: IDataServices, useFactory: mockDataServices },
        { provide: PaymentFactoryService, useFactory: mockPaymentFactoryService },
      ],
    }).compile();

    paymentUseCases = module.get<PaymentUseCases>(PaymentUseCases);
    dataServices = module.get<IDataServices>(IDataServices);
    paymentFactoryService = module.get<PaymentFactoryService>(PaymentFactoryService);
  });

  it('should be defined', () => {
    expect(paymentUseCases).toBeDefined();
  });

  describe('getAllPayments', () => {
    it('should return an array of payment methods', async () => {
      const payments = [{ name: 'Credit Card', description: 'Visa' } as PaymentMethod];
      dataServices.payments.getAll.mockResolvedValue(payments);

      const result = await paymentUseCases.getAllPayments();
      expect(result).toEqual(payments);
      expect(dataServices.payments.getAll).toHaveBeenCalled();
    });

    it('should return an empty array when no payment methods are found', async () => {
      dataServices.payments.getAll.mockResolvedValue([]);

      const result = await paymentUseCases.getAllPayments();
      expect(result).toEqual([]);
      expect(dataServices.payments.getAll).toHaveBeenCalled();
    });
  });

  describe('getPaymentById', () => {
    it('should return a payment method when found', async () => {
      const paymentId = '123456789012345678901234';
      const payment = { _id: paymentId, name: 'Credit Card', description: 'Visa' } as PaymentMethod;
      dataServices.payments.get.mockResolvedValue(payment);

      const result = await paymentUseCases.getPaymentById(paymentId);
      expect(result).toEqual(payment);
      expect(dataServices.payments.get).toHaveBeenCalledWith(paymentId);
    });

    it('should throw NotFoundException when payment method is not found', async () => {
      const paymentId = '123456789012345678901234';
      dataServices.payments.get.mockResolvedValue(null);

      await expect(paymentUseCases.getPaymentById(paymentId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid id format', async () => {
      const invalidId = 'invalid-id';

      await expect(paymentUseCases.getPaymentById(invalidId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('createPayment', () => {
    it('should create and return a new payment method', async () => {
      const paymentDTO: PaymentDTO = { name: 'Credit Card', description: 'Visa' };
      const payment = { _id: 'payment123', ...paymentDTO } as PaymentMethod;
      paymentFactoryService.createNewPayment.mockReturnValue(payment);
      dataServices.payments.create.mockResolvedValue(payment);

      const result = await paymentUseCases.createPayment(paymentDTO);
      expect(result).toEqual(payment);
      expect(paymentFactoryService.createNewPayment).toHaveBeenCalledWith(paymentDTO);
      expect(dataServices.payments.create).toHaveBeenCalledWith(payment);
    });
  });

  describe('updatePayment', () => {
    it('should update and return the payment method', async () => {
      const paymentId = '123';
      const paymentDTO: PaymentDTO = { name: 'Debit Card', description: 'MasterCard' };
      const payment = { _id: paymentId, ...paymentDTO } as PaymentMethod;
      paymentFactoryService.updatePayment.mockReturnValue(payment);
      dataServices.payments.update.mockResolvedValue(payment);

      const result = await paymentUseCases.updatePayment(paymentId, paymentDTO);
      expect(result).toEqual(payment);
      expect(paymentFactoryService.updatePayment).toHaveBeenCalledWith(paymentDTO);
      expect(dataServices.payments.update).toHaveBeenCalledWith(paymentId, payment);
    });
  });

  describe('delete', () => {
    it('should delete the payment method', async () => {
      const paymentId = '123456789012345678901234';
      dataServices.payments.get.mockResolvedValue({ _id: paymentId } as unknown as PaymentMethod);
      dataServices.payments.delete.mockResolvedValue(undefined);

      await paymentUseCases.delete(paymentId);
      expect(dataServices.payments.get).toHaveBeenCalledWith(paymentId);
      expect(dataServices.payments.delete).toHaveBeenCalledWith(paymentId);
    });

    it('should throw NotFoundException when payment method is not found for deletion', async () => {
      const paymentId = '123456789012345678901234';
      dataServices.payments.get.mockResolvedValue(null);

      await expect(paymentUseCases.delete(paymentId)).rejects.toThrow(NotFoundException);
    });
  });
});