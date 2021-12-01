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
      printDuplicate
      terms
      invoicing
      prodsNotAllowed
      latestFirstDeliv
      latestFinalDeliv
      webpageURL
      picURL
      gMap
      specialInstructions
      delivOrder
      customProd
      templateProd
      userSubs
      qbID
      currentBalance
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
        printDuplicate
        terms
        invoicing
        prodsNotAllowed
        latestFirstDeliv
        latestFinalDeliv
        webpageURL
        picURL
        gMap
        specialInstructions
        delivOrder
        customProd
        templateProd
        userSubs
        qbID
        currentBalance
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
      eodCount
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
      currentStock
      whoCountedLast
      forBake
      bakeExtra
      batchSize
      preshaped
      prepreshaped
      updatePreDate
      backporchbakerypre
      backporchbakery
      bpbextrapre
      bpbextra
      bpbssetoutpre
      bpbssetout
      defaultInclude
      leadTime
      qbID
      freezerCount
      sheetMake
      freezerNorth
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
        eodCount
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
        currentStock
        whoCountedLast
        forBake
        bakeExtra
        batchSize
        preshaped
        prepreshaped
        updatePreDate
        backporchbakerypre
        backporchbakery
        bpbextrapre
        bpbextra
        bpbssetoutpre
        bpbssetout
        defaultInclude
        leadTime
        qbID
        freezerCount
        sheetMake
        freezerNorth
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
      rate
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
        rate
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
      Test
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
        Test
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
      printOrder
      driver
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
        printOrder
        driver
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
export const getDough = /* GraphQL */ `
  query GetDough($id: ID!) {
    getDough(id: $id) {
      id
      doughName
      hydration
      process
      batchSize
      mixedWhere
      components
      oldDough
      isBakeReady
      buffer
      bucketSets
      preBucketSets
      updatePreBucket
      createdAt
      updatedAt
    }
  }
`;
export const listDoughs = /* GraphQL */ `
  query ListDoughs(
    $filter: ModelDoughFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDoughs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        doughName
        hydration
        process
        batchSize
        mixedWhere
        components
        oldDough
        isBakeReady
        buffer
        bucketSets
        preBucketSets
        updatePreBucket
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDoughComponent = /* GraphQL */ `
  query GetDoughComponent($id: ID!) {
    getDoughComponent(id: $id) {
      id
      dough
      componentType
      componentName
      amount
      createdAt
      updatedAt
    }
  }
`;
export const listDoughComponents = /* GraphQL */ `
  query ListDoughComponents(
    $filter: ModelDoughComponentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDoughComponents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        dough
        componentType
        componentName
        amount
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getNotes = /* GraphQL */ `
  query GetNotes($id: ID!) {
    getNotes(id: $id) {
      id
      note
      forWhom
      byWhom
      when
      createdAt
      updatedAt
    }
  }
`;
export const listNotess = /* GraphQL */ `
  query ListNotess(
    $filter: ModelNotesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotess(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        note
        forWhom
        byWhom
        when
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAuthSettings = /* GraphQL */ `
  query GetAuthSettings($id: ID!) {
    getAuthSettings(id: $id) {
      id
      sub
      authType
      tempPassword
      tempUsername
      subSubs
      firstName
      lastName
      businessName
      phone
      email
      verified
      createdAt
      updatedAt
    }
  }
`;
export const listAuthSettingss = /* GraphQL */ `
  query ListAuthSettingss(
    $filter: ModelAuthSettingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAuthSettingss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        authType
        tempPassword
        tempUsername
        subSubs
        firstName
        lastName
        businessName
        phone
        email
        verified
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInfoQBAuth = /* GraphQL */ `
  query GetInfoQBAuth($id: ID!) {
    getInfoQBAuth(id: $id) {
      id
      infoName
      infoContent
      createdAt
      updatedAt
    }
  }
`;
export const listInfoQBAuths = /* GraphQL */ `
  query ListInfoQBAuths(
    $filter: ModelInfoQBAuthFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInfoQBAuths(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        infoName
        infoContent
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
