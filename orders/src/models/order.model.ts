import { OrderStatus } from '@ar-ticketing/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import { Ticket, TicketDocument } from './ticket.model';
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

  @Prop({
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  })
  status: OrderStatus;

  @Prop({ required: true, type: Date })
  expiresAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Ticket.name })
  ticket: TicketDocument;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export type OrderModel = Model<OrderDocument>;
export const orderModelFactory = () => {
  OrderSchema.plugin(updateIfCurrentPlugin);
  return OrderSchema;
};
