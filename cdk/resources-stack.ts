import { CfnOutput, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { buildResourceName, getStage } from '../helpers';

import { exampleTable } from './resources/dynamo-db/example-table';

export class ExampleResourcesStack extends Stack {
  table: Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = exampleTable(this, id);

    new CfnOutput(this, 'ExampleTableArn', {
      value: table.tableArn,
      exportName: buildResourceName('example-table-arn'),
    });

    new CfnOutput(this, 'ExampleTableStreamArn', {
      value: table.tableStreamArn as string,
    });

    this.table = table;

    // Add tags to all assets within this stack
    Tags.of(this).add('Stage', getStage(), { priority: 300 });
    Tags.of(this).add('CreatedBy', 'CDK', { priority: 300 });
    Tags.of(this).add('Purpose', 'Example Resources', { priority: 300 });
    Tags.of(this).add('Owner', 'CDK', { priority: 300 });
  }
}
