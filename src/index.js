import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter.js';

dotenv.config();

const app = express();

// Aqui tb são middlewares
app.use(express.json());
app.use(cors());

app.use(authRouter);

const PORT = process.env.PORT || 5008;
app.listen(PORT);