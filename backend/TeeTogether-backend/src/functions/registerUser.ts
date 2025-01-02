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

    const { username, password, city, age } = body;

    if (!username || !password || !city || !age) {
      console.error('Valideringsfel: Användarnamn, lösenord, stad eller ålder saknas');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Användarnamn, lösenord, stad och ålder krävs.' }),
      };
    }

    if (typeof age !== 'number' || age <= 0) {
      console.error('Valideringsfel: Ogiltig ålder');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Ålder måste vara ett positivt heltal.' }),
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
        Age: age,
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
