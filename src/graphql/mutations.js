/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProducts = /* GraphQL */ `
  mutation CreateProducts(
    $input: CreateProductsInput!
    $condition: ModelProductsConditionInput
  ) {
    createProducts(input: $input, condition: $condition) {
      id
      earliestAvailable
      prodName
      nickName
      packGroup
      packSize
      doughType
      freezerThaw
      packGroupOrder
      createdAt
      updatedAt
    }
  }
`;
export const updateProducts = /* GraphQL */ `
  mutation UpdateProducts(
    $input: UpdateProductsInput!
    $condition: ModelProductsConditionInput
  ) {
    updateProducts(input: $input, condition: $condition) {
      id
      earliestAvailable
      prodName
      nickName
      packGroup
      packSize
      doughType
      freezerThaw
      packGroupOrder
      createdAt
      updatedAt
    }
  }
`;
export const deleteProducts = /* GraphQL */ `
  mutation DeleteProducts(
    $input: DeleteProductsInput!
    $condition: ModelProductsConditionInput
  ) {
    deleteProducts(input: $input, condition: $condition) {
      id
      earliestAvailable
      prodName
      nickName
      packGroup
      packSize
      doughType
      freezerThaw
      packGroupOrder
      createdAt
      updatedAt
    }
  }
`;
export const createCustomers = /* GraphQL */ `
  mutation CreateCustomers(
    $input: CreateCustomersInput!
    $condition: ModelCustomersConditionInput
  ) {
    createCustomers(input: $input, condition: $condition) {
      id
      nickName
      custName
      zoneName
      timeStamp
      billAddr1
      billAddr2
      billAddrCity
      billAddrZip
      billEmail
      firstName
      lastName
      phone
      toBePrinted
      ToBeEmailed
      Net
      Invoicing
      Wholesale
      prodsNotAllowed
      earliestDelivery
      webpageURL
      picURL
      gMaps
      specialInstructions
      createdAt
      updatedAt
    }
  }
`;
export const updateCustomers = /* GraphQL */ `
  mutation UpdateCustomers(
    $input: UpdateCustomersInput!
    $condition: ModelCustomersConditionInput
  ) {
    updateCustomers(input: $input, condition: $condition) {
      id
      nickName
      custName
      zoneName
      timeStamp
      billAddr1
      billAddr2
      billAddrCity
      billAddrZip
      billEmail
      firstName
      lastName
      phone
      toBePrinted
      ToBeEmailed
      Net
      Invoicing
      Wholesale
      prodsNotAllowed
      earliestDelivery
      webpageURL
      picURL
      gMaps
      specialInstructions
      createdAt
      updatedAt
    }
  }
`;
export const deleteCustomers = /* GraphQL */ `
  mutation DeleteCustomers(
    $input: DeleteCustomersInput!
    $condition: ModelCustomersConditionInput
  ) {
    deleteCustomers(input: $input, condition: $condition) {
      id
      nickName
      custName
      zoneName
      timeStamp
      billAddr1
      billAddr2
      billAddrCity
      billAddrZip
      billEmail
      firstName
      lastName
      phone
      toBePrinted
      ToBeEmailed
      Net
      Invoicing
      Wholesale
      prodsNotAllowed
      earliestDelivery
      webpageURL
      picURL
      gMaps
      specialInstructions
      createdAt
      updatedAt
    }
  }
`;
