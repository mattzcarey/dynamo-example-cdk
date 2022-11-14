import {
  AttributeMap,
  DocumentClient,
  ScanInput,
  ScanOutput,
} from 'aws-sdk/clients/dynamodb';
const dynamoDb = new DocumentClient();
import { errorResponse, Response, successResponse } from '../../helpers';

const listItems = async (
  params: ScanInput,
): Promise<AttributeMap[] | Response> => {
  const scanResults: AttributeMap[] = [];

  let items: ScanOutput;
  try {
    items = await dynamoDb.scan(params).promise();
  } catch (error) {
    return errorResponse(JSON.stringify(error));
  }
  items.Items?.forEach((item: AttributeMap) => scanResults.push(item));

  //if larger than 1MB, continue scanning
  while (items.LastEvaluatedKey) {
    params.ExclusiveStartKey = items.LastEvaluatedKey;
    items = await dynamoDb.scan(params).promise();
    items.Items?.forEach((item: AttributeMap) => scanResults.push(item));
  }

  return scanResults;
};

export const handler = async (): Promise<Response> => {
  const params = {
    TableName: 'someTableName',
  };
  try {
    const response = await listItems(params);

    return successResponse(JSON.stringify(response));
  } catch (error) {
    return errorResponse(JSON.stringify(error));
  }
};
