import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { PaymentFactoryService } from "./payment-factory.service";
import { PaymentMethod } from "src/frameworks/data-services/mongo/entities/payment.model";
import { PaymentDTO } from "src/dto/payment.dto";

@Injectable()
export class PaymentUseCases {

    constructor(private dataServices: IDataServices, private paymentFactoryService: PaymentFactoryService) { }

    async getAllPayments(): Promise<PaymentMethod[]> {
        return await this.dataServices.payments.getAll();
    }

    async getPaymentById(id: string): Promise<PaymentMethod> {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const foundPayment = await this.dataServices.payments.get(id);

            if (foundPayment != null) {
                return foundPayment;
            } else {
                throw new NotFoundException(`Payment with id: ${id} not found at database.`);
            }
        } else {
            throw new BadRequestException(`'${id}' is not a valid ObjectID`);
        }
    }

    async createPayment(paymentDTO: PaymentDTO): Promise<PaymentMethod> {
        const newPayment = this.paymentFactoryService.createNewPayment(paymentDTO);
        return this.dataServices.payments.create(newPayment);
    }

    async updatePayment(paymentId: string, paymentDTO: PaymentDTO): Promise<PaymentMethod> {
        const newPayment = this.paymentFactoryService.updatePayment(paymentDTO);
        return this.dataServices.payments.update(paymentId, newPayment);
    }

    async delete(paymentId: string) {
        await this.getPaymentById(paymentId)
            .then(this.dataServices.payments.delete(paymentId));
    }

}