// src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/connectDataBase.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000');

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_BASE_URL
}));

connectDB();

app.use(morgan(process.env.ENV));

app.get('/health', (req: Request, res: Response) => {
    res.sendStatus(200);
});

app.use('/api', routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (!err.statusCode) {
        console.error(err);
    }
    // if statusCode is there it means that message will also be created by me
    // if statusCode is not there it means that message is not created by me its something else in this situation we want to send internal server error.
    res.status(err.statusCode ? err.statusCode : 500).json({ error: err.statusCode ? err.message : 'Internal Server Error.Please try again later.' });
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    server.close(() => {
        process.exit(1);
    });
});