import { Schema, model, Document, Types } from 'mongoose';

interface PoolDocument extends Document {
  name: string;
  owner: Types.ObjectId;
  admins?: Types.ObjectId[];
  users: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const poolSchema = new Schema<PoolDocument>({
  name: { type: String, required: true, unique: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Pool = model<PoolDocument>('Pool', poolSchema);

export default Pool;