import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();


export const handler = async (event: APIGatewayEvent) => {
    try {
      const body = JSON.parse(event.body || '{}');
      const { userId, friendId } = body;
  
      if (!userId || !friendId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'UserId och FriendId krävs.' }),
        };
      }
  
      const deleteParams = {
        TableName: 'FriendRequests',
        Key: {
          RequesterId: friendId,
          FriendId: userId,
        },
      };
      await dynamoDb.delete(deleteParams).promise();
  
      const putParams = {
        TableName: 'UserFriends',
        Item: {
          UserId: userId,
          FriendId: friendId,
          CreatedAt: new Date().toISOString(),
        },
      };
      await dynamoDb.put(putParams).promise();
  
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Vänförfrågan accepterad!' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Fel vid accept av vänförfrågan.' }),
      };
    }
  };
  