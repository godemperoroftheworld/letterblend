/* eslint-disable n/no-process-env */

import * as dotenv from 'dotenv';
import { parse } from 'ts-command-line-args';
import path from 'path';
import * as process from 'process';

interface IArgs {
  env: string;
}

// **** Setup **** //

// Command line arguments
const args = parse<IArgs>({
  env: {
    type: String,
    defaultValue: 'development',
    alias: 'e',
  },
});

const dotEnvPath =
  args.env === 'development' ? path.join(__dirname, '../../development.env') : undefined;
dotenv.config({
  path: dotEnvPath,
});

const variables = {
  NodeEnv: process.env.NODE_ENV ?? '',
  Port: Number(process.env.PORT ?? 0),
  MongoPath: process.env.MONGO_PATH ?? '',
} as const;

export default variables;
