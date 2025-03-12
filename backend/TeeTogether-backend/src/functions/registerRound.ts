import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent) => {
  console.log("🔹 Registrerar rond, event:", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || "{}");
    console.log("📌 Parsed body:", body);

    const { userId, course, score } = body;
    
    if (!userId || !course || score === undefined) {
      console.error("❌ Valideringsfel: UserId, course och score krävs");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "UserId, course och score krävs." }),
      };
    }

    // 🔹 Beräkna nytt HCP automatiskt
    const newHCP = Math.max(0, score > 36 ? score * 0.95 : score * 1.05); // Exempelberäkning
    console.log("📌 Beräknat nytt HCP:", newHCP);

    // 🔹 Hämta användarens befintliga rundor
    const getUserParams = {
      TableName: "GolfUser",
      Key: { UserId: userId },
    };
    console.log("📌 Hämtar användardata med params:", JSON.stringify(getUserParams));
    const userData = await dynamoDb.get(getUserParams).promise();

    if (!userData.Item) {
      console.error("❌ Användaren hittades inte!");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Användaren hittades inte!" }),
      };
    }

    // 🔹 Uppdatera senaste rundor
    const latestRounds = userData.Item.LatestRounds || [];
    latestRounds.unshift({
      Course: course,
      Score: score,
      NewHCP: newHCP,
      Date: new Date().toISOString(),
    });

    if (latestRounds.length > 5) latestRounds.pop(); // Endast 5 senaste rundorna sparas

    const updateParams = {
      TableName: "GolfUser",
      Key: { UserId: userId },
      UpdateExpression: "SET LatestRounds = :latestRounds, CurrentHCP = :newHCP",
      ExpressionAttributeValues: {
        ":latestRounds": latestRounds,
        ":newHCP": newHCP,
      },
      ReturnValues: "UPDATED_NEW",
    };

    console.log("📌 Uppdaterar användardata i DynamoDB:", JSON.stringify(updateParams));
    await dynamoDb.update(updateParams).promise();

    console.log("✅ Rond registrerad!");
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Rond registrerad!",
        newHCP,
        latestRounds,
      }),
    };
  } catch (error) {
    console.error("❌ Fel vid registrering av rond:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Något gick fel vid registrering av rond." }),
    };
  }
};

