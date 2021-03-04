// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Customer, Product } = initSchema(schema);

export {
  Customer,
  Product
};