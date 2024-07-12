import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Put } from '@nestjs/common';
import { PaymentDTO } from '../../dto/payment.dto';
import { PaymentUseCases } from 'src/use-cases/payment/payment.use-case';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment Methods')
@Controller('payments')
export class PaymentController {

  private readonly logger = new Logger(PaymentController.name);

  constructor(private paymentUseCases: PaymentUseCases) { }

  @Post()
  createPaymentMethod(@Body() createPaymentDto: PaymentDTO) {
    this.logger.log(`createPaymentMethod(PaymentDTO) - Start`);
    return this.paymentUseCases.createPayment(createPaymentDto);
  }

  @Get()
  getAllPaymentMethods() {
    this.logger.log(`getAllPaymentMethods() - Start`);
    return this.paymentUseCases.getAllPayments();
  }

  @Get('/id/:paymentId')
  getPaymentMethodByID(@Param('paymentId') paymentId: string) {
    this.logger.log(`getPaymentMethodByID(string) - Start`);
    return this.paymentUseCases.getPaymentById(paymentId);
  }

  @Put('/:paymentId')
  updatePaymentMethod(@Param('paymentId') paymentId: string, @Body() updatePaymentDto: PaymentDTO) {
    this.logger.log(`updatePaymentMethod(string, PaymentDTO) - Start`);
    return this.paymentUseCases.updatePayment(paymentId, updatePaymentDto);
  }

  @Delete('/:paymentId')
  removePaymentMethod(@Param('paymentId') paymentId: string) {
    this.logger.log(`removePaymentMethod(string) - Start`);
    return this.paymentUseCases.delete(paymentId);
  }
}
