import React from 'react';

import styled from 'styled-components'

import { Button } from 'primereact/button';


const Buttons = () => {

  
    const ButtonBox = styled.div`
      display: flex;
      flex-direction: column;
      align-content: flex-start;
      width: 80%;
      margin: 5px 10px;
      padding: 5px 20px;
      `

  
  return (
   
    <ButtonBox>
        <Button label="Add a Customer" icon="pi pi-plus" 
            className={"p-button-raised p-button-rounded"} /><br />
        <Button label="Update Customer" icon="pi pi-user-edit" 
            className={"p-button-raised p-button-rounded p-button-success"} /><br />
        <Button label="Delete Customer" icon="pi pi-user-minus" 
            className={"p-button-raised p-button-rounded p-button-warning"} /><br /><br />
        <Button label="Tomorrows's Order" icon="pi pi-shopping-cart" 
            className={"p-button-raised p-button-rounded p-button-info"} /><br />
        <Button label="Edit Standing Order" icon="pi pi-calendar" 
            className={"p-button-raised p-button-rounded p-button-info"} /><br />
    </ButtonBox>    
  );
}

export default Buttons;
