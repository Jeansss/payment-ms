import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PaymentMethod, PaymentMethodSchema } from "./payment.model";

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ type: PaymentMethodSchema })
  paymentMethod: PaymentMethod;
  @Prop()
  status: string;
  @Prop()
  total: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
