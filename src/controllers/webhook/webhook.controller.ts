import {
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionUseCases } from 'src/use-cases/transaction/transaction.use-case';
import { WebhookDTO } from 'src/dto/webhook-transaction.dto';
// import { OrderUseCases } from 'src/use-cases/order/order.use-case';

@ApiTags('Webhook')
@Controller('/webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private transactionUseCases: TransactionUseCases ) { }

  @Post('/payment')
  async paymentWebhook(@Body() payload: WebhookDTO): Promise<any> {
    try {
      this.logger.log(`paymentWebhook(TransactionDTO) - Start`);
      await this.transactionUseCases.updateTransactionStatus(payload);
      // await this.orderUseCases.updateOrderTransactionStatus(payload);
      return { status: 'success' };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }
}
