import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PaymentMethodDocument = PaymentMethod & Document;

@Schema()
export class PaymentMethod {
    @Prop()
    name: string;
    @Prop()
    description: string;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);