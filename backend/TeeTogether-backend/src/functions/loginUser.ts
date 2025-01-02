import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const dynamoDb = new DynamoDB.DocumentClient();
const JWT_SECRET = process.env.JWT_SECRET || 'din-hemliga-nyckel'; // Laddas från .env

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('Inloggningsförsök, event:', JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Parsed body:', body);

    const { username, password } = body;

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Användarnamn och lösenord krävs.' }),
      };
    }

    const params = {
      TableName: 'GolfUser',
      IndexName: 'Username-index',
      KeyConditionExpression: 'Username = :username',
      ExpressionAttributeValues: {
        ':username': username,
      },
    };

    console.log('Hämtar användare från DynamoDB:', JSON.stringify(params));
    const result = await dynamoDb.query(params).promise();

    if (result.Items && result.Items.length > 0) {
      const user = result.Items[0];
      const passwordMatch = await bcrypt.compare(password, user.Password);

      if (!passwordMatch) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Felaktigt lösenord.' }),
        };
      }

      const token = jwt.sign({ userId: user.UserId }, JWT_SECRET, { expiresIn: '1h' });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Inloggning lyckades!', token }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Användaren hittades inte.' }),
      };
    }
  } catch (error) {
    console.error('Fel vid inloggning:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Något gick fel vid inloggning.' }),
    };
  }
};
