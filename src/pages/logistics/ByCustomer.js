import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const ByCustomer = () => {
    
    const columns = [
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
    ];

    const products = [
        {"customer": "Kreuzberg Kreuzberg","pl": 2,"ch": 2,"sf": 2,"pg": 65,"mini": 5,"bag":3,"bri":4,"bz":3},
        {"customer": "Kreuzberg Kreuzberg","pl": 2,"ch": 2,"al": 2,"sf": 2,"pg": 5,"bag":3,"bri":4,"bz":3},
        {"customer": "Kreuzberg","pl": 2,"ch": 2,"al": 2,"sf": 2,"pg": 65,"mini": 5,"bag":3,"bri":4,"bz":3},
        {"customer": "Kreuzberg","pl": 2,"ch": 2,"sf": 2,"mini": 5,"bag":3,"bri":4,"bz":3},
        {"customer": "Kreuzberg","ch": 2,"al": 2,"sf": 2,"pg": 65,"mini": 5,"bag":3,"bri":4,"bz":3},
       
    ];

    
    const dynamicColumns = columns.map((col,i) => {
        return <Column key={col.field} field={col.field} header={col.header} style={col.width}/>;
    });

    return (
        <div>
            <div className="card">
                <DataTable value={products} resizableColumns columnResizeMode="fit">
                    {dynamicColumns}
                </DataTable>
            </div>
        </div>
    );
}

export default ByCustomer