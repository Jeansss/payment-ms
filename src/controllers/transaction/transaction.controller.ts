import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionDTO } from 'src/dto/transaction.dto';
import { Transaction } from 'src/frameworks/data-services/mongo/entities/transaction.model';
import { TransactionUseCases } from 'src/use-cases/transaction/transaction.use-case';

@ApiTags('Transactions')
@Controller('/transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private transactionUseCases: TransactionUseCases) { }

  @Post('/cart/:cartId/')
  async createTransaction(@Param('cartId') cartId: string, @Body() transactionDto: TransactionDTO): Promise<Transaction> {
    this.logger.log(`createTransaction(TransactionDTO) - Start`);
    return this.transactionUseCases.createTransaction(transactionDto, cartId);
  }

  @Get('/:id/')
  async getTransactionById(@Param('id') transactionId: string): Promise<Transaction> {
    this.logger.log(`getTransactionById(string) - Start`);
    return this.transactionUseCases.getTransactionById(transactionId);
  }
}
