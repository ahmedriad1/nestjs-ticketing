import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { OrderModel } from './order.model';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@ar-ticketing/common';

export type TicketDocument = Ticket &
  Document & { isReserved: () => Promise<boolean>; version: number };

@Schema({
  versionKey: 'version',
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Ticket {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, trim: true })
  ownerId: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

type FindTicketEvent = { id: string; version: number };

export type TicketModel = Model<TicketDocument> & {
  findByEvent: (event: FindTicketEvent) => Promise<TicketDocument>;
};

export const ticketModelFactory = (orderModel: OrderModel) => {
  TicketSchema.plugin(updateIfCurrentPlugin);
  TicketSchema.statics.findByEvent = function (event: FindTicketEvent) {
    return this.findOne({
      id: event.id,
      version: event.version - 1,
    });
  };
  TicketSchema.methods.isReserved = async function () {
    return orderModel.exists({
      ticket: this as any,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });
  };
  return TicketSchema;
};
