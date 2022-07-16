export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
       
        prodName
        nickName
        
      }
      nextToken
    }
  }
`;


export const listProduct2s = /* GraphQL */ `
  query ListProduct2s(
    $prodNick: String
    $filter: ModelProduct2FilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProduct2s(
      prodNick: $prodNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        prodName
        prodNick
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;