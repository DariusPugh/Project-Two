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

function getReviewsByID(reviewID): Promise<any>{
  return docClient.query({
    TableName: 'reviews',
    KeyConditionExpression: '#ri = :reviewID',
    ExpressionAttributeNames: { // for aliasing field names
      '#ri': 'reviewID'
    },
    ExpressionAttributeValues: { // for aliasing actual values
      ':reviewID': reviewID
    },
    // ReturnConsumedCapacity: 'TOTAL' // not needed but if you want to see this info it is there

  }).promise();
}

function getReviewsByUsername(username){
  return docClient.query({
    TableName: 'reviews',
    IndexName: 'username-index',
    KeyConditionExpression: '#un = :username',
    ExpressionAttributeNames: { // for aliasing field names
      '#un': 'username'
    },
    ExpressionAttributeValues: { // for aliasing actual values
      ':username': username
    },
    // ReturnConsumedCapacity: 'TOTAL' // not needed but if you want to see this info it is there

  }).promise();
}