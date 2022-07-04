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

app.listen(process.env.PORT, ()=> {
    console.log("Server running on port " + process.env.PORT)
});