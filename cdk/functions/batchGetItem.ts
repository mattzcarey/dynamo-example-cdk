import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { errorResponse, Response, successResponse } from '../../helpers';

const dynamoDb = new DocumentClient();

export const handler = async (): Promise<Response> => {
  const params = {
    RequestItems: {
      someTableName: {
        Keys: [
          {
            PK: 'some partition key',
            SK: 'some sort key',
          },
          {
            PK: 'some other partition key',
            SK: 'some other sort key',
          },
        ],
      },
    },
  };
  try {
    const result = await dynamoDb.batchGet(params).promise();

    return successResponse(JSON.stringify(result));
  } catch (error) {
    return errorResponse(JSON.stringify(error));
  }
};
