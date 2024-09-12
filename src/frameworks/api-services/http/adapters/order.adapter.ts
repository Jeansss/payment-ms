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
        Logger.log(`la vai request to ${finalUrl}`);
        Logger.log(`la vai request to ${cartId}`);
        Logger.log(`...`);
        Logger.log(`...`);
        Logger.log(`...`);
        Logger.log(`...`);




        return this.httpService.axiosRef.get(finalUrl,
            { headers: { 'Content-Type': 'application/json' }, proxy: false }
        ).then((response) => {
            Logger.log(`response from ${finalUrl}`);
            Logger.log(response.data);
            return response;
        }).catch((error) => {
            Logger.error(`error from ${finalUrl}`);
            Logger.error(error);
            return error;
        });

    }

    addTransactionToCart(cartId: string, transactionId: string): Promise<AxiosResponse> {
        const finalUrl = `http://af2656d4febb4451d86617b0e544401e-1306484774.us-east-1.elb.amazonaws.com/carts/${cartId}/transactions/${transactionId}`

        return this.httpService.
            axiosRef.put(finalUrl);
    }

}
