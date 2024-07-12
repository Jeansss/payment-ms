import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { PaymentController } from './controllers/payment/payment.controller';
import { PaymentUseCaseModule } from './use-cases/payment/payment.use-cases.module';
import { TransactionController } from './controllers/transaction/transaction.controller';
import { TransactionUseCaseModule } from './use-cases/transaction/transaction.use-cases.module';
import { WebhookController } from './controllers/webhook/webhook.controller';


@Module({
  imports: [PaymentUseCaseModule, TransactionUseCaseModule],
  controllers: [
    AppController,
    PaymentController,
    TransactionController,
    WebhookController
  ],
  providers: [],
})

export class AppModule { }
