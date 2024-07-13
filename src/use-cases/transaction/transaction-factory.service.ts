import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { TransactionDTO } from "src/dto/transaction.dto";
import { Cart } from "src/frameworks/data-services/mongo/entities/cart.model";
import { Transaction } from "src/frameworks/data-services/mongo/entities/transaction.model";

@Injectable()
export class TransactionFactoryService {
    constructor(private dataServices: IDataServices, private readonly httpService: HttpService) {}

    getExternalCart(cartId: string): Promise<AxiosResponse<Cart>> {
        const localURL = `http://0.0.0.0:3001/carts/id/${cartId}`;
        const containerURL = `http://cart_ms:3001/carts/id/${cartId}`;

        return this.httpService.
            axiosRef.get(localURL)
            .catch(() => {
                return this.httpService.
                    axiosRef.get(containerURL)
            });
    }

    async createNewTransaction(transactionDTO: TransactionDTO, cartId: string): Promise<Transaction> {
        const foundPaymentMethod = await this.dataServices.payments.get(transactionDTO.paymentMethodId);
        const foundCart = await this.getExternalCart(cartId);
        const transaction = new Transaction();
        transaction.paymentMethod = foundPaymentMethod;
        transaction.total = foundCart.data.total;
        transaction.status = 'Pendente';
        return transaction;
    }
}
