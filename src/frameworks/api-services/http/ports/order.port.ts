import { AxiosResponse } from "axios";
import { Cart } from "src/frameworks/data-services/mongo/entities/cart.model";

export interface IOrderPort {

    getCartById(cartId: string): Promise<Cart>;
    addTransactionToCart(cartId: string, transactionId: string): Promise<AxiosResponse>;

}

export const IOrderPortToken = Symbol("IOrderPort");