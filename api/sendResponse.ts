import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { authorize } from "../auth/authorize";
import { extractBody } from "../auth/extractBody";
import { connect } from "../database/connection";

const MONGO_URL = process.env.MONGO_URL!;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME!;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authResult = await authorize(event);

  if (authResult.statusCode !== 200) {
    return authResult;
  }

  const { answers } = extractBody(event);
  const { data } = JSON.parse(authResult.body!);

  if (!answers) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Bad Request, please provide the answers",
      }),
    };
  }

  const correctAnswers = [3, 1, 0, 2];

  const totalCorrectAnswers = answers.reduce((acc, answer, index) => {
    if (answer === correctAnswers[index]) {
      return acc++;
    }

    return acc;
  }, 0);

  const result = {
    username: data.username,
    answers,
    totalCorrectAnswers,
    totalAnswers: answers.length,
  };

  const client = await connect(MONGO_URL, MONGO_DB_NAME);
  const collection = client.collection("results");

  const { insertedId } = await collection.insertOne(result);

  return {
    statusCode: 201,
    body: JSON.stringify({
      id: insertedId,
      ...result,
      query: {
        id: insertedId,
      },
    }),
  };
};
