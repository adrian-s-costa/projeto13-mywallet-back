import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter.js';
import transRouter from './routes/transRouter.js'

dotenv.config();

const app = express();

// Aqui tb são middlewares
app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(transRouter)

const PORT = process.env.PORT || 5010;
app.listen(PORT);