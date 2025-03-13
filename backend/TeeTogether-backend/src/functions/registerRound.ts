import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

const calculateNewHCP = (currentHCP: number, score: number): number => {
  const targetScore = 36;
  const hcpAdjustmentFactor = 0.8;

  let newHCP = currentHCP;

  if (score > targetScore) {
    const diff = score - targetScore;
    newHCP -= diff * hcpAdjustmentFactor * 0.1;
  } else if (score < targetScore) {
    const diff = targetScore - score;
    newHCP += diff * hcpAdjustmentFactor * 0.1;
  }

  return parseFloat(newHCP.toFixed(2));
};

export const handler = async (event: APIGatewayEvent) => {
  console.log("🔹 Registrerar rond, event:", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || "{}");
    console.log("📌 Parsed body:", body);

    const { userId, course, score } = body;

    if (!userId || !course || score === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "UserId, course och score krävs." }),
      };
    }

    // Hämta nuvarande HCP från databasen
    const userParams = {
      TableName: "GolfUser",
      Key: { UserId: userId },
    };
    const userData = await dynamoDb.get(userParams).promise();

    if (!userData.Item || userData.Item.CurrentHCP === undefined) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Användaren hittades inte eller saknar HCP!" }),
      };
    }

    const currentHCP = userData.Item.CurrentHCP;
    const newHCP = calculateNewHCP(currentHCP, score);

    const latestRounds = userData.Item.LatestRounds || [];
    latestRounds.unshift({
      Course: course,
      Score: score,
      NewHCP: newHCP,
      Date: new Date().toISOString(),
    });

    if (latestRounds.length > 5) latestRounds.pop();

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

    await dynamoDb.update(updateParams).promise();

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

