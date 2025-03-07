import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('Event mottaget:', JSON.stringify(event));

  try {
    const httpMethod = event.httpMethod;

    if (httpMethod === 'POST') {
      // Hantera att lägga till vän
      const body = JSON.parse(event.body || '{}');
      const { userId, friendName } = body;

      if (!userId || !friendName) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'UserId och FriendName krävs.' }),
        };
      }

      const params = {
        TableName: 'UserFriends',
        Item: {
          UserId: userId,
          Name: friendName,
          AddedAt: new Date().toISOString(),
        },
      };

      await dynamoDb.put(params).promise();

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Vän tillagd!' }),
      };
    } else if (httpMethod === 'GET') {
      // Hantera att hämta vänner
      const userId = event.queryStringParameters?.userId;

      if (!userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'UserId krävs för att hämta vänner.' }),
        };
      }

      const params = {
        TableName: 'UserFriends',
        KeyConditionExpression: 'UserId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      };

      const result = await dynamoDb.query(params).promise();

      return {
        statusCode: 200,
        body: JSON.stringify(result.Items),
      };
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Metod inte tillåten.' }),
      };
    }
  } catch (error) {
    console.error('Fel i friendHandler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Ett fel inträffade.' }),
    };
  }
};
