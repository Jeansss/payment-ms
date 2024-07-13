// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// export type CustomerDocument = Customer & Document;

// @Schema()
export class Customer {
    // @Prop()
    name: string;
    // @Prop()
    cpf: string;
    // @Prop()
    email: string;
}

// export const CustomerSchema = SchemaFactory.createForClass(Customer);