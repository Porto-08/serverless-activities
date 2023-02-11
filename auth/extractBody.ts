import { APIGatewayProxyEvent } from "aws-lambda";

interface ExtractBodyOutput {
  [key: string]: any;
}

export const extractBody = (event: APIGatewayProxyEvent): ExtractBodyOutput => {
  if (!event.body) {
    throw new Error("No body provided");
  }

  return JSON.parse(event.body);
};
