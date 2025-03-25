import AWS from 'aws-sdk';

AWS.config.update({
  region: 'din-region', // Exempel: 'eu-north-1'
  accessKeyId: 'din-access-key-id', // Hämta från AWS IAM
  secretAccessKey: 'din-secret-access-key', // Hämta från AWS IAM
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export default dynamoDB;
