import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { errorResponse, Response, successResponse } from '../../helpers';

const dynamoDb = new DocumentClient();

export const handler = async (): Promise<Response> => {
  const params = {
    TableName: 'someTableName',
    KeyConditionExpression: 'PK = :PK', //can lump further conditions here
    ExpressionAttributeValues: {
      ':PK': 'some PK',
    }, //define values for the expression
  };
  try {
    const result = await dynamoDb.query(params).promise();

    return successResponse(JSON.stringify(result));
  } catch (error) {
    return errorResponse(JSON.stringify(error));
  }
};
