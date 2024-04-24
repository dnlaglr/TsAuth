import { Schema, model, Document, Types } from 'mongoose';

interface UserDocument extends Document {
  username?: string;
  email: string;
  password: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  userPoolID: Types.ObjectId;
}

const userSchema = new Schema<UserDocument>({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: String, default: ['user'] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  userPoolID: { type: Schema.Types.ObjectId, ref: 'Pool', required: true }
});

const User = model<UserDocument>('User', userSchema);

export default User;