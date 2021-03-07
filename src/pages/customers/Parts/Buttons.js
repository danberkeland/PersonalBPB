import React from 'react';

import styled from 'styled-components'

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
    e && window.open('./Ordering?selectedCustomer='+selectedCustomer.custName)
}

const Buttons = ({ selectedCustomer }) => {

  return (
   
    <ButtonBox>
        <Button label="Add a Customer" icon="pi pi-plus" 
            className={"p-button-raised p-button-rounded"} /><br />
        <Button label="Update Customer" icon="pi pi-user-edit" 
            className={"p-button-raised p-button-rounded p-button-success"} /><br />
        <Button label="Delete Customer" icon="pi pi-user-minus" 
            className={"p-button-raised p-button-rounded p-button-warning"} /><br /><br />
        <Button id="order" label="Tomorrow's Order" icon="pi pi-shopping-cart" onClick={e => {handleOrderClick(e, selectedCustomer)}}
            className={"p-button-raised p-button-rounded p-button-info"} /><br />
        <Button label="Edit Standing Order" icon="pi pi-calendar" 
            className={"p-button-raised p-button-rounded p-button-info"} /><br />
    </ButtonBox>    
  );
}

export default Buttons;
