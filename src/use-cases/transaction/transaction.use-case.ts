import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { Transaction } from "src/frameworks/data-services/mongo/entities/transaction.model";
import { TransactionDTO } from "src/dto/transaction.dto";
import { TransactionFactoryService } from "./transaction-factory.service";
import { WebhookDTO } from "src/dto/webhook-transaction.dto";
import { JOB_TYPES, SQSProducerService } from "src/frameworks/messaging-services/sqs-messaging-services.service";

@Injectable()
export class TransactionUseCases {

    private readonly logger = new Logger(TransactionUseCases.name);

    constructor(
        private dataServices: IDataServices, 
        private transactionFactoryService: TransactionFactoryService,
        private sqsProducerService: SQSProducerService
    ) { }

    async getTransactionById(id: string): Promise<Transaction> {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const foundTransaction = await this.dataServices.transactions.get(id);

            if (foundTransaction != null) {
                return foundTransaction;
            } else {
                throw new NotFoundException(`Transaction with id: ${id} not found at database.`);
            }
        } else {
            throw new BadRequestException(`'${id}' is not a valid ObjectID`);
        }
    }

    async createTransaction(transactionDTO: TransactionDTO, cartId: string): Promise<Transaction> {
        const newTransaction = this.transactionFactoryService.createNewTransaction(transactionDTO, cartId);
        const createdTransaction = await this.dataServices.transactions.create(await newTransaction);
        await this.transactionFactoryService.getOrderClient().addTransactionToCart(cartId, createdTransaction.id); // update cart entity
        return createdTransaction;
    }

    async updateTransactionStatus(payload: WebhookDTO): Promise<Transaction> {
        const foundTransaction = await this.getTransactionById(payload.transactionId);
        foundTransaction.status = payload.status;
        const result = await this.dataServices.transactions.update(payload.transactionId, foundTransaction);
        if (result.status == "Aprovado" || result.status == "aprovado") {
            this.sqsProducerService.sendNewChargeEvent(result, JOB_TYPES.CHARGE_EVENTS); // Envia transactionID para fila NEW_TRANSACTION_EVENT
        } else {
            this.logger.log(`The transaction's payment has been declined and it's status has been updated to: ${result.status}`);
        }
        return result;
    }
}
