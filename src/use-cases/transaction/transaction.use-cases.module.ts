import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/services/data-services.module";
import { TransactionFactoryService } from "./transaction-factory.service";
import { TransactionUseCases } from "./transaction.use-case";
import { HttpModule } from "@nestjs/axios";
import { IOrderPortToken } from "src/frameworks/api-services/http/ports/order.port";
import { OrderAdapter } from "src/frameworks/api-services/http/adapters/order.adapter";
import { SQSProducerService } from "src/frameworks/messaging-services/sqs-messaging-services.service";

@Module({
    imports: [DataServicesModule, HttpModule],
    providers: [TransactionFactoryService, TransactionUseCases, { provide: IOrderPortToken, useClass: OrderAdapter }, SQSProducerService],
    exports: [TransactionFactoryService, TransactionUseCases, SQSProducerService]
})
export class TransactionUseCaseModule { }