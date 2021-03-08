import React from 'react';


import { InputText } from "primereact/inputtext";

const clonedeep = require('lodash.clonedeep')


const Name = ({ selectedCustomer, setSelectedCustomer }) => {
 
    const setValue = value => {
        if (value.code==="Enter"){
          let custToUpdate = clonedeep(selectedCustomer)
          custToUpdate[value.target.id] = value.target.value
          document.getElementById(value.target.id).value=''
          setSelectedCustomer(custToUpdate)
        }
      }

    const fixValue = value => {
      let custToUpdate = clonedeep(selectedCustomer)
      if (value.target.value !==''){
      custToUpdate[value.target.id] = value.target.value
      }
      document.getElementById(value.target.id).value=''
      setSelectedCustomer(custToUpdate)
    }
    

    return (
        <React.Fragment>
            <h2><i className="pi pi-user"></i> Customer Name</h2>

            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <label htmlFor="custName"> Username</label><br />
                </span> 
            <InputText id="custName" placeholder={selectedCustomer.custName} onKeyUp={setValue} onBlur={fixValue}/>
            </div><br />

            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <label htmlFor="nickName"> Nickname</label><br />
                </span>
            <InputText id="nickName" placeholder={selectedCustomer.nickName} onKeyUp={setValue} onBlur={fixValue}/>
            </div><br />
        </React.Fragment>         
  );
}

export default Name;
