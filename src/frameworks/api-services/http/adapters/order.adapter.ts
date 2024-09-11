import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { IOrderPort } from "../ports/order.port";
import { Cart } from "src/frameworks/data-services/mongo/entities/cart.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderAdapter implements IOrderPort {

    constructor(private readonly httpService: HttpService) { }

    getCartById(cartId: string): Promise<AxiosResponse<Cart>> {
        const localURL = `http://0.0.0.0:3001/carts/id/${cartId}`;
        const containerURL = `http://order_ms:3001/carts/id/${cartId}`;

        return this.httpService.
            axiosRef.get(localURL)
            .catch(() => {
                return this.httpService.
                    axiosRef.get(containerURL)
            });
    }

    addTransactionToCart(cartId: string, transactionId: string): Promise<AxiosResponse> {
        const localURL = `http://0.0.0.0:3001/carts/${cartId}/transactions/${transactionId}`;
        const containerURL = `http://order_ms:3001/carts/${cartId}/transactions/${transactionId}`;

        return this.httpService.
            axiosRef.put(localURL)
            .catch(() => {
                return this.httpService.
                    axiosRef.get(containerURL)
            });
    }

}