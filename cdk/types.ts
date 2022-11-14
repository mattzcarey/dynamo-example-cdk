import { StackProps } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

export interface FunctionsStackProps extends StackProps {
  table: Table;
}
