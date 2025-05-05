import Express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';

const app: Application = Express();

//parser
app.use(Express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://medi-sphere-client.vercel.app',
      'https://medi-sphere-five.vercel.app',
      'http://localhost:3001',
    ],
    credentials: true,
  }),
);

// App Api Routes
app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.send('Medi-Sphere App Is Running');
});

app.use(globalErrorHandler);

export default app;
