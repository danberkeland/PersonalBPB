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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateStanding = /* GraphQL */ `
  subscription OnCreateStanding {
    onCreateStanding {
      id
      dayNum
      qty
      timeStamp
      prodName
      custName
      SO
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateStanding = /* GraphQL */ `
  subscription OnUpdateStanding {
    onUpdateStanding {
      id
      dayNum
      qty
      timeStamp
      prodName
      custName
      SO
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteStanding = /* GraphQL */ `
  subscription OnDeleteStanding {
    onDeleteStanding {
      id
      dayNum
      qty
      timeStamp
      prodName
      custName
      SO
      createdAt
      updatedAt
    }
  }
`;
export const onCreateHolding = /* GraphQL */ `
  subscription OnCreateHolding {
    onCreateHolding {
      id
      dayNum
      qty
      timeStamp
      prodName
      custName
      SO
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateHolding = /* GraphQL */ `
  subscription OnUpdateHolding {
    onUpdateHolding {
      id
      dayNum
      qty
      timeStamp
      prodName
      custName
      SO
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteHolding = /* GraphQL */ `
  subscription OnDeleteHolding {
    onDeleteHolding {
      id
      dayNum
      qty
      timeStamp
      prodName
      custName
      SO
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
      price
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
      price
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
      price
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
