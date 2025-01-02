import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('Hämtar alla användare, event:', JSON.stringify(event));

  try {
    const params = {
      TableName: 'GolfUser',
    };

    console.log('Skannar DynamoDB-tabellen:', JSON.stringify(params));
    const result = await dynamoDb.scan(params).promise();

    console.log('Hämtade användare:', result.Items);

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error('Fel vid hämtning av användare:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Något gick fel vid hämtning av användare.' }),
    };
  }
};
