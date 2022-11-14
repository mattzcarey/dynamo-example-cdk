import { RemovalPolicy } from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from 'aws-cdk-lib/aws-dynamodb';

import { buildResourceName } from '../../../helpers';

import { ExampleResourcesStack } from '../../resources-stack';

export const exampleTable = (
  stack: ExampleResourcesStack,
  id: string,
): Table => {
  const table = new Table(stack, id, {
    tableName: buildResourceName('example-table'),

    //Primary key must be unique. Generally we choose a combo of partition key and sort key

    //Partition key (hash key). Determines the partition where the data is stored.
    partitionKey: { name: 'PK', type: AttributeType.STRING },
    // note the user of PK and SK for names. Allows 'overloading of keys for more flexibility
    billingMode: BillingMode.PAY_PER_REQUEST, //PROVISIONED

    //Optional
    //Sort key (range key). Determines the sort order of the data in the partition.
    sortKey: { name: 'SK', type: AttributeType.STRING },
    removalPolicy: RemovalPolicy.DESTROY, //RETAIN, SNAPSHOT
    pointInTimeRecovery: true,
  });

  //Example of adding a local secondary index (max 5) *must be created at table creation
  //We don't really use these, but they can be useful for querying
  table.addLocalSecondaryIndex({
    indexName: 'LSI',
    sortKey: { name: 'LSI', type: AttributeType.STRING },
    projectionType: ProjectionType.ALL,
  });

  //Example of adding a global secondary index (max 20)
  table.addGlobalSecondaryIndex({
    indexName: 'GSI',
    partitionKey: { name: 'GSI', type: AttributeType.STRING },
    sortKey: { name: 'GSI', type: AttributeType.STRING },
    projectionType: ProjectionType.ALL,
  });

  return table;
};
