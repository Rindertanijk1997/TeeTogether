import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('Lambda startar, event:', JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Parsed body:', body);

    const { username, password } = body;

    if (!username || !password) {
      console.error('Valideringsfel: Användarnamn eller lösenord saknas');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Användarnamn och lösenord krävs.' }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Lösenord krypterat:', hashedPassword);

    const userId = uuidv4();
    console.log('Genererat userId:', userId);

    const params = {
      TableName: 'GolfUser',
      Item: {
        UserId: userId,
        Username: username,
        Password: hashedPassword,
        CreatedAt: new Date().toISOString(),
      },
    };

    console.log('Förbereder att skriva till DynamoDB med params:', JSON.stringify(params));
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
