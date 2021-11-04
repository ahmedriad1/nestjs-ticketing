import { OrderStatus } from '@ar-ticketing/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export type OrderDocument = Order & Document & { version: number };

@Schema({
  versionKey: 'version',
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Order {
  @Prop({ required: true, trim: true })
  userId: string;

  @Prop({ required: true })
  price: number;

  @Prop({
    enum: Object.values(OrderStatus),
    required: true,
  })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderModel = Model<OrderDocument>;

export const orderModelFactory = async () => {
  OrderSchema.plugin(updateIfCurrentPlugin);
  return OrderSchema;
};
