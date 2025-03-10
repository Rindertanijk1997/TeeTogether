import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent) => {
  console.log("🔹 Mottagen vänförfrågan:", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || "{}");
    const { userId, friendId } = body;

    if (!userId || !friendId) {
      console.error("❌ userId eller friendId saknas");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "userId och friendId krävs." }),
      };
    }

    // 🔹 Kolla om förfrågan redan existerar
    const checkParams = {
      TableName: "FriendRequests",
      KeyConditionExpression: "RequesterId = :userId AND FriendId = :friendId",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":friendId": friendId,
      },
    };

    const existingRequest = await dynamoDb.query(checkParams).promise();

    if (existingRequest.Items && existingRequest.Items.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Vänförfrågan har redan skickats." }),
      };
    }

    // 🔹 Lägg till en ny vänförfrågan
    const params = {
      TableName: "FriendRequests",
      Item: {
        RequesterId: userId,
        FriendId: friendId,
        Status: "pending",
        CreatedAt: new Date().toISOString(),
      },
    };

    console.log("📌 Sparar vänförfrågan:", JSON.stringify(params));
    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Vänförfrågan skickad!" }),
    };
  } catch (error) {
    console.error("❌ Fel vid vänförfrågan:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Något gick fel vid vänförfrågan." }),
    };
  }
};
