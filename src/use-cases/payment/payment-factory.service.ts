import { Injectable } from "@nestjs/common";
import { PaymentDTO } from "src/dto/payment.dto";
import { PaymentMethod } from "src/frameworks/data-services/mongo/entities/payment.model";

@Injectable()
export class PaymentFactoryService {
    createNewPayment(paymentDTO: PaymentDTO): PaymentMethod {
        const payment = new PaymentMethod();
        payment.name = paymentDTO.name;
        payment.description = paymentDTO.description;
        return payment;
    }

    updatePayment(paymentDTO: PaymentDTO): PaymentMethod {
        const updatePayment = new PaymentMethod();
        Object.entries(paymentDTO).forEach(([key, value]) => {
            if (key === 'id') return;
            updatePayment[key] = value;
        });
        return updatePayment;
    }
}