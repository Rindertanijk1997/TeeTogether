import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent) => {
  console.log("🔍 Hämtar vänner:", JSON.stringify(event));

  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "UserId krävs för att hämta vänner." }),
      };
    }

    // 🔹 Hämta vänrelationer från UserFriends
    const friendsParams = {
      TableName: "UserFriends",
      FilterExpression: "UserId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const friendsResult = await dynamoDb.scan(friendsParams).promise();
    console.log("📌 Vänrelationer:", JSON.stringify(friendsResult));

    if (!friendsResult.Items || friendsResult.Items.length === 0) {
      return { statusCode: 200, body: JSON.stringify([]) };
    }

    // 🔹 Hämta vänners info från GolfUser
    const friendIds = friendsResult.Items.map((item) => item.FriendId);

    const batchGetParams: DynamoDB.DocumentClient.BatchGetItemInput = {
      RequestItems: {
        GolfUser: {
          Keys: friendIds.map((id) => ({ UserId: id })),
        },
      },
    };

    const userResults = await dynamoDb.batchGet(batchGetParams).promise();
    console.log("📌 Väninfo:", JSON.stringify(userResults));

    const userMap = new Map();
    userResults.Responses?.GolfUser?.forEach((user) => {
      userMap.set(user.UserId, {
        Username: user.Username || "Okänt namn",
        CurrentHCP: user.CurrentHCP ?? "Okänt",
      });
    });

    const friendsWithDetails = friendsResult.Items.map((friend) => ({
      FriendId: friend.FriendId,
      Username: userMap.get(friend.FriendId)?.Username || "Okänt namn",
      CurrentHCP: userMap.get(friend.FriendId)?.CurrentHCP || "Okänt",
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(friendsWithDetails),
    };
  } catch (error) {
    console.error("❌ Fel vid hämtning av vänner:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Något gick fel vid hämtning av vänner." }),
    };
  }
};
