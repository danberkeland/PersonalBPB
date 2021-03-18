import React, { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { CurrentDataContext } from "../../../../dataContexts/CurrentDataContext";
import { OrdersContext } from "../../../../dataContexts/OrdersContext";
import { CustomerContext } from "../../../../dataContexts/CustomerContext";
import { StandingContext } from "../../../../dataContexts/StandingContext";
import { ProductsContext } from "../../../../dataContexts/ProductsContext";

import {
  buildCartList,
  buildStandList,
} from "../../../../helpers/CartBuildingHelpers";

import { sortAtoZDataByIndex } from "../../../../helpers/sortDataHelpers";
import { convertDatetoBPBDate } from "../../../../helpers/dateTimeHelpers";

const RouteGrid = ({ routes, setRoutes }) => {
  const { orders } = useContext(OrdersContext);
  const { customers } = useContext(CustomerContext);
  const { standing } = useContext(StandingContext);
  const { products } = useContext(ProductsContext);
  const { delivDate, route, setRoute } = useContext(CurrentDataContext);

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const constructGridInfo = () => {
    let cartList = buildCartList("*", delivDate, orders);
    let standList = buildStandList("*", delivDate, standing);

    let orderList = cartList.concat(standList);

    for (let i = 0; i < orderList.length; ++i) {
      for (let j = i + 1; j < orderList.length; ++j) {
        if (
          orderList[i]["prodName"] === orderList[j]["prodName"] &&
          orderList[i]["custName"] === orderList[j]["custName"]
        ) {
          orderList.splice(j, 1);
        }
      }
    }
    let noZeroDelivDateOrderList = orderList.filter(
      (ord) =>
        Number(ord["qty"]) > 0 &&
        ord["delivDate"] === convertDatetoBPBDate(delivDate)
    );
    for (let ord of noZeroDelivDateOrderList) {
      if (ord["route"] === undefined || ord["route"] === "deliv") {
        let ind = customers.findIndex(
          (cust) => cust["custName"] === ord["custName"]
        );
        if (ind > -1) {
          let custRoute = customers[ind]["zoneName"];
          ord["route"] = custRoute;
        }
      }
    }
    let filterServe;
    if (routes) {
      let rtInd = routes.findIndex((rt) => rt["routeName"] === route);
      filterServe = noZeroDelivDateOrderList.filter((ord) =>
        routes[rtInd]["RouteServe"].includes(ord["route"])
      );
    }

    if (!filterServe) {
      return;
    }

    let gridOrderArray;
    gridOrderArray = filterServe.map((ord) => ({
      prodName: ord["prodName"],
      custName: ord["custName"],
      zone: ord["route"],
      route: "",
      qty: ord["qty"],
      where:
        products[
          products.findIndex((prod) => prod["prodName"] === ord["prodName"])
        ]["bakedWhere"],
      when:
        products[
          products.findIndex((prod) => prod["prodName"] === ord["prodName"])
        ]["readyTime"],
    }));

    for (let rte of routes) {
      for (let grd of gridOrderArray) {
        if (!rte["RouteServe"].includes(grd["zone"])) {
          break;
        }

        else {
          grd["route"] = rte["routeName"];
        }

        
      }
    }
    console.log(gridOrderArray);
  };

  const constructColumns = () => {
    let gridInfo = constructGridInfo();

    /*
        orderList = orderList.filter(order => order[4] === route)

        let listOfProducts = orderList.map(order => order[1])
        listOfProducts = new Set(listOfProducts)
        let prodArray = []
        for (let prod of listOfProducts){
            for (let item of products){
                if (prod === item[1]){
                    let newItem = [prod, item[2],item[4],item[5]]
                    prodArray.push(newItem)
                }
            }
        }

        sortAtoZDataByIndex(prodArray,2)


        let columns = [{field: 'customer', header: 'Customer', width: {width:'10%'} }]
        for (let prod of prodArray){
            let newCol = {field: prod[0], header: prod[1], width: {width:'30px'}}
            columns.push(newCol)
        }
        return columns
        */
  };

  const constructData = () => {
    /*
        let cartList = buildCartList("*",delivDate,orders)
        let standList = buildStandList("*", delivDate, standing)

        let orderList = cartList.concat(standList)
   
        for (let i=0; i<orderList.length; ++i ){
            for (let j=i+1; j<orderList.length; ++j){
                if (orderList[i][1] === orderList[j][1] && orderList[i][2] === orderList[j][2]){
                    orderList.splice(j,1);
                }
            }
        }

        orderList = orderList.filter(order => order[4] === route)
        let listOfCustomers = orderList.map(order => order[2])
        listOfCustomers = new Set(listOfCustomers)
        
        let data=[]
        for (let cust of listOfCustomers){
            let newData = {"customer": cust}
            for (let order of orderList){
                if (order[2] === cust){
                    newData[order[1]] = order[0]
                }
            }

            data.push(newData)
        }
        
        return data
        */
  };

  useEffect(() => {
    let col = constructColumns();
    let dat = constructData();
    setColumns(col);
    setData(dat);
  }, [delivDate, route]);

  //const dynamicColumns = columns.map((col,i) => {
  //   return <Column npmkey={col.field} field={col.field} header={col.header} style={col.width}/>;
  //});

  return (
    <div>
      <div className="card">
        <DataTable
          className="p-datatable-gridlines p-datatable-sm p-datatable-striped"
          value={data}
          resizableColumns
          columnResizeMode="fit"
        >
          {/*{dynamicColumns}*/}
        </DataTable>
      </div>
    </div>
  );
};

export default RouteGrid;
