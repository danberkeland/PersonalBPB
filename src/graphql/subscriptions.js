/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCustomer = /* GraphQL */ `
  subscription OnCreateCustomer {
    onCreateCustomer {
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
export const onUpdateCustomer = /* GraphQL */ `
  subscription OnUpdateCustomer {
    onUpdateCustomer {
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
export const onDeleteCustomer = /* GraphQL */ `
  subscription OnDeleteCustomer {
    onDeleteCustomer {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct {
    onCreateProduct {
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
      updateFreezerDate
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
      freezerClosing
      sheetMake
      freezerNorth
      freezerNorthClosing
      freezerNorthFlag
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct {
    onUpdateProduct {
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
      updateFreezerDate
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
      freezerClosing
      sheetMake
      freezerNorth
      freezerNorthClosing
      freezerNorthFlag
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct {
    onDeleteProduct {
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
      updateFreezerDate
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
      freezerClosing
      sheetMake
      freezerNorth
      freezerNorthClosing
      freezerNorthFlag
      createdAt
      updatedAt
    }
  }
`;
export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder {
    onCreateOrder {
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
      isLate
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder {
    onUpdateOrder {
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
      isLate
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder {
    onDeleteOrder {
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
      isLate
      createdAt
      updatedAt
    }
  }
`;
export const onCreateStanding = /* GraphQL */ `
  subscription OnCreateStanding {
    onCreateStanding {
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
export const onUpdateStanding = /* GraphQL */ `
  subscription OnUpdateStanding {
    onUpdateStanding {
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
export const onDeleteStanding = /* GraphQL */ `
  subscription OnDeleteStanding {
    onDeleteStanding {
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
export const onCreateHolding = /* GraphQL */ `
  subscription OnCreateHolding {
    onCreateHolding {
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
export const onUpdateHolding = /* GraphQL */ `
  subscription OnUpdateHolding {
    onUpdateHolding {
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
export const onDeleteHolding = /* GraphQL */ `
  subscription OnDeleteHolding {
    onDeleteHolding {
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
export const onCreateRoute = /* GraphQL */ `
  subscription OnCreateRoute {
    onCreateRoute {
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
export const onUpdateRoute = /* GraphQL */ `
  subscription OnUpdateRoute {
    onUpdateRoute {
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
export const onDeleteRoute = /* GraphQL */ `
  subscription OnDeleteRoute {
    onDeleteRoute {
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
export const onCreateZone = /* GraphQL */ `
  subscription OnCreateZone {
    onCreateZone {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateZone = /* GraphQL */ `
  subscription OnUpdateZone {
    onUpdateZone {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteZone = /* GraphQL */ `
  subscription OnDeleteZone {
    onDeleteZone {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const onCreateAltPricing = /* GraphQL */ `
  subscription OnCreateAltPricing {
    onCreateAltPricing {
      id
      custName
      prodName
      wholePrice
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAltPricing = /* GraphQL */ `
  subscription OnUpdateAltPricing {
    onUpdateAltPricing {
      id
      custName
      prodName
      wholePrice
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAltPricing = /* GraphQL */ `
  subscription OnDeleteAltPricing {
    onDeleteAltPricing {
      id
      custName
      prodName
      wholePrice
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClosure = /* GraphQL */ `
  subscription OnCreateClosure {
    onCreateClosure {
      id
      custName
      firstDate
      lastDate
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClosure = /* GraphQL */ `
  subscription OnUpdateClosure {
    onUpdateClosure {
      id
      custName
      firstDate
      lastDate
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClosure = /* GraphQL */ `
  subscription OnDeleteClosure {
    onDeleteClosure {
      id
      custName
      firstDate
      lastDate
      createdAt
      updatedAt
    }
  }
`;
export const onCreateHeldforWeeklyInvoicing = /* GraphQL */ `
  subscription OnCreateHeldforWeeklyInvoicing {
    onCreateHeldforWeeklyInvoicing {
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
export const onUpdateHeldforWeeklyInvoicing = /* GraphQL */ `
  subscription OnUpdateHeldforWeeklyInvoicing {
    onUpdateHeldforWeeklyInvoicing {
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
export const onDeleteHeldforWeeklyInvoicing = /* GraphQL */ `
  subscription OnDeleteHeldforWeeklyInvoicing {
    onDeleteHeldforWeeklyInvoicing {
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
export const onCreateDough = /* GraphQL */ `
  subscription OnCreateDough {
    onCreateDough {
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
      saltInDry
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDough = /* GraphQL */ `
  subscription OnUpdateDough {
    onUpdateDough {
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
      saltInDry
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteDough = /* GraphQL */ `
  subscription OnDeleteDough {
    onDeleteDough {
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
      saltInDry
      createdAt
      updatedAt
    }
  }
`;
export const onCreateDoughComponent = /* GraphQL */ `
  subscription OnCreateDoughComponent {
    onCreateDoughComponent {
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
export const onUpdateDoughComponent = /* GraphQL */ `
  subscription OnUpdateDoughComponent {
    onUpdateDoughComponent {
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
export const onDeleteDoughComponent = /* GraphQL */ `
  subscription OnDeleteDoughComponent {
    onDeleteDoughComponent {
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
export const onCreateNotes = /* GraphQL */ `
  subscription OnCreateNotes {
    onCreateNotes {
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
export const onUpdateNotes = /* GraphQL */ `
  subscription OnUpdateNotes {
    onUpdateNotes {
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
export const onDeleteNotes = /* GraphQL */ `
  subscription OnDeleteNotes {
    onDeleteNotes {
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
export const onCreateAuthSettings = /* GraphQL */ `
  subscription OnCreateAuthSettings {
    onCreateAuthSettings {
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
export const onUpdateAuthSettings = /* GraphQL */ `
  subscription OnUpdateAuthSettings {
    onUpdateAuthSettings {
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
export const onDeleteAuthSettings = /* GraphQL */ `
  subscription OnDeleteAuthSettings {
    onDeleteAuthSettings {
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
export const onCreateInfoQBAuth = /* GraphQL */ `
  subscription OnCreateInfoQBAuth {
    onCreateInfoQBAuth {
      id
      infoName
      infoContent
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInfoQBAuth = /* GraphQL */ `
  subscription OnUpdateInfoQBAuth {
    onUpdateInfoQBAuth {
      id
      infoName
      infoContent
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInfoQBAuth = /* GraphQL */ `
  subscription OnDeleteInfoQBAuth {
    onDeleteInfoQBAuth {
      id
      infoName
      infoContent
      createdAt
      updatedAt
    }
  }
`;
