import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { verify } from "jsonwebtoken";

interface Payload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const authorize = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { authorization } = event.headers;

  if (!authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Missing Authorization Header",
      }),
    };
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Invalid Authorization Header",
      }),
    };
  }

  try {
    const payload = verify(token, JWT_SECRET);

    const data = JSON.parse(JSON.stringify(payload));

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: data as Payload,
      }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Invalid Token",
      }),
    };
  }
};
