/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProducts = /* GraphQL */ `
  query GetProducts($id: ID!) {
    getProducts(id: $id) {
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
export const listProductss = /* GraphQL */ `
  query ListProductss(
    $filter: ModelProductsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getCustomers = /* GraphQL */ `
  query GetCustomers($id: ID!) {
    getCustomers(id: $id) {
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
export const listCustomerss = /* GraphQL */ `
  query ListCustomerss(
    $filter: ModelCustomersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomerss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
