import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent) => {
  console.log("🔹 Accepterar vänförfrågan:", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || "{}");
    const { userId, friendId } = body;

    if (!userId || !friendId) {
      return { statusCode: 400, body: JSON.stringify({ error: "userId och friendId krävs." }) };
    }

    // 🔹 Ta bort vänförfrågan från FriendRequests
    const deleteParams = {
      TableName: "FriendRequests",
      Key: { RequesterId: friendId, FriendId: userId },
    };
    await dynamoDb.delete(deleteParams).promise();

    // 🔹 Lägg till vänrelation i UserFriends för **båda** användarna
    const batchWriteParams = {
      RequestItems: {
        UserFriends: [
          { PutRequest: { Item: { UserId: userId, FriendId: friendId, CreatedAt: new Date().toISOString() } } },
          { PutRequest: { Item: { UserId: friendId, FriendId: userId, CreatedAt: new Date().toISOString() } } },
        ],
      },
    };

    await dynamoDb.batchWrite(batchWriteParams).promise();

    return { statusCode: 201, body: JSON.stringify({ message: "Vänförfrågan accepterad!" }) };
  } catch (error) {
    console.error("❌ Fel vid acceptans av vänförfrågan:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Något gick fel vid acceptans av vänförfrågan." }) };
  }
};
