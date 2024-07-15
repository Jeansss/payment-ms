import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentUseCases } from 'src/use-cases/payment/payment.use-case';
import { PaymentDTO } from 'src/dto/payment.dto';
import { PaymentController } from 'src/controllers/payment/payment.controller';
import { PaymentMethod } from 'src/frameworks/data-services/mongo/entities/payment.model';

const feature = loadFeature('./test/payment.feature');

const mockPaymentUseCases = () => ({
  createPayment: jest.fn(),
  getAllPayments: jest.fn(),
  getPaymentById: jest.fn(),
  updatePayment: jest.fn(),
  delete: jest.fn(),
});

defineFeature(feature, test => {
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

  test('Create a new payment method', ({ given, when, then }) => {
    let paymentDTO: PaymentDTO;
    let payment: PaymentMethod;

    given('I have a payment method', () => {
      paymentDTO = { name: 'Credit Card', description: 'Details of the credit card' } as unknown as PaymentDTO;
    });

    when('I create the payment method', async () => {
      payment = { _id: 'paymentId', ...paymentDTO } as PaymentMethod;
      paymentUseCases.createPayment.mockResolvedValue(payment);
      payment = await paymentController.createPaymentMethod(paymentDTO);
    });

    then('I should receive the created payment method', () => {
      expect(payment).toEqual({ _id: 'paymentId', ...paymentDTO });
      expect(paymentUseCases.createPayment).toHaveBeenCalledWith(paymentDTO);
    });
  });

  test('Get all payment methods', ({ given, when, then }) => {
    let payments: PaymentMethod[];

    given('there are payment methods in the system', () => {
      payments = [
        { _id: 'paymentId1', name: 'Credit Card', description: 'Details of the credit card' } as unknown as PaymentMethod,
        { _id: 'paymentId2', name: 'Mercado Pago', description: 'Details of Mercado Pago' } as unknown as PaymentMethod,
      ];
      paymentUseCases.getAllPayments.mockResolvedValue(payments);
    });

    when('I get all payment methods', async () => {
      payments = await paymentController.getAllPaymentMethods();
    });

    then('I should receive a list of payment methods', () => {
      expect(payments).toEqual([
        { _id: 'paymentId1', name: 'Credit Card', description: 'Details of the credit card' },
        { _id: 'paymentId2', name: 'Mercado Pago', description: 'Details of Mercado Pago' },
      ]);
      expect(paymentUseCases.getAllPayments).toHaveBeenCalled();
    });
  });
});