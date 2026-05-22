import express, { type Request, type Response } from 'express';
import centralRouter from './app/routes';
import globalErrorHandler from './middleware/globalError';
const app = express()

//? Middleware
app.use(express.json())
app.use(express.text());


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!')
})

app.use('/api', centralRouter);

//? Global Error Handler
app.use(globalErrorHandler);

export default app