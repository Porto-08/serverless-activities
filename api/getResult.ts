import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { connect } from "../database/connection";
import { ObjectId } from "mongodb";
import { authorize } from "../auth/authorize";

const MONGO_URL = process.env.MONGO_URL!;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME!;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authResult = await authorize(event);

  if (authResult.statusCode !== 200) {
    return authResult;
  }

  const { id } = event.pathParameters!;

  const client = await connect(MONGO_URL, MONGO_DB_NAME);
  const collection = client.collection("results");

  const result = await collection.findOne({
    _id: new ObjectId(id),
  });

  if (!result) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Result not Found",
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      result,
    }),
  };
};
