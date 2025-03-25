import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent) => {
  console.log("🔹 Hämtar senaste ronder, event:", JSON.stringify(event));

  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      console.error("❌ Ingen userId angiven!");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "UserId krävs!" }),
      };
    }

    const params = {
      TableName: "GolfUser",
      Key: { UserId: userId },
    };

    console.log("📌 Hämtar användardata från DynamoDB:", JSON.stringify(params));
    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      console.error("❌ Användaren hittades inte!");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Användaren hittades inte!" }),
      };
    }

    console.log("✅ Ronder hämtade!");
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item.LatestRounds || []),
    };
  } catch (error) {
    console.error("❌ Fel vid hämtning av ronder:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Något gick fel vid hämtning av ronder." }),
    };
  }
};
