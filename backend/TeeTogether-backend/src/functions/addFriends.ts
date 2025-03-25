import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('Lägger till vän, event:', JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || '{}');
    const { userId, friendId } = body;

    if (!userId || !friendId) {
      console.error('❌ Valideringsfel: userId eller friendId saknas');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'userId och friendId krävs.' }),
      };
    }

    const params = {
      TableName: 'UserFriends',
      Item: {
        UserId: userId,
        FriendId: friendId, // Lagra friendId istället för username
        CreatedAt: new Date().toISOString(),
      },
    };

    console.log('📝 Lägger till vän i DynamoDB med params:', JSON.stringify(params));
    await dynamoDb.put(params).promise();
    console.log('✅ Vän tillagd.');

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Vän tillagd!' }),
    };
  } catch (error) {
    console.error('❌ Fel vid tillägg av vän:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Något gick fel vid tillägg av vän.' }),
    };
  }
};

