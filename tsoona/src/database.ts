import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

mongoose.connect(MONGODB_URI, {
  dbName: 'AuthService'
})
.then(() => console.log('Connected to MongoDB!'))
.catch((err) => console.error('Error connecting to MongoDB: ', err));

export default mongoose.connection;