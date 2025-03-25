import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent) => {
    try {
      const userId = event.queryStringParameters?.userId;
      if (!userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "UserId krävs för att hämta vänförfrågningar." }),
        };
      }
  
      console.log("🔍 Hämtar vänförfrågningar för användare:", userId);
  
      // 🔹 Hämta vänförfrågningar där användaren är mottagaren
      const requestsParams = {
        TableName: "FriendRequests",
        FilterExpression: "FriendId = :userId AND #status = :pending",
        ExpressionAttributeValues: { ":userId": userId, ":pending": "pending" },
        ExpressionAttributeNames: { "#status": "Status" },
      };
  
      const requestsResult = await dynamoDb.scan(requestsParams).promise();
      const pendingRequests = requestsResult.Items || [];
  
      console.log("📌 Pending friend requests:", JSON.stringify(pendingRequests, null, 2));
  
      // 🔹 Om inga vänförfrågningar finns, returnera tom array
      if (pendingRequests.length === 0) {
        return {
          statusCode: 200,
          body: JSON.stringify([]),
        };
      }
  
      // 🔹 Hämta detaljer om de användare som skickade förfrågningarna
      const requesterIds = pendingRequests.map((req) => req.RequesterId);
  
      console.log("🔍 Hämtar användarinfo för RequesterIds:", JSON.stringify(requesterIds, null, 2));
  
      const batchGetParams: DynamoDB.DocumentClient.BatchGetItemInput = {
        RequestItems: {
          GolfUser: {
            Keys: requesterIds.map((id) => ({ UserId: id })),
          },
        },
      };
  
      const userResults = await dynamoDb.batchGet(batchGetParams).promise();
      const users = userResults.Responses?.GolfUser || [];
  
      console.log("📌 Hämtade användare:", JSON.stringify(users, null, 2));
  
      // 🔹 Koppla ihop användardata med vänförfrågningar
      const enrichedRequests = pendingRequests.map((req) => {
        const user = users.find((u) => u.UserId === req.RequesterId);
        return {
          RequesterId: req.RequesterId,
          FriendId: req.FriendId,
          Username: user?.Username || "Okänd användare",
          CurrentHCP: user?.CurrentHCP ?? "Okänt",
          CreatedAt: req.CreatedAt,
        };
      });
  
      console.log("✅ API-svar med vänförfrågningar:", JSON.stringify(enrichedRequests, null, 2));
  
      return {
        statusCode: 200,
        body: JSON.stringify(enrichedRequests),
      };
    } catch (error) {
      console.error("❌ Fel vid hämtning av vänförfrågningar:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Något gick fel vid hämtning av vänförfrågningar." }),
      };
    }
  };
  
