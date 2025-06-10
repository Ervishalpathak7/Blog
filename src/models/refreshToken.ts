import { Schema, model, Types } from 'mongoose';

interface IRefreshToken {
  token: string;
  userId: Types.ObjectId;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IRefreshToken>('RefreshToken', refreshTokenSchema);