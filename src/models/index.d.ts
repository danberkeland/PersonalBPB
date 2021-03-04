import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Customer {
  readonly id: string;
  readonly nickName: string;
  readonly custName: string;
  readonly zoneName?: string;
  readonly addr1?: string;
  readonly addr2?: string;
  readonly city?: string;
  readonly zip?: string;
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly toBePrinted?: string;
  readonly toBeEmailed?: string;
  readonly terms?: string;
  readonly invoicing?: string;
  constructor(init: ModelInit<Customer>);
  static copyOf(source: Customer, mutator: (draft: MutableModel<Customer>) => MutableModel<Customer> | void): Customer;
}

export declare class Product {
  readonly id: string;
  readonly prodName: string;
  readonly nickName: string;
  readonly packGroup?: string;
  readonly packSize?: string;
  readonly doughType?: string;
  readonly freezerThaw?: string;
  readonly packGroupOrder?: string;
  constructor(init: ModelInit<Product>);
  static copyOf(source: Product, mutator: (draft: MutableModel<Product>) => MutableModel<Product> | void): Product;
}