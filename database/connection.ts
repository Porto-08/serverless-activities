import { MongoClient, Db } from "mongodb";

export const connect = async (
  mongoUrl: string,
  database: string
): Promise<Db> => {
  console.log(mongoUrl, database);

  const client = new MongoClient(mongoUrl);

  const connetion = await client.connect();

  return connetion.db(database);
};
