import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('Lägger till vän, event:', JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || '{}');
    const { userId, username } = body;

    if (!userId || !username) {
      console.error('Valideringsfel: userId eller username saknas');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'userId och username krävs.' }),
      };
    }

    const params = {
      TableName: 'UserFriends',
      Item: {
        UserId: userId,
        Username: username,
        CreatedAt: new Date().toISOString(),
      },
    };

    console.log('Lägger till vän i DynamoDB med params:', JSON.stringify(params));
    await dynamoDb.put(params).promise();
    console.log('Vän tillagd.');

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Vän tillagd!' }),
    };
  } catch (error) {
    console.error('Fel vid tillägg av vän:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Något gick fel vid tillägg av vän.' }),
    };
  }
};
