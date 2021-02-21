import React,{ useContext, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../dataContexts/OrdersContext'
import { StandingContext } from '../../dataContexts/StandingContext'
import { ProductsContext } from '../../dataContexts/ProductsContext'

import { buildCartList, buildStandList } from '../../helpers/CartBuildingHelpers'

import { sortAtoZDataByIndex } from '../../helpers/sortDataHelpers'

const ByProduct = () => {

    const { orders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    const { delivDate, route, setRoute } = useContext(CurrentDataContext)

    const [ data, setData ] = useState([])
    const [expandedRows, setExpandedRows] = useState([]);


    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <span>{data.product}</span>
            </React.Fragment>
        );
    }

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                
            </React.Fragment>
        );
    }

    const constructData = () => {

        
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
        orderList = orderList.filter(order => Number(order[0])>0)
        if (route!==""){
            orderList = orderList.filter(order => order[4] === route)
        }

        let listOfCustomers = orderList.map(order => order[2])
        listOfCustomers = new Set(listOfCustomers)
        
        let data=[]
        for (let order of orderList){
                    let newData={}
                    newData["product"]= order[1]
                    newData["customer"] = order[2]
                    newData["qty"] = order[0]

                
            

            data.push(newData)
        }
        
        return data
    
    }

    useEffect(() => {
        let dat = constructData()
        setData(dat)

    },[delivDate, route])
    
    
    useEffect(() => {
        setRoute('')
    },[])

    return (
        <div>
            <div className="card">
                <DataTable value={data}
                    className="p-datatable-gridlines p-datatable-sm"
                    rowGroupMode="subheader" groupField="product" 
                    sortMode="single" sortField="product" sortOrder={1}
                    expandableRowGroups expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    rowGroupHeaderTemplate={headerTemplate} rowGroupFooterTemplate={footerTemplate}>
                        
                        <Column field="product" header="Product" style={{width:'35%'}}></Column>
                        <Column field="customer" header="Customer" style={{width:'35%'}}></Column>
                        <Column field="qty" header="Quantity" style={{width:'15%'}}></Column>
                        <Column field="ea" header="Total/ea." style={{width:'15%'}}></Column>
                </DataTable>  
            </div>
        </div>
    );
}

export default ByProduct