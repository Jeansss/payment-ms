import { Inject, Injectable } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { TransactionDTO } from "src/dto/transaction.dto";
import { IOrderPort, IOrderPortToken } from "src/frameworks/api-services/http/ports/order.port";
import { Transaction } from "src/frameworks/data-services/mongo/entities/transaction.model";

@Injectable()
export class TransactionFactoryService {

    constructor(private dataServices: IDataServices, @Inject(IOrderPortToken) private orderClient: IOrderPort) { }

    async createNewTransaction(transactionDTO: TransactionDTO, cartId: string): Promise<Transaction> {
        const foundPaymentMethod = await this.dataServices.payments.get(transactionDTO.paymentMethodId);
        const orderClientResponse = await this.orderClient.getCartById(cartId);
        const foundCart = orderClientResponse.data;
        const transaction = new Transaction();
        transaction.paymentMethod = foundPaymentMethod;
        transaction.total = foundCart.total;
        transaction.status = 'Pendente';
        return transaction;
    }
}
