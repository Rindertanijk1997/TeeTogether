import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('Hämtar användare, event:', JSON.stringify(event));

  try {
    const params = {
      TableName: 'GolfUser',
    };

    console.log('Hämtar alla användare från DynamoDB:', JSON.stringify(params));
    const result = await dynamoDb.scan(params).promise();
    console.log('Resultat från DynamoDB:', JSON.stringify(result));

    const users = result.Items?.map((user) => ({
      UserId: user.UserId,
      Username: user.Username,
      City: user.City,
      Age: user.Age, 
      CurrentHCP: user.CurrentHCP,
      LatestRound: user.LatestRound || null,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error('Fel vid hämtning av användare:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Något gick fel vid hämtning av användare.' }),
    };
  }
};
