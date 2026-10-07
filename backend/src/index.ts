import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import itemRouter from './routes/items';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use('/api/auth', authRouter);
app.use('/api/items', itemRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
