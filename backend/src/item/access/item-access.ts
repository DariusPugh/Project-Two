import * as aws from 'aws-sdk';
import {ConfigurationOptions} from 'aws-sdk/lib/config';
const awsConfig: ConfigurationOptions = {
  region: 'us-east-2',
  accessKeyId: process.env.GRS_ACCESS_KEY,
  secretAccessKey: process.env.GRS_SECRET_ACCESS_KEY
}

aws.config.update(awsConfig);

const docClient = new aws.DynamoDB.DocumentClient();

function getByTitle(category:String, title:String): Promise<any> {
    return docClient.query({
        TableName: 'item',
        KeyConditionExpression: 'category = :category and title =:title',
        ExpressionAttributeValues: { // for aliasing actual values
            ':category': category,
            ':title': title,
        },
    }).promise();
}

function getAllByCategory(category:String): Promise<any> {
    return docClient.query({
        TableName: 'item',
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: { // for aliasing actual values
            ':category': category,
        },
    }).promise();
}

function updateItemDescription(category:String, title:String, description:String): Promise<any> {
    return docClient.update({
        TableName: 'item',
        Key: {
            "category": category,
            "title": title,
        },
        UpdateExpression: "set description=:description",
        ExpressionAttributeValues: {
            ":description": description,
        }
    }).promise();
}

function updateItemScore(category:String, title:String, score:Number): Promise<any> {
    return docClient.update({
        TableName: 'item',
        Key: {
            "category": category,
            "title": title,
        },
        UpdateExpression: "set score=:score",
        ExpressionAttributeValues: {
            ":score": score,
        }
    }).promise();
}

function createItem(item:any): Promise<any> {
    return docClient.put({
        TableName: 'item',
        Item: item,
    }).promise();
}

function searchByTitle(title:String): Promise<any> {
    return docClient.query( {
        TableName: 'item',
        IndexName: 'title-index',
        KeyConditionExpression: 'title CONTAINS :title',
        ExpressionAttributeValues: { // for aliasing actual values
            ':status': title,
        },
    }).promise();
}

function addItem(item:any): Promise<any> {
    return docClient.put({
        TableName: 'item',
        Item: item,
    }).promise();
}

function deleteItem(category:String, title:String): Promise<any> {
    return docClient.delete({
        TableName: 'item',
        Key: {
            "category": category,
            "title": title,
        },
        ConditionExpression: "info.reviewed = :value",
        ExpressionAttributeValues: {
            ":value": 0
        }
    }).promise();
}