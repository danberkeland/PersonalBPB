import React from 'react';

import { InputText } from "primereact/inputtext";

import { setValue, fixValue } from '../../../helpers/customerHelpers'


const Name = ({ selectedCustomer, setSelectedCustomer }) => {
 
  
    return (
        <React.Fragment>
            <h2><i className="pi pi-user"></i> Customer Name</h2>

            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <label htmlFor="custName"> Username</label><br />
                </span> 

            <InputText id="custName" placeholder={selectedCustomer.custName} 
              onKeyUp={e => e.code==="Enter" && setSelectedCustomer(setValue(e, selectedCustomer))} 
              onBlur={e => setSelectedCustomer(fixValue(e, selectedCustomer))}/>

            </div><br />

            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <label htmlFor="nickName"> Nickname</label><br />
                </span>

            <InputText id="nickName" placeholder={selectedCustomer.nickName} 
              onKeyUp={e => e.code==="Enter" && setSelectedCustomer(setValue(e, selectedCustomer))} 
              onBlur={e => setSelectedCustomer(fixValue(e, selectedCustomer))}/>
              
            </div><br />
        </React.Fragment>         
  );
}

export default Name;
