import logger from 'jet-logger';
import EnvVars from '@/constants/env';
import server from './server';
import {connectToDatabase} from "@/mongo";

// Database
connectToDatabase()
    .then(() => {
        logger.info('Connected to database.');
    })
    .catch((e) => logger.err(new Error('Failed to connect to database.')));

// Start server
const SERVER_START_MSG = 'Express server started on port: ' + EnvVars.Port.toString();
server.listen(EnvVars.Port, () => {
  logger.info(SERVER_START_MSG);
  logger.info("Scraper URL: " + EnvVars.ScrapeServiceURL);
});
