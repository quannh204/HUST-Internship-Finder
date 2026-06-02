import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import healthRouter from './routes/health';
import jobsRouter from './routes/jobs';
import skillsRouter from './routes/skills';  

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/health', healthRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/skills', skillsRouter);  
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(
  (error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    void _next;
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  },
);

export default app;
