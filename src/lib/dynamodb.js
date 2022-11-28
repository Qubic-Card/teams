import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const REGION = 'ap-southeast-1';

const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID.toString();
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY.toString();

const ddbClient = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const ddbDocClient = DynamoDBDocument.from(ddbClient);

export default ddbDocClient;
