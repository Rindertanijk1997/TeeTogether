import { APIGatewayEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { userId, friendId } = body;

    if (!userId || !friendId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'UserId och FriendId krävs.' }),
      };
    }

    const params = {
      TableName: 'FriendRequests',
      Item: {
        RequesterId: userId,
        FriendId: friendId,
        Status: 'pending',
        CreatedAt: new Date().toISOString(),
      },
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Vänförfrågan skickad!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fel vid vänförfrågan.' }),
    };
  }
};
