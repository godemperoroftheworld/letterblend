import express from 'express';
import { createServer } from 'node:http';
import routes from '@/routes/rest';

const app = express();
app.use('/queries', express.json());
app.use('/queries', routes);

const server = createServer(app);

export default server;
export { app };
