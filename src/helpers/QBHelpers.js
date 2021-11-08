import { listInfoQBAuths } from "../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

const axios = require("axios").default;

export const checkQBValidation = async () => {
  let access;
  let val = await axios.get(
    "https://28ue1wrzng.execute-api.us-east-2.amazonaws.com/done"
  );

  if (val.data) {
    let authData = await API.graphql(
      graphqlOperation(listInfoQBAuths, { limit: "50" })
    );
    access = authData.data.listInfoQBAuths.items[0].infoContent;

    console.log(access);
  } else {
    console.log("not valid QB Auth");
  }

  return access;
};


export const createQBInvItem = (count, ord, qbID, delivDate) => {
    return {
      Id: count.toString() + delivDate.replace(/-/g, ""),

      Description: ord.prodName,
      Amount: Number(ord.rate) * Number(ord.qty),
      DetailType: "SalesItemLineDetail",
      SalesItemLineDetail: {
        ServiceDate: delivDate,

        UnitPrice: ord.rate,
        Qty: ord.qty,
        ItemRef: {
          name: ord.prodName,
          value: qbID,
        },
        ItemAccountRef: {
          name: "Uncategorized Income",
        },
        TaxCodeRef: {
          value: "TAX",
        },
      },
    };
  };


 

  export const findProductQBID = (products,ord) => {
    let qbID = null;
    try {
      qbID =
        products[products.findIndex((pro) => pro.prodName === ord.prodName)]
          .qbID;
    } catch {}
    return qbID;
  };


  export const getQBInvIDandSyncToken = async (access, docNum) => {
    let invID
    try {
        invID = await axios.post(
          "https://unfaeakk8g.execute-api.us-east-2.amazonaws.com/done",
          {
            accessCode: "Bearer " + access,
            doc: docNum,
          }
        );
      } catch {
        console.log("Error grabbing invID for " + docNum);
      }
    return invID
  }



  export const createQBInvoice = async (access, custSetup) => {
    let invID
    try {
        invID = await axios.post(
          "https://9u7sp5khrc.execute-api.us-east-2.amazonaws.com/done",
          {
            accessCode: "Bearer " + access,
            invInfo: custSetup,
          }
        );
      } catch {
        console.log("Error creating Invoice " + custSetup.CustomerRef.name);
      }
    return invID
  }