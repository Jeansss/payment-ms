import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/services/data-services.module";
import { TransactionFactoryService } from "./transaction-factory.service";
import { TransactionUseCases } from "./transaction.use-case";
import { HttpModule } from "@nestjs/axios";
import { IOrderPortToken } from "src/frameworks/api-services/http/ports/order.port";
import { OrderAdapter } from "src/frameworks/api-services/http/adapters/order.adapter";

@Module({
    imports: [DataServicesModule, HttpModule],
    providers: [TransactionFactoryService, TransactionUseCases, { provide: IOrderPortToken, useClass: OrderAdapter }],
    exports: [TransactionFactoryService, TransactionUseCases]
})
export class TransactionUseCaseModule { }