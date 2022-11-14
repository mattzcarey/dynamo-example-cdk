import { Stack, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { FunctionsStackProps } from './types';

import {
  buildResourceName,
  commonLambdaEnvironment,
  commonLambdaProps,
} from '../helpers/index';

export class FunctionsStack extends Stack {
  constructor(scope: Construct, id: string, props: FunctionsStackProps) {
    super(scope, id, props);

    ////define lambdas which
    //1. Get Item (fastest) - need the whole primary key
    const getItem = new NodejsFunction(this, buildResourceName('getItem'), {
      functionName: buildResourceName('getItem'),
      entry: join(__dirname, '../functions/getItem/index.ts'),
      ...commonLambdaProps,
      environment: {
        ...commonLambdaEnvironment,
      },
    });
    //2. Put Item
    const putItem = new NodejsFunction(this, buildResourceName('getItem'), {
      functionName: buildResourceName('getItem'),
      entry: join(__dirname, '../functions/putItem/index.ts'),
      ...commonLambdaProps,
      environment: {
        ...commonLambdaEnvironment,
      },
    });
    //2. Query Item (next fastest) - requires partition key and can specify conditions on sort key
    const queryItem = new NodejsFunction(this, buildResourceName('getItem'), {
      functionName: buildResourceName('getItem'),
      entry: join(__dirname, '../functions/queryItem/index.ts'),
      ...commonLambdaProps,
      environment: {
        ...commonLambdaEnvironment,
      },
    });
    //3. Batch Get Item (as fast as query) - requires the full primary key for each item
    const batchGetItem = new NodejsFunction(
      this,
      buildResourceName('batchGetItem'),
      {
        functionName: buildResourceName('batchGetItem'),
        entry: join(__dirname, '../functions/batchGetItem/index.ts'),
        ...commonLambdaProps,
        environment: {
          ...commonLambdaEnvironment,
        },
      },
    );

    //3. Scan Item (slowest) - requires no primary key, but can specify conditions on any attribute. In lambda show how to handle result pagination.
    const scanItem = new NodejsFunction(this, buildResourceName('getItem'), {
      functionName: buildResourceName('getItem'),
      entry: join(__dirname, '../functions/scanItem/index.ts'),
      ...commonLambdaProps,
      environment: {
        ...commonLambdaEnvironment,
      },
    });

    //Give permissions to lambdas to read from dynamodb table
    props.table.grantReadData(getItem);
    props.table.grantWriteData(putItem);
    props.table.grantReadData(queryItem);
    props.table.grantReadData(batchGetItem);
    props.table.grantReadData(scanItem);

    // Add tags to all assets within this stack
    Tags.of(this).add('Stage', 'dev', { priority: 300 });
    Tags.of(this).add('CreatedBy', 'CDK', { priority: 300 });
    Tags.of(this).add('Purpose', 'Example Service', { priority: 300 });
    Tags.of(this).add('Owner', 'CDK', { priority: 300 });
  }
}
