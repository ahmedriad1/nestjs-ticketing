import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export type PaymentDocument = Payment & Document & { version: number };

@Schema({
  versionKey: 'version',
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Payment {
  @Prop({ required: true, trim: true })
  orderId: string;

  @Prop({ required: true, trim: true })
  stripeId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

export type PaymentModel = Model<PaymentDocument>;

export const paymentModelFactory = async () => {
  PaymentSchema.plugin(updateIfCurrentPlugin);
  return PaymentSchema;
};
