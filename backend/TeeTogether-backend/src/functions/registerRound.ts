import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('Registrerar senaste rond, event:', JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Parsed body:', body);

    const { userId, course, score, newHCP } = body;

    // Validering av indata
    if (!userId || !course || !score || newHCP === undefined) {
      console.error('Valideringsfel: Alla fält krävs');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'UserId, course, score och newHCP krävs.' }),
      };
    }

    // Uppdatera användaren med den senaste ronden
    const params = {
      TableName: 'GolfUser',
      Key: { UserId: userId },
      UpdateExpression: 'SET LatestRound = :latestRound, CurrentHCP = :newHCP',
      ExpressionAttributeValues: {
        ':latestRound': {
          Course: course,
          Score: score,
          NewHCP: newHCP,
          Date: new Date().toISOString(),
        },
        ':newHCP': newHCP,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    console.log('Uppdaterar användare i DynamoDB:', JSON.stringify(params));
    const result = await dynamoDb.update(params).promise();
    console.log('Uppdatering lyckades:', JSON.stringify(result));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Senaste ronden registrerad!' }),
    };
  } catch (error) {
    console.error('Fel vid registrering av rond:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Något gick fel vid registrering av rond.' }),
    };
  }
};
