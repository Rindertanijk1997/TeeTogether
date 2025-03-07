import { APIGatewayEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

// Skapa en TypeScript-interface för en användare
interface GolfUser {
  UserId: string;
  Username: string;
  City: string;
  Age: number;
  CurrentHCP: number;
}

export const handler = async (event: APIGatewayEvent) => {
  try {
    // Hämta sökparametrar
    const { city, minAge, maxAge, minHCP, maxHCP } = event.queryStringParameters || {};

    // Definiera DynamoDB Scan
    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: 'GolfUser',
    };

    // Hämta användare från DynamoDB
    const result = await dynamoDb.scan(params).promise();

    // Konvertera resultatet till en array av GolfUser
    const users: GolfUser[] = (result.Items as GolfUser[]) || [];

    // Filtrera användarna baserat på sökvillkor
    const filteredUsers = users.filter(user => {
      return (!city || user.City === city) &&
             (!minAge || user.Age >= Number(minAge)) &&
             (!maxAge || user.Age <= Number(maxAge)) &&
             (!minHCP || user.CurrentHCP >= Number(minHCP)) &&
             (!maxHCP || user.CurrentHCP <= Number(maxHCP));
    });

    return {
      statusCode: 200,
      body: JSON.stringify(filteredUsers),
    };
  } catch (error) {
    console.error('Fel vid sökning av golfvänner:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Något gick fel vid sökning av golfvänner.' }),
    };
  }
};
