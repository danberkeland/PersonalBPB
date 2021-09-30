/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCustomer = /* GraphQL */ `
  mutation CreateCustomer(
    $input: CreateCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    createCustomer(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const updateCustomer = /* GraphQL */ `
  mutation UpdateCustomer(
    $input: UpdateCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    updateCustomer(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteCustomer = /* GraphQL */ `
  mutation DeleteCustomer(
    $input: DeleteCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    deleteCustomer(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
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
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
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
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
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
export const createStanding = /* GraphQL */ `
  mutation CreateStanding(
    $input: CreateStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    createStanding(input: $input, condition: $condition) {
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
export const updateStanding = /* GraphQL */ `
  mutation UpdateStanding(
    $input: UpdateStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    updateStanding(input: $input, condition: $condition) {
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
export const deleteStanding = /* GraphQL */ `
  mutation DeleteStanding(
    $input: DeleteStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    deleteStanding(input: $input, condition: $condition) {
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
export const createHolding = /* GraphQL */ `
  mutation CreateHolding(
    $input: CreateHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    createHolding(input: $input, condition: $condition) {
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
export const updateHolding = /* GraphQL */ `
  mutation UpdateHolding(
    $input: UpdateHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    updateHolding(input: $input, condition: $condition) {
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
export const deleteHolding = /* GraphQL */ `
  mutation DeleteHolding(
    $input: DeleteHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    deleteHolding(input: $input, condition: $condition) {
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
export const createRoute = /* GraphQL */ `
  mutation CreateRoute(
    $input: CreateRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    createRoute(input: $input, condition: $condition) {
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
export const updateRoute = /* GraphQL */ `
  mutation UpdateRoute(
    $input: UpdateRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    updateRoute(input: $input, condition: $condition) {
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
export const deleteRoute = /* GraphQL */ `
  mutation DeleteRoute(
    $input: DeleteRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    deleteRoute(input: $input, condition: $condition) {
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
export const createZone = /* GraphQL */ `
  mutation CreateZone(
    $input: CreateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    createZone(input: $input, condition: $condition) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const updateZone = /* GraphQL */ `
  mutation UpdateZone(
    $input: UpdateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    updateZone(input: $input, condition: $condition) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const deleteZone = /* GraphQL */ `
  mutation DeleteZone(
    $input: DeleteZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    deleteZone(input: $input, condition: $condition) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const createAltPricing = /* GraphQL */ `
  mutation CreateAltPricing(
    $input: CreateAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    createAltPricing(input: $input, condition: $condition) {
      id
      custName
      prodName
      wholePrice
      createdAt
      updatedAt
    }
  }
`;
export const updateAltPricing = /* GraphQL */ `
  mutation UpdateAltPricing(
    $input: UpdateAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    updateAltPricing(input: $input, condition: $condition) {
      id
      custName
      prodName
      wholePrice
      createdAt
      updatedAt
    }
  }
`;
export const deleteAltPricing = /* GraphQL */ `
  mutation DeleteAltPricing(
    $input: DeleteAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    deleteAltPricing(input: $input, condition: $condition) {
      id
      custName
      prodName
      wholePrice
      createdAt
      updatedAt
    }
  }
`;
export const createClosure = /* GraphQL */ `
  mutation CreateClosure(
    $input: CreateClosureInput!
    $condition: ModelClosureConditionInput
  ) {
    createClosure(input: $input, condition: $condition) {
      id
      custName
      firstDate
      lastDate
      createdAt
      updatedAt
    }
  }
`;
export const updateClosure = /* GraphQL */ `
  mutation UpdateClosure(
    $input: UpdateClosureInput!
    $condition: ModelClosureConditionInput
  ) {
    updateClosure(input: $input, condition: $condition) {
      id
      custName
      firstDate
      lastDate
      createdAt
      updatedAt
    }
  }
`;
export const deleteClosure = /* GraphQL */ `
  mutation DeleteClosure(
    $input: DeleteClosureInput!
    $condition: ModelClosureConditionInput
  ) {
    deleteClosure(input: $input, condition: $condition) {
      id
      custName
      firstDate
      lastDate
      createdAt
      updatedAt
    }
  }
`;
export const createHeldforWeeklyInvoicing = /* GraphQL */ `
  mutation CreateHeldforWeeklyInvoicing(
    $input: CreateHeldforWeeklyInvoicingInput!
    $condition: ModelHeldforWeeklyInvoicingConditionInput
  ) {
    createHeldforWeeklyInvoicing(input: $input, condition: $condition) {
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
export const updateHeldforWeeklyInvoicing = /* GraphQL */ `
  mutation UpdateHeldforWeeklyInvoicing(
    $input: UpdateHeldforWeeklyInvoicingInput!
    $condition: ModelHeldforWeeklyInvoicingConditionInput
  ) {
    updateHeldforWeeklyInvoicing(input: $input, condition: $condition) {
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
export const deleteHeldforWeeklyInvoicing = /* GraphQL */ `
  mutation DeleteHeldforWeeklyInvoicing(
    $input: DeleteHeldforWeeklyInvoicingInput!
    $condition: ModelHeldforWeeklyInvoicingConditionInput
  ) {
    deleteHeldforWeeklyInvoicing(input: $input, condition: $condition) {
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
export const createDough = /* GraphQL */ `
  mutation CreateDough(
    $input: CreateDoughInput!
    $condition: ModelDoughConditionInput
  ) {
    createDough(input: $input, condition: $condition) {
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
export const updateDough = /* GraphQL */ `
  mutation UpdateDough(
    $input: UpdateDoughInput!
    $condition: ModelDoughConditionInput
  ) {
    updateDough(input: $input, condition: $condition) {
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
export const deleteDough = /* GraphQL */ `
  mutation DeleteDough(
    $input: DeleteDoughInput!
    $condition: ModelDoughConditionInput
  ) {
    deleteDough(input: $input, condition: $condition) {
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
export const createDoughComponent = /* GraphQL */ `
  mutation CreateDoughComponent(
    $input: CreateDoughComponentInput!
    $condition: ModelDoughComponentConditionInput
  ) {
    createDoughComponent(input: $input, condition: $condition) {
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
export const updateDoughComponent = /* GraphQL */ `
  mutation UpdateDoughComponent(
    $input: UpdateDoughComponentInput!
    $condition: ModelDoughComponentConditionInput
  ) {
    updateDoughComponent(input: $input, condition: $condition) {
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
export const deleteDoughComponent = /* GraphQL */ `
  mutation DeleteDoughComponent(
    $input: DeleteDoughComponentInput!
    $condition: ModelDoughComponentConditionInput
  ) {
    deleteDoughComponent(input: $input, condition: $condition) {
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
export const createNotes = /* GraphQL */ `
  mutation CreateNotes(
    $input: CreateNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    createNotes(input: $input, condition: $condition) {
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
export const updateNotes = /* GraphQL */ `
  mutation UpdateNotes(
    $input: UpdateNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    updateNotes(input: $input, condition: $condition) {
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
export const deleteNotes = /* GraphQL */ `
  mutation DeleteNotes(
    $input: DeleteNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    deleteNotes(input: $input, condition: $condition) {
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
export const createAuthSettings = /* GraphQL */ `
  mutation CreateAuthSettings(
    $input: CreateAuthSettingsInput!
    $condition: ModelAuthSettingsConditionInput
  ) {
    createAuthSettings(input: $input, condition: $condition) {
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
export const updateAuthSettings = /* GraphQL */ `
  mutation UpdateAuthSettings(
    $input: UpdateAuthSettingsInput!
    $condition: ModelAuthSettingsConditionInput
  ) {
    updateAuthSettings(input: $input, condition: $condition) {
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
export const deleteAuthSettings = /* GraphQL */ `
  mutation DeleteAuthSettings(
    $input: DeleteAuthSettingsInput!
    $condition: ModelAuthSettingsConditionInput
  ) {
    deleteAuthSettings(input: $input, condition: $condition) {
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
