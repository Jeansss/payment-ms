import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/services/data-services.module";
import { PaymentFactoryService } from "./payment-factory.service";
import { PaymentUseCases } from "./payment.use-case";

@Module({
    imports: [DataServicesModule],
    providers: [PaymentFactoryService, PaymentUseCases],
    exports: [PaymentFactoryService, PaymentUseCases]
})
export class PaymentUseCaseModule { }