import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { extractBody } from "../auth/extractBody";
import { pbkdf2Sync } from "crypto";
import { connect } from "../database/connection";
import { sign } from "jsonwebtoken";

const MONGO_URL = process.env.MONGO_URL!;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME!;
const JWT_SECRET = process.env.JWT_SECRET!;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { username, password } = extractBody(event);

  if (!username || !password) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Missing username or password",
      }),
    };
  }

  const hashedPassword = pbkdf2Sync(
    password,
    process.env.SALT!,
    100000,
    64,
    "sha512"
  ).toString("hex");

  const client = await connect(MONGO_URL, MONGO_DB_NAME);
  const collection = client.collection("users");
  const user = await collection.findOne({ username, password: hashedPassword });

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Invalid Credentials",
      }),
    };
  }

  const token = sign(
    {
      username,
      userId: user._id,
    },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      token,
    }),
  };
};
