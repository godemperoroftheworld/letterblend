import "express-async-errors";

import morgan from "morgan";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";

import EnvVars from "@/constants/env";
import { HttpStatusCodes } from "@/constants/http";
import { NodeEnvs } from "@/constants/misc";
import { RouteError } from "@/types/errors";
import routes from "./routes";
import { AxiosError } from "axios";
import cors from "cors";

// **** Variables **** //

const app = express();

app.use(cors())

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan("dev"));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Routes
app.use("/", routes);

// Add error handler
app.use(
  (
    err: Error,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
  ) => {
    logger.err(err, true);
    let status: number = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    let stack: string | undefined = undefined;
    if (err instanceof RouteError) {
      status = err.statusCode;
      stack = err.stack ? JSON.parse(err.stack) : undefined;
    } else if (err instanceof AxiosError) {
      status = err.status as number;
      stack = err.response?.data;
    }
    return res.status(status).json({
      error: err.message,
      stack,
    });
  },
);

// **** Export default **** //

export default app;
