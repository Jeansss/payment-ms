import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/services/data-services.module";
import { TransactionFactoryService } from "./transaction-factory.service";
import { TransactionUseCases } from "./transaction.use-case";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [DataServicesModule, HttpModule],
    providers: [TransactionFactoryService, TransactionUseCases],
    exports: [TransactionFactoryService, TransactionUseCases]
})
export class TransactionUseCaseModule { }