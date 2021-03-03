// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Products, Customers } = initSchema(schema);

export {
  Products,
  Customers
};