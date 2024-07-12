import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { Transaction } from "src/frameworks/data-services/mongo/entities/transaction.model";
import { TransactionDTO } from "src/dto/transaction.dto";
import { TransactionFactoryService } from "./transaction-factory.service";
import { WebhookDTO } from "src/dto/webhook-transaction.dto";

@Injectable()
export class TransactionUseCases {

    constructor(private dataServices: IDataServices, private transactionFactoryService: TransactionFactoryService) { }

    async getTransactionById(id: string): Promise<Transaction> {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const foundTransaction = this.dataServices.transactions.get(id);

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
        return this.dataServices.transactions.create(await newTransaction);
    }

    async updateTransactionStatus(payload: WebhookDTO): Promise<Transaction> {
        const foundTransaction = await this.getTransactionById(payload.transactionId);
        foundTransaction.status = payload.status;
        return this.dataServices.transactions.update(payload.transactionId, foundTransaction);
    }
}
