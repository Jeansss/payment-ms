//import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//export type ProductDocument = Product & Document;

//@Schema()
export class Product {
  //@Prop()
  name: string;
  //@Prop()
  sku: string;
  //@Prop()
  category: string;
  //@Prop()
  value: number;
  //@Prop()
  quantity: number;
  //@Prop()
  description: string;
}

//export const ProductSchema = SchemaFactory.createForClass(Product);
