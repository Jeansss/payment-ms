import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { IOrderPort } from "../ports/order.port";
import { Cart } from "src/frameworks/data-services/mongo/entities/cart.model";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class OrderAdapter implements IOrderPort {

    constructor(private readonly httpService: HttpService) { }

    getCartById(cartId: string): Promise<AxiosResponse<Cart>> {
        const finalUrl = `http://a59f54af5f28248c69e4716843c7f622-726326170.us-east-1.elb.amazonaws.com/carts/id/${cartId}`;
        Logger.log(`la vai request to ${finalUrl}`);

        return this.httpService.axiosRef.get(finalUrl, {
            headers: { 'Content-Type': 'application/json' },
            proxy: false
        })
        .then((response) => {
            Logger.log(`Response from ${finalUrl}`);
            Logger.log(response.data);
            return response;
        })
        .catch((error) => {
            Logger.error(`Error from ${finalUrl}`);
            if (error.response) {
                Logger.error(`Error status: ${error.response.status}`);
                Logger.error(`Error data: ${JSON.stringify(error.response.data)}`);
            } else {
                Logger.error(`Error message: ${error.message}`);
            }
            return null;
    });

    }


    
    addTransactionToCart(cartId: string, transactionId: string): Promise<AxiosResponse> {
        const finalUrl = `http://a59f54af5f28248c69e4716843c7f622-726326170.us-east-1.elb.amazonaws.com/carts/${cartId}/transactions/${transactionId}`


        return this.httpService.axiosRef.put(finalUrl, {
            headers: { 'Content-Type': 'application/json' },
            proxy: false
        })
        .then((response) => {
            Logger.log(`Response from ${finalUrl}`);
            Logger.log(response.data);
            return response;
        })
        .catch((error) => {
            Logger.error(`Error from ${finalUrl}`);
            if (error.response) {
                Logger.error(`Error status: ${error.response.status}`);
                Logger.error(`Error data: ${JSON.stringify(error.response.data)}`);
            } else {
                Logger.error(`Error message: ${error.message}`);
            }
            return null;
    });
    }

}
