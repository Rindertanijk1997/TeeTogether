import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent) => {
  console.log("🔹 Accepterar vänförfrågan:", JSON.stringify(event));

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

    // 🔹 Ta bort vänförfrågan från FriendRequests
    const deleteParams = {
      TableName: "FriendRequests",
      Key: {
        RequesterId: friendId,
        FriendId: userId,
      },
    };

    console.log("🗑 Tar bort vänförfrågan:", JSON.stringify(deleteParams));
    await dynamoDb.delete(deleteParams).promise();

    // 🔹 Lägg till vänrelation i UserFriends för båda användarna
    const putParams1 = {
      TableName: "UserFriends",
      Item: {
        UserId: userId,
        FriendId: friendId,
        CreatedAt: new Date().toISOString(),
      },
    };

    const putParams2 = {
      TableName: "UserFriends",
      Item: {
        UserId: friendId,
        FriendId: userId,
        CreatedAt: new Date().toISOString(),
      },
    };

    console.log("📌 Lägger till vänrelation:", JSON.stringify(putParams1));
    await dynamoDb.put(putParams1).promise();
    await dynamoDb.put(putParams2).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Vänförfrågan accepterad!" }),
    };
  } catch (error) {
    console.error("❌ Fel vid acceptans av vänförfrågan:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Något gick fel vid acceptans av vänförfrågan." }),
    };
  }
};
