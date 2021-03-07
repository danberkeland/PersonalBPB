import React from 'react';


import { InputText } from "primereact/inputtext";


const Name = ({ selectedCustomer }) => {
 
  return (
    <React.Fragment>
        <h2><i className="pi pi-user"></i> Customer Name</h2>

        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="custName"> Username</label><br />
            </span> 
        <InputText id="custName" placeholder={selectedCustomer.custName} disabled />
        </div><br />

        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="nickName"> Nickname</label><br />
            </span>
        <InputText id="nickName" placeholder={selectedCustomer.nickName}  disabled />
        </div><br />
    </React.Fragment>         
  );
}

export default Name;
