import { Inject, Injectable, Logger } from "@nestjs/common";
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
        Logger.log(`OrderClientResponse aqui 1: ${orderClientResponse}`);
        const foundCart = orderClientResponse.data;
        Logger.log(`OrderClientResponse aqui 2: ${orderClientResponse}`);
        const transaction = new Transaction();
        Logger.log(`OrderClientResponse aqui 3: ${orderClientResponse}`);
        transaction.paymentMethod = foundPaymentMethod;
        Logger.log(`OrderClientResponse aqui 4: ${orderClientResponse}`);
        transaction.total = foundCart.total;
        Logger.log(`OrderClientResponse aqui 5: ${orderClientResponse}`);
        Logger.log(`OrderClientResponse aqui 6: ${orderClientResponse.data}`);
        transaction.status = 'Pendente';
        return transaction;
    }

    getOrderClient() {
        return this.orderClient;
    }
}
