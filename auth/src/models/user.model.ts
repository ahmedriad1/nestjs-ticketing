import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User &
  Document & { isValidPassword: (password: string) => Promise<boolean> };

@Schema({
  toJSON: {
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    },
  },
})
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ unique: true, required: true, trim: true })
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserModel = Model<UserDocument>;

export const userModelFactory = async () => {
  UserSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
      const newPassword = await bcrypt.hash(this.get('password'), 10);
      this.set('password', newPassword);
    }
    done();
  });

  UserSchema.methods.isValidPassword = async function (password: string) {
    return await bcrypt.compare(password, this.get('password'));
  };

  return UserSchema;
};
