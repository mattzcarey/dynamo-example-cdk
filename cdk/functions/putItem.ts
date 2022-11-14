import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { errorResponse, Response, successResponse } from '../../helpers';

const dynamoDb = new DocumentClient();

export const handler = async (): Promise<Response> => {
  const params = {
    TableName: 'someTableName',
    Item: { PK: 'some partition key', SK: 'some sort key' },
  };
  try {
    const result = await dynamoDb.put(params).promise();

    return successResponse(JSON.stringify(result));
  } catch (error) {
    return errorResponse(JSON.stringify(error));
  }
};
