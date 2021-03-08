import React from 'react';

import styled from 'styled-components'
import 'primereact/resources/themes/saga-blue/theme.css';

import { Button } from 'primereact/button';


const ButtonBox = styled.div`
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    width: 80%;
    margin: 5px 10px;
    padding: 5px 20px;
    `


const handleOrderClick = (e, selectedCustomer) => {
    e && window.open('./Ordering?cartList=true&selectedCustomer='+selectedCustomer.custName)
}

const handleStandClick = (e, selectedCustomer) => {
    e && window.open('./Ordering?cartList=false&selectedCustomer='+selectedCustomer.custName)
}

const Buttons = ({ selectedCustomer, setSelectedCustomer }) => {

    const handleAddCust = () => {
        setSelectedCustomer({})
    }

    return (
   
    <ButtonBox>
        <Button label="Add a Customer" icon="pi pi-plus" onClick={handleAddCust}
            className={"p-button-raised p-button-rounded"} /><br />
        {selectedCustomer && <React.Fragment><Button label="Update Customer" icon="pi pi-user-edit" 
            className={"p-button-raised p-button-rounded p-button-success"} /><br /></React.Fragment>}
        {selectedCustomer && <React.Fragment><Button label="Delete Customer" icon="pi pi-user-minus" 
            className={"p-button-raised p-button-rounded p-button-warning"} /><br /><br /></React.Fragment>}
        {selectedCustomer && <React.Fragment><Button id="order" label="Tomorrow's Order" icon="pi pi-shopping-cart" onClick={e => {handleOrderClick(e, selectedCustomer)}}
            className={"p-button-raised p-button-rounded p-button-info"} disabled={selectedCustomer.custName ? false : true}/><br /></React.Fragment>}
        {selectedCustomer && <React.Fragment><Button label="Edit Standing Order" icon="pi pi-calendar" onClick={e => {handleStandClick(e, selectedCustomer)}}
            className={"p-button-raised p-button-rounded p-button-info"} disabled={selectedCustomer.custName ? false : true}/><br /></React.Fragment>}
    </ButtonBox>    
  );
}

export default Buttons;
