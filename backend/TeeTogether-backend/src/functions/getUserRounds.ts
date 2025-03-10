import { APIGatewayEvent, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log("Hämtar ronder, event:", JSON.stringify(event));

  try {
    const userId = event.queryStringParameters?.userId; // 🔹 Hämta userId från query-parametern

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "UserId krävs!" }),
      };
    }

    const params = {
      TableName: "GolfUser", // 🔹 Se till att tabellnamnet är korrekt!
      KeyConditionExpression: "UserId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    console.log("Hämtar ronder från DynamoDB med params:", JSON.stringify(params));
    const result = await dynamoDb.query(params).promise();
    
    if (!result.Items) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Inga ronder hittades!" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error("Fel vid hämtning av ronder:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Något gick fel vid hämtning av ronder." }),
    };
  }
};
