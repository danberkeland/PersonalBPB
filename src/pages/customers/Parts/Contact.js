import React from 'react';


import { InputText } from "primereact/inputtext";
import { InputMask } from 'primereact/inputmask';


const clonedeep = require('lodash.clonedeep')



const Contact = ({ selectedCustomer, setSelectedCustomer }) => {


  const setValue = value => {
    if (value.code==="Enter"){
      console.log(value.target)
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
   
        <h2><i className="pi pi-phone"></i> Contact</h2>

        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="firstName"> First Name</label><br />  
            </span>
            <InputText id="firstName" placeholder={selectedCustomer.firstName} onKeyUp={setValue} onBlur={fixValue}/>
        </div><br />
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="lastName"> Last Name</label><br />  
            </span>
            <InputText id="lastName" placeholder={selectedCustomer.lastName} onKeyUp={setValue} onBlur={fixValue}/>
        </div><br />
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="email"> Email</label><br />
            </span>
            <InputText id="email" placeholder={selectedCustomer.email} onKeyUp={setValue}/>
        </div><br />
    
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="phone"> Phone</label><br />    
            </span>
            <InputMask mask="999-999-9999" id="phone" placeholder={selectedCustomer.phone} onKeyUp={setValue}/>
        </div><br />

    </React.Fragment>         
  );
}

export default Contact;
