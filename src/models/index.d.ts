import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Products {
  readonly id: string;
  readonly earliestAvailable: string;
  readonly prodName: string;
  readonly nickName: string;
  readonly packGroup?: string;
  readonly packSize: number;
  readonly doughType?: string;
  readonly freezerThaw?: boolean;
  readonly packGroupOrder?: number;
  constructor(init: ModelInit<Products>);
  static copyOf(source: Products, mutator: (draft: MutableModel<Products>) => MutableModel<Products> | void): Products;
}

export declare class Customers {
  readonly id: string;
  readonly nickName: string;
  readonly custName: string;
  readonly zoneName: string;
  readonly timeStamp: number;
  readonly billAddr1?: string;
  readonly billAddr2?: string;
  readonly billAddrCity?: string;
  readonly billAddrZip?: string;
  readonly billEmail?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly toBePrinted?: boolean;
  readonly ToBeEmailed?: boolean;
  readonly Net?: string;
  readonly Invoicing?: string;
  readonly Wholesale: string;
  readonly prodsNotAllowed?: (string | null)[];
  readonly earliestDelivery: string;
  readonly webpageURL?: string;
  readonly picURL?: string;
  readonly gMaps?: string;
  readonly specialInstructions?: string;
  constructor(init: ModelInit<Customers>);
  static copyOf(source: Customers, mutator: (draft: MutableModel<Customers>) => MutableModel<Customers> | void): Customers;
}