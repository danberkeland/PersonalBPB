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

export const updateProduct2 = /* GraphQL */ `
  mutation UpdateProduct2(
    $input: UpdateProduct2Input!
    $condition: ModelProduct2ConditionInput
  ) {
    updateProduct2(input: $input, condition: $condition) {
      prodName
      prodNick
      createdAt
      updatedAt
    }
  }
`;

export const createProduct2 = /* GraphQL */ `
  mutation CreateProduct2(
    $input: CreateProduct2Input!
    $condition: ModelProduct2ConditionInput
  ) {
    createProduct2(input: $input, condition: $condition) {
      prodName
      prodNick
      createdAt
      updatedAt
    }
  }
`;


export const deleteProduct2 = /* GraphQL */ `
  mutation DeleteProduct2(
    $input: DeleteProduct2Input!
    $condition: ModelProduct2ConditionInput
  ) {
    deleteProduct2(input: $input, condition: $condition) {
      prodName
      prodNick
      createdAt
      updatedAt
    }
  }
`;