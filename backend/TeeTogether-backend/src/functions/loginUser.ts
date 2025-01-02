import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Ladda miljövariabler från .env
dotenv.config();

// Hämta JWT-secret från .env
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'; // Byt ut 'fallback-secret' om ingen .env används

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('Inloggningsförsök, event:', JSON.stringify(event));

  try {
    // Läs in data från body
    const body = JSON.parse(event.body || '{}');
    console.log('Parsed body:', body);

    const { username, password } = body;

    // Validera att användarnamn och lösenord finns
    if (!username || !password) {
      console.error('Valideringsfel: Användarnamn eller lösenord saknas');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Användarnamn och lösenord krävs.' }),
      };
    }

    const params = {
        TableName: 'GolfUser',
        IndexName: 'Username-index', // Uppdatera till korrekt indexnamn
        KeyConditionExpression: 'Username = :username',
        ExpressionAttributeValues: {
          ':username': username,
        },
      };
      
      console.log('Hämtar användare från DynamoDB med params:', JSON.stringify(params));
      const result = await dynamoDb.query(params).promise();
      console.log('DynamoDB-resultat:', JSON.stringify(result));
      
      // Kontrollera om användaren hittades
      if (!result.Items || result.Items.length === 0) {
        console.error('Användaren hittades inte');
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Ogiltigt användarnamn eller lösenord.' }),
        };
      }      

    const user = result.Items[0];

    // Validera lösenordet
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      console.error('Ogiltigt lösenord');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Ogiltigt användarnamn eller lösenord.' }),
      };
    }

    // Skapa en JWT-token
    const token = jwt.sign({ userId: user.UserId, username: user.Username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Inloggning lyckades för användare:', username);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Inloggning lyckades!', token }),
    };
  } catch (error) {
    console.error('Fel vid inloggning:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Något gick fel vid inloggning.' }),
    };
  }
};
