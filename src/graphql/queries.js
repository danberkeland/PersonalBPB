/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCustomer = /* GraphQL */ `
  query GetCustomer($id: ID!) {
    getCustomer(id: $id) {
      id
      nickName
      custName
      zoneName
      addr1
      addr2
      city
      zip
      email
      firstName
      lastName
      phone
      toBePrinted
      toBeEmailed
      terms
      invoicing
      prodsNotAllowed
      latestFirstDeliv
      latestFinalDeliv
      webpageURL
      picURL
      gMap
      specialInstructions
      createdAt
      updatedAt
    }
  }
`;
export const listCustomers = /* GraphQL */ `
  query ListCustomers(
    $filter: ModelCustomerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nickName
        custName
        zoneName
        addr1
        addr2
        city
        zip
        email
        firstName
        lastName
        phone
        toBePrinted
        toBeEmailed
        terms
        invoicing
        prodsNotAllowed
        latestFirstDeliv
        latestFinalDeliv
        webpageURL
        picURL
        gMap
        specialInstructions
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      prodName
      nickName
      packGroup
      packSize
      doughType
      freezerThaw
      packGroupOrder
      readyTime
      bakedWhere
      wholePrice
      retailPrice
      isWhole
      depends
      weight
      descrip
      picURL
      squareID
      createdAt
      updatedAt
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prodName
        nickName
        packGroup
        packSize
        doughType
        freezerThaw
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
        depends
        weight
        descrip
        picURL
        squareID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
      id
      qty
      prodName
      custName
      PONote
      route
      SO
      isWhole
      delivDate
      timeStamp
      createdAt
      updatedAt
    }
  }
`;
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        qty
        prodName
        custName
        PONote
        route
        SO
        isWhole
        delivDate
        timeStamp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getStanding = /* GraphQL */ `
  query GetStanding($id: ID!) {
    getStanding(id: $id) {
      id
      timeStamp
      prodName
      custName
      isStand
      Sun
      Mon
      Tue
      Wed
      Thu
      Fri
      Sat
      createdAt
      updatedAt
    }
  }
`;
export const listStandings = /* GraphQL */ `
  query ListStandings(
    $filter: ModelStandingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStandings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        timeStamp
        prodName
        custName
        isStand
        Sun
        Mon
        Tue
        Wed
        Thu
        Fri
        Sat
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getHolding = /* GraphQL */ `
  query GetHolding($id: ID!) {
    getHolding(id: $id) {
      id
      timeStamp
      prodName
      custName
      Sun
      Mon
      Tue
      Wed
      Thu
      Fri
      Sat
      createdAt
      updatedAt
    }
  }
`;
export const listHoldings = /* GraphQL */ `
  query ListHoldings(
    $filter: ModelHoldingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHoldings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        timeStamp
        prodName
        custName
        Sun
        Mon
        Tue
        Wed
        Thu
        Fri
        Sat
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRoute = /* GraphQL */ `
  query GetRoute($id: ID!) {
    getRoute(id: $id) {
      id
      routeName
      routeStart
      routeTime
      RouteDepart
      RouteArrive
      RouteServe
      RouteSched
      createdAt
      updatedAt
    }
  }
`;
export const listRoutes = /* GraphQL */ `
  query ListRoutes(
    $filter: ModelRouteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRoutes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        routeName
        routeStart
        routeTime
        RouteDepart
        RouteArrive
        RouteServe
        RouteSched
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getZone = /* GraphQL */ `
  query GetZone($id: ID!) {
    getZone(id: $id) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const listZones = /* GraphQL */ `
  query ListZones(
    $filter: ModelZoneFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listZones(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        zoneNum
        zoneName
        zoneFee
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAltPricing = /* GraphQL */ `
  query GetAltPricing($id: ID!) {
    getAltPricing(id: $id) {
      id
      custName
      prodName
      wholePrice
      createdAt
      updatedAt
    }
  }
`;
export const listAltPricings = /* GraphQL */ `
  query ListAltPricings(
    $filter: ModelAltPricingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAltPricings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        custName
        prodName
        wholePrice
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClosure = /* GraphQL */ `
  query GetClosure($id: ID!) {
    getClosure(id: $id) {
      id
      custName
      firstDate
      lastDate
      createdAt
      updatedAt
    }
  }
`;
export const listClosures = /* GraphQL */ `
  query ListClosures(
    $filter: ModelClosureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClosures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        custName
        firstDate
        lastDate
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getHeldforWeeklyInvoicing = /* GraphQL */ `
  query GetHeldforWeeklyInvoicing($id: ID!) {
    getHeldforWeeklyInvoicing(id: $id) {
      id
      custName
      delivDate
      prodName
      qty
      rate
      createdAt
      updatedAt
    }
  }
`;
export const listHeldforWeeklyInvoicings = /* GraphQL */ `
  query ListHeldforWeeklyInvoicings(
    $filter: ModelHeldforWeeklyInvoicingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHeldforWeeklyInvoicings(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        custName
        delivDate
        prodName
        qty
        rate
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
