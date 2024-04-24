import express from 'express';
import bodyParser from 'body-parser';

import { authRouter } from './routes/authRouter';
import { userRouter } from './routes/userRouter';
import { poolRouter } from './routes/poolRouter';
import database from './database';

const app = express();

app.use(bodyParser.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/pool', poolRouter);

app.listen(3000, () => {
  console.log('Server listening at 3000');
});

database.on('error', console.error.bind(console, 'MongoDB connection error: '));