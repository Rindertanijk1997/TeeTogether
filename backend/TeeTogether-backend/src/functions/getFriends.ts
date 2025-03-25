import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent) => {
  console.log("🔍 Hämtar vänner:", JSON.stringify(event));

  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return { statusCode: 400, body: JSON.stringify({ error: "UserId krävs." }) };
    }

    const friendsParams = {
      TableName: "UserFriends",
      FilterExpression: "UserId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    };

    const friendsResult = await dynamoDb.scan(friendsParams).promise();
    const friendIds = friendsResult.Items?.map((item) => item.FriendId) || [];

    if (friendIds.length === 0) {
      return { statusCode: 200, body: JSON.stringify([]) };
    }

    const batchGetParams: DynamoDB.DocumentClient.BatchGetItemInput = {
      RequestItems: {
        GolfUser: {
          Keys: friendIds.map((id) => ({ UserId: id })),
        },
      },
    };

    const userResults = await dynamoDb.batchGet(batchGetParams).promise();
    const friendsWithDetails = userResults.Responses?.GolfUser || [];

    return { statusCode: 200, body: JSON.stringify(friendsWithDetails) };
  } catch (error) {
    console.error("❌ Fel vid hämtning av vänner:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Något gick fel." }) };
  }
};
