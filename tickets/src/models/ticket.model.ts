import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export type TicketDocument = Ticket & Document & { version: number };

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

  @Prop({ trim: true })
  orderId?: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

export type TicketModel = Model<TicketDocument>;

export const ticketModelFactory = async () => {
  TicketSchema.plugin(updateIfCurrentPlugin);
  return TicketSchema;
};
