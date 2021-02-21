import React,{ useContext, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { CurrentDataContext } from '../../dataContexts/CurrentDataContext';
import { OrdersContext } from '../../dataContexts/OrdersContext'
import { StandingContext } from '../../dataContexts/StandingContext'
import { ProductsContext } from '../../dataContexts/ProductsContext'

const ByCustomer = () => {

    const { orders } = useContext(OrdersContext)
    const { standing } = useContext(StandingContext)
    const { products } = useContext(ProductsContext)
    const { delivDate, route } = useContext(CurrentDataContext)

    const [ columns, setColumns ] = useState([])
    const [ data, setData ] = useState([])


    const constructColumns = () => {
        // construct order list by orders and standing orders
        //convertStandListtoStandArray = (builtStandList, delivDate)
        // filter order list by delivDate
        // filter order list by route
        // construct list of products
        // one by one through products, add nick to columns
        // return columns
        return [
            {field: 'customer', header: 'Customer', width: {width:'10%'} },
            {field: 'pl', header: 'pl', width: {width:'30px'}},
            {field: 'ch', header: 'ch', width: {width:'30px'}},
            {field: 'al', header: 'al', width: {width:'30px'}},
            {field: 'sf', header: 'sf', width: {width:'30px'}},
            {field: 'pg', header: 'pg', width: {width:'30px'}},
            {field: 'mini', header: 'mini', width: {width:'30px'}},
            {field: 'bag', header: 'bag', width: {width:'30px'}},
            {field: 'bri', header: 'bri', width: {width:'30px'}},
            {field: 'bz', header: 'bz', width: {width:'30px'}},
            {field: 'pg', header: 'pg', width: {width:'30px'}},
            {field: 'mini', header: 'mini', width: {width:'30px'}},
            {field: 'bag', header: 'bag', width: {width:'30px'}},
            {field: 'bri', header: 'bri', width: {width:'30px'}},
            {field: 'bz', header: 'bz', width: {width:'30px'}},
            
        ];
    
    }

    const constructData = () => {
        return [
            {"customer": "Kreuzberg Kreuzberg","pl": 2,"ch": 2,"sf": 2,"pg": 65,"mini": 5,"bag":3,"bri":4,"bz":3},
            {"customer": "Kreuzberg Kreuzberg","pl": 2,"ch": 2,"al": 2,"sf": 2,"pg": 5,"bag":3,"bri":4,"bz":3},
            {"customer": "Kreuzberg","pl": 2,"ch": 2,"al": 2,"sf": 2,"pg": 65,"mini": 5,"bag":3,"bri":4,"bz":3},
            {"customer": "Kreuzberg","pl": 2,"ch": 2,"sf": 2,"mini": 5,"bag":3,"bri":4,"bz":3},
            {"customer": "Kreuzberg","ch": 2,"al": 2,"sf": 2,"pg": 65,"mini": 5,"bag":3,"bri":4,"bz":3},
           
        ];
    }

    useEffect(() => {
        let col = constructColumns(orders,standing, products)
        let dat = constructData(orders,standing,products)
        setColumns(col)
        setData(dat)

    },[orders,products,standing])
    
    

    
    const dynamicColumns = columns.map((col,i) => {
        return <Column npmkey={col.field} field={col.field} header={col.header} style={col.width}/>;
    });

    return (
        <div>
            <div className="card">
                <DataTable className="p-datatable-gridlines p-datatable-sm p-datatable-striped" 
                    value={data} resizableColumns columnResizeMode="fit">
                    {dynamicColumns}
                </DataTable>
            </div>
        </div>
    );
}

export default ByCustomer