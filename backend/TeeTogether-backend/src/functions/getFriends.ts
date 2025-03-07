import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('Hämtar alla vänner, event:', JSON.stringify(event));

  try {
    const params = {
      TableName: 'UserFriends',
    };

    console.log('Hämtar alla poster från DynamoDB:', JSON.stringify(params));
    const result = await dynamoDb.scan(params).promise();
    console.log('Resultat från DynamoDB:', JSON.stringify(result));

    const friends = result.Items?.map((item) => ({
      UserId: item.UserId,
      Name: item.Name,
      AddedAt: item.CreatedAt,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(friends),
    };
  } catch (error) {
    console.error('Fel vid hämtning av vänner:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Något gick fel vid hämtning av vänner.' }),
    };
  }
};
