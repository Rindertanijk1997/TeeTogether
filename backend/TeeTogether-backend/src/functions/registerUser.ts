import { APIGatewayEvent, Context } from 'aws-lambda'; 
import { DynamoDB } from 'aws-sdk';
import bcrypt from 'bcryptjs';

const dynamoDb = new DynamoDB.DocumentClient();

const generateFourLetterId = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return Array.from({ length: 4 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
};

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('Lambda startar, event:', JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Parsed body:', body);

    const { username, password, city } = body;

    if (!username || !password || !city) {
      console.error('Valideringsfel: Användarnamn, lösenord eller stad saknas');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Användarnamn, lösenord och stad krävs.' }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Lösenord krypterat:', hashedPassword);

    const userId = generateFourLetterId();
    console.log('Genererat userId:', userId);

    const params = {
      TableName: 'GolfUser',
      Item: {
        UserId: userId,
        Username: username,
        Password: hashedPassword,
        City: city,
        CreatedAt: new Date().toISOString(),
      },
    };

    console.log('Skriver följande objekt till DynamoDB:', JSON.stringify(params.Item));
    await dynamoDb.put(params).promise();
    console.log('Skrivning till DynamoDB lyckades.');

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Användare skapad!', userId }),
    };
  } catch (error) {
    console.error('Fel vid registrering:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Något gick fel vid registrering.' }),
    };
  }
};
