import * as aws from 'aws-sdk';
import {ConfigurationOptions} from 'aws-sdk/lib/config';
const awsConfig: ConfigurationOptions = {
  region: 'us-east-2',
  accessKeyId: process.env.GRS_ACCESS_KEY,
  secretAccessKey: process.env.GRS_SECRET_ACCESS_KEY
}

aws.config.update(awsConfig);

const docClient = new aws.DynamoDB.DocumentClient();

function getAllCategories(): Promise<any> {
  return docClient.scan({
    TableName: 'category',
  }).promise();
}
