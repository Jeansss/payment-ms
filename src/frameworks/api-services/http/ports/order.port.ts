import { AxiosResponse } from "axios";
import { Cart } from "src/frameworks/data-services/mongo/entities/cart.model";

export interface IOrderPort {

    getCartById(cartId: string): Promise<AxiosResponse<Cart>>;

}

export const IOrderPortToken = Symbol("IOrderPort");