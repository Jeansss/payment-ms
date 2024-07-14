import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from 'src/controllers/payment/payment.controller';
import { PaymentUseCases } from 'src/use-cases/payment/payment.use-case';
import { PaymentDTO } from 'src/dto/payment.dto';
import { PaymentMethod } from 'src/frameworks/data-services/mongo/entities/payment.model';

const mockPaymentUseCases = () => ({
  createPayment: jest.fn(),
  getAllPayments: jest.fn(),
  getPaymentById: jest.fn(),
  updatePayment: jest.fn(),
  delete: jest.fn(),
});

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        { provide: PaymentUseCases, useFactory: mockPaymentUseCases },
      ],
    }).compile();

    paymentController = module.get<PaymentController>(PaymentController);
    paymentUseCases = module.get<PaymentUseCases>(PaymentUseCases);
  });

  it('should be defined', () => {
    expect(paymentController).toBeDefined();
  });

  describe('createPaymentMethod', () => {
    it('should create and return a new payment method', async () => {
      const paymentDTO: PaymentDTO = { name: 'Credit Card', description: 'Visa' };
      const payment = { _id: 'payment123', ...paymentDTO } as PaymentMethod;

      paymentUseCases.createPayment.mockResolvedValue(payment);

      const result = await paymentController.createPaymentMethod(paymentDTO);
      expect(result).toEqual(payment);
      expect(paymentUseCases.createPayment).toHaveBeenCalledWith(paymentDTO);
    });
  });

  describe('getAllPaymentMethods', () => {
    it('should return an array of payment methods', async () => {
      const payments = [{ name: 'Credit Card', description: 'Visa' } as PaymentMethod];
      paymentUseCases.getAllPayments.mockResolvedValue(payments);

      const result = await paymentController.getAllPaymentMethods();
      expect(result).toEqual(payments);
      expect(paymentUseCases.getAllPayments).toHaveBeenCalled();
    });
  });

  describe('getPaymentMethodByID', () => {
    it('should return a payment method by ID', async () => {
      const paymentId = '123456789012345678901234';
      const payment = { _id: paymentId, name: 'Credit Card', description: 'Visa' } as PaymentMethod;

      paymentUseCases.getPaymentById.mockResolvedValue(payment);

      const result = await paymentController.getPaymentMethodByID(paymentId);
      expect(result).toEqual(payment);
      expect(paymentUseCases.getPaymentById).toHaveBeenCalledWith(paymentId);
    });

    it('should throw an error when the ID is invalid', async () => {
      const paymentId = 'invalid-id';
      paymentUseCases.getPaymentById.mockRejectedValue(new Error('Invalid ID'));

      try {
        await paymentController.getPaymentMethodByID(paymentId);
      } catch (error) {
        expect(error.message).toEqual('Invalid ID');
      }
    });
  });

  describe('updatePaymentMethod', () => {
    it('should update and return the payment method', async () => {
      const paymentId = '123';
      const paymentDTO: PaymentDTO = { name: 'Debit Card', description: 'MasterCard' };
      const payment = { _id: paymentId, ...paymentDTO } as PaymentMethod;

      paymentUseCases.updatePayment.mockResolvedValue(payment);

      const result = await paymentController.updatePaymentMethod(paymentId, paymentDTO);
      expect(result).toEqual(payment);
      expect(paymentUseCases.updatePayment).toHaveBeenCalledWith(paymentId, paymentDTO);
    });
  });

  describe('removePaymentMethod', () => {
    it('should delete the payment method', async () => {
      const paymentId = '123456789012345678901234';
      paymentUseCases.delete.mockResolvedValue(undefined);

      const result = await paymentController.removePaymentMethod(paymentId);
      expect(result).toBeUndefined();
      expect(paymentUseCases.delete).toHaveBeenCalledWith(paymentId);
    });
  });
});