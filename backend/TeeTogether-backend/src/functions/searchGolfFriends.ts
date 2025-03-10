import { APIGatewayEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent) => {
  try {
    const userId = event.queryStringParameters?.userId;
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "UserId krävs för att söka vänner." }),
      };
    }

    // 🔹 Hämta alla vänner
    const friendsParams = {
      TableName: "UserFriends",
      KeyConditionExpression: "UserId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    };
    const friendsResult = await dynamoDb.query(friendsParams).promise();
    const friends = friendsResult.Items || [];

    // 🔹 Hämta pending vänförfrågningar
    const requestsParams = {
      TableName: "FriendRequests",
      FilterExpression: "FriendId = :userId AND #status = :pending",
      ExpressionAttributeValues: { ":userId": userId, ":pending": "pending" },
      ExpressionAttributeNames: { "#status": "Status" },
    };
    const requestsResult = await dynamoDb.scan(requestsParams).promise();
    const pendingRequests = requestsResult.Items || [];

    console.log("📌 API-svar - Friends:", friends);
    console.log("📌 API-svar - Pending Requests:", pendingRequests);

    return {
      statusCode: 200,
      body: JSON.stringify({ friends, pendingRequests }),
    };
  } catch (error) {
    console.error("❌ Fel vid hämtning av vänner:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Något gick fel vid sökning av golfvänner." }),
    };
  }
};
