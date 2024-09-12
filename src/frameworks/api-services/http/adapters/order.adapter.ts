import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { IOrderPort } from "../ports/order.port";
import { Cart } from "src/frameworks/data-services/mongo/entities/cart.model";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class OrderAdapter implements IOrderPort {

    constructor(private readonly httpService: HttpService) { }

    getCartById(cartId: string): Promise<AxiosResponse<Cart>> {
        const finalUrl = `http://af2656d4febb4451d86617b0e544401e-1306484774.us-east-1.elb.amazonaws.com/carts/id/${cartId}`;

        return this.httpService.axiosRef.get(finalUrl, { proxy: false });

    }

    addTransactionToCart(cartId: string, transactionId: string): Promise<AxiosResponse> {
        const finalUrl = `http://af2656d4febb4451d86617b0e544401e-1306484774.us-east-1.elb.amazonaws.com/carts/${cartId}/transactions/${transactionId}`

        return this.httpService.
            axiosRef.put(finalUrl, { proxy: false });
    }

}