import * as aws from 'aws-sdk';
import {ConfigurationOptions} from 'aws-sdk/lib/config';
import { String } from 'aws-sdk/clients/codebuild';
const awsConfig: ConfigurationOptions = {
  region: 'us-east-2',
  accessKeyId: process.env.GRS_ACCESS_KEY,
  secretAccessKey: process.env.GRS_SECRET_ACCESS_KEY
}

aws.config.update(awsConfig);

const docClient = new aws.DynamoDB.DocumentClient();

/*******************************************************************
 * Getting users by username / logging in
 *******************************************************************/
export function getUser(username: string): Promise<any> {
    return docClient.query({
        TableName: 'user',
        KeyConditionExpression: '#un = :user',
        ExpressionAttributeNames: {
            '#un': 'username'
        },
        ExpressionAttributeValues: {
            ':user': username
        }
    }).promise();
  }
  
/*******************************************************************
 * User wants to register
 *******************************************************************/
export function saveUser(user): Promise<any> {
      return docClient.put({
          TableName: 'user',
          Item: user
      }).promise();
    }

/****************************************************************** 
 * Admin giving User the Admin role
 ******************************************************************/
export function updateRole(role: string, username: string, user): Promise<any> {
    return docClient.update({
        TableName: 'user',
        Key: {
            username: user.username
        },
        UpdateExpression: 'set #role = :role',
        ExpressionAttributeNames: {
            '#role': 'role'
        },
        ExpressionAttributeValues: {
            ':role': role
        }
    }).promise();
}