import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log('🔍 Hämtar vänner, event:', JSON.stringify(event));

  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'UserId krävs för att hämta vänner.' }),
      };
    }

    // 🔹 Hämta vänrelationer från UserFriends-tabellen
    const friendsParams = {
      TableName: 'UserFriends',
      FilterExpression: 'UserId = :userId OR FriendId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    console.log('📌 Hämtar vänrelationer:', JSON.stringify(friendsParams));
    const friendsResult = await dynamoDb.scan(friendsParams).promise();
    console.log('📌 Resultat från UserFriends:', JSON.stringify(friendsResult));

    if (!friendsResult.Items || friendsResult.Items.length === 0) {
      return { statusCode: 200, body: JSON.stringify([]) };
    }

    // 🔹 Samla alla FriendIds att hämta från GolfUser
    const friendIds = friendsResult.Items.map((item) =>
      item.UserId === userId ? item.FriendId : item.UserId
    );

    console.log('🆔 Vänners UserIds:', JSON.stringify(friendIds));

    if (friendIds.length === 0) {
      return { statusCode: 200, body: JSON.stringify([]) };
    }

    // 🔹 Hämta vänners info från GolfUser-tabellen
    const batchGetParams: DynamoDB.DocumentClient.BatchGetItemInput = {
      RequestItems: {
        GolfUser: {
          Keys: friendIds.map((id) => ({ UserId: id })),
        },
      },
    };

    console.log('🔍 Hämtar vänners info:', JSON.stringify(batchGetParams));
    const userResults = await dynamoDb.batchGet(batchGetParams).promise();
    console.log('📌 Användardata från GolfUser:', JSON.stringify(userResults));

    // 🔹 Skapa en map för snabb lookup av vänners info
    const userMap = new Map();
    userResults.Responses?.GolfUser?.forEach((user) => {
      console.log(`🟢 Hämtad vän: ${JSON.stringify(user)}`);
      userMap.set(user.UserId, {
        Username: user.Username || "Okänt namn",
        CurrentHCP: user.CurrentHCP ?? "Okänt",
      });
    });

    console.log('📌 Vän-data-mapp:', JSON.stringify([...userMap]));

    // 🔹 Koppla väninfo till UserFriends-resultat
    const friendsWithDetails = friendsResult.Items.map((friend) => ({
      UserId: friend.UserId,
      FriendId: friend.FriendId,
      Username: userMap.get(friend.FriendId)?.Username || "Okänt namn",
      CurrentHCP: userMap.get(friend.FriendId)?.CurrentHCP || "Okänt",
    }));

    console.log('✅ API-svar till frontend:', JSON.stringify(friendsWithDetails));

    return {
      statusCode: 200,
      body: JSON.stringify(friendsWithDetails),
    };
  } catch (error) {
    console.error('❌ Fel vid hämtning av vänner:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Något gick fel vid hämtning av vänner.' }),
    };
  }
};
