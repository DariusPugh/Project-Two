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

function addCategory(category:any): Promise<any> {
  return docClient.put({
    TableName: 'category',
    Item: category,
  }).promise();
}

function deleteCategory(category:String): Promise<any> {
  return docClient.delete({
    TableName: 'category',
    Key: {
      "category": category,
    },
    ConditionExpression: "info.count = :value",
    ExpressionAttributeValues: {
        ":value": 0
    }
  }).promise();
}