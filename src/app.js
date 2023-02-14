import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import xss from 'xss-clean';

/**
 * Custom error handling
 */
import errorHandler from './middlewares/errorHandler.middleware';
import { NotFoundError } from './helpers/errors.helper';

// Import database configuration
// import db from "./models";

/**
 * Routes import
 * @type {Router | {readonly default?: Router}}
 */
import v1Routes from './routes/v1/index.route';

/**
 * Global env variables definition
 */
if (process.env.NODE_ENV === 'development') {
  dotenv.config();
} else if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
}

/**
 * DB & Redis
 */
// db.sequelize.sync();

// import { createClient } from 'redis';
// const client = createClient(6379, process.env.REDIS_HOST, {
//   no_ready_check: true,
// });
// client.on('error', (err) => {
//   console.error(err);
// });

// client.on('ready', () => {
//   console.log('redis is ready');
// });
// client.connect();

/**
 * Define Express
 * @type {*|Express}
 */
const app = express();

app.set('trust proxy', true);

/**
 * Middleware definition
 */
app.use(morgan('combined'));

/**
 * Set security HTTP Headers
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

/**
 * Parse json request body
 */
app.use(express.json());

/**
 * Parse urlencoded request body
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Sanitize data
 */
app.use(xss());

/**
 * CORS policy configuration
 */
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }),
);

/**
 * Application Load Balncer healthcheck
 */
app.get('/healthcheck', function (req, res) {
  return res.status(200).send('ok');
});

/**
 * Routes definitions
 */
app.use('/v1', v1Routes);

/**
 * 예상하지 못하게 들어온 api endpoint 처리
 */
// eslint-disable-next-line no-unused-vars
app.all('*', (_, res) => {
  throw new NotFoundError('Resource not found on this server!!');
});

app.use(errorHandler);

export default app;
