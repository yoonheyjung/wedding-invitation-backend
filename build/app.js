import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import xss from "xss-clean";

/**
 * Custom error handling
 */
import errorHandler from "./middlewares/errorHandler.middleware";
import { NotFoundError } from "./helpers/errors.helper";

// Import database configuration
import db from "./models";

/**
 * Routes import
 * @type {Router | {readonly default?: Router}}
 */
import v1Routes from "./routes/v1/index.route";

/**
 * Global env variables definition
 */
if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

/**
 * DB & Redis
 */
db.sequelize.sync();

/**
 * Define Express
 * @type {*|Express}
 */
const app = express();
app.set("trust proxy", true);

/**
 * Middleware definition
 */
app.use(morgan(`:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]  :response-time ms ":referrer" ":user-agent"`, {
  skip(req) {
    if (req.method === "OPTIONS") {
      return true;
    }
    if (req.originalUrl === "/healthcheck") {
      return true;
    }
    return false;
  }
}));

/**
 * Set security HTTP Headers
 */
app.use(helmet({
  contentSecurityPolicy: false
}));

/**
 * Parse json request body
 */
app.use(express.json());

/**
 * Parse urlencoded request body
 */
app.use(express.urlencoded({
  extended: true
}));

/**
 * Sanitize data
 */
app.use(xss());

/**
 
 */

/**
 * Parsing cookie
 */
app.use(cookieParser());

/**
 * CORS policy configuration
 */
app.use(cors({
  origin: true,
  credentials: true
}));

/**
 * Application Load Balncer healthcheck
 */
app.get("/healthcheck", function (req, res) {
  return res.status(200).send("ok");
});

/**
 * passport를 초기화하고 세션을 express의 세션 저장소로 전달
 */
app.use(passport.initialize());

/**
 * Routes definitions
 */
app.use("/partner/v1/", v1Routes);

/**
 * 예상하지 못하게 들어온 api endpoint 처리
 */
// eslint-disable-next-line no-unused-vars
app.all("*", (_, res) => {
  throw new NotFoundError("Resource not found on this server!!");
});
app.use(errorHandler);
export default app;