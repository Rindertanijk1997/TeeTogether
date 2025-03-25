import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent) => {
  console.log("🔹 Mottagen vänförfrågan:", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || "{}");
    const { userId, friendId } = body;

    if (!userId || !friendId) {
      return { statusCode: 400, body: JSON.stringify({ error: "userId och friendId krävs." }) };
    }

    // 🔹 Kolla om de redan är vänner
    const checkFriendshipParams = {
      TableName: "UserFriends",
      FilterExpression: "(UserId = :userId AND FriendId = :friendId) OR (UserId = :friendId AND FriendId = :userId)",
      ExpressionAttributeValues: { ":userId": userId, ":friendId": friendId },
    };

    const friendshipResult = await dynamoDb.scan(checkFriendshipParams).promise();
    if (friendshipResult.Items?.length) {
      return { statusCode: 400, body: JSON.stringify({ error: "Ni är redan vänner." }) };
    }

    // 🔹 Kolla om det redan finns en vänförfrågan
    const checkRequestParams = {
      TableName: "FriendRequests",
      FilterExpression: "(RequesterId = :userId AND FriendId = :friendId) OR (RequesterId = :friendId AND FriendId = :userId)",
      ExpressionAttributeValues: { ":userId": userId, ":friendId": friendId },
    };

    const existingRequest = await dynamoDb.scan(checkRequestParams).promise();
    if (existingRequest.Items?.length) {
      return { statusCode: 400, body: JSON.stringify({ error: "Vänförfrågan finns redan." }) };
    }

    // 🔹 Skapa vänförfrågan
    const params = {
      TableName: "FriendRequests",
      Item: {
        RequesterId: userId,
        FriendId: friendId,
        Status: "pending",
        CreatedAt: new Date().toISOString(),
      },
    };

    await dynamoDb.put(params).promise();
    return { statusCode: 201, body: JSON.stringify({ message: "Vänförfrågan skickad!" }) };
  } catch (error) {
    console.error("❌ Fel vid vänförfrågan:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Något gick fel." }) };
  }
};
