import dynamoDB from '../config/awsConfig';

export const addUser = async (userId: string, name: string, email: string) => {
  const params = {
    TableName: 'GolfUser',
    Item: {
      UserId: userId,
      Name: name,
      Email: email,
      CreatedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return { message: 'User added successfully!' };
  } catch (error) {
    console.error('Error adding user:', error);
    throw new Error('Failed to add user.');
  }
};

export const getUser = async (userId: string) => {
    const params = {
      TableName: 'GolfUser',
      Key: {
        UserId: userId,
      },
    };
  
    try {
      const result = await dynamoDB.get(params).promise();
      return result.Item;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user.');
    }
  };
  