import * as aws from 'aws-sdk';
import {ConfigurationOptions} from 'aws-sdk/lib/config';
const awsConfig: ConfigurationOptions = {
  region: 'us-east-2',
  accessKeyId: process.env.GRS_ACCESS_KEY,
  secretAccessKey: process.env.GRS_SECRET_ACCESS_KEY
}

aws.config.update(awsConfig);

const docClient = new aws.DynamoDB.DocumentClient();


function addReviewComment(reviewID, message, commentUsername):Promise<any>{
    var params = {
      TableName: "reviews",
      Key: {
        "reviewID": reviewID
      },
      UpdateExpression: "SET #co = list_append(#co, :vals)",
      ExpressionAttributeNames: {
         "#co": "comments"
      },
      ExpressionAttributeValues: {
        ":vals": [{commentUsername, message}]    
      },
      ReturnValues: "UPDATED_NEW"
    }
  
    return docClient.update(params).promise();
  
  }

  function createReview(reviewID,username,body,score):Promise<any>{
    return docClient.put({
      TableName: 'reviews',
      Item: {reviewID,username,body,comments:[],score}
    }).promise();
  }

  function getReviewsByUsername(username): Promise<any>{
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

  
  function updateReview(reviewID, body): Promise<any>{
    var params = {
      TableName: "reviews",
      Key: {
        "reviewID": reviewID
      },
      UpdateExpression: "SET #bo = :body",
      ExpressionAttributeNames: {
         "#bo": "body"
      },
      ExpressionAttributeValues: {
        ":body": body    
      },
      ReturnValues: "UPDATED_NEW"
    }
  
    return docClient.update(params).promise();

  }