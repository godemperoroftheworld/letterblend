import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb';
import env from '@/constants/env';

const client = new MongoClient(env.MongoPath, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});
let database: Db

export async function connectToDatabase() {
  await client.connect();
  database = client.db('db');
  await database.command({ ping: 1 });
}

export default client;
export {
  database,
}