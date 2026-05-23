import express from 'express';
import centralRouter from './app/routes';
import globalErrorHandler from './middleware/globalError';
const app = express()

//? Middleware
app.use(express.json())
app.use(express.text());

app.use('/api', centralRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to DevPulse - Issue Tracker API Server!",
    });
});

//? Global Error Handler
app.use(globalErrorHandler);

export default app