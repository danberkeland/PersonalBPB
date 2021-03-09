import React from 'react';


import { InputText } from "primereact/inputtext";
import { InputMask } from 'primereact/inputmask';

import { setValue, fixValue } from '../../../helpers/formHelpers'



const Contact = ({ selectedCustomer, setSelectedCustomer }) => {

  return (
    <React.Fragment>
   
        <h2><i className="pi pi-phone"></i> Contact</h2>

        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="firstName"> First Name</label><br />  
            </span>

            <InputText id="firstName" placeholder={selectedCustomer.firstName} 
              onKeyUp={e => e.code==="Enter" && setSelectedCustomer(setValue(e, selectedCustomer))} 
              onBlur={e => setSelectedCustomer(fixValue(e, selectedCustomer))}/>

        </div><br />
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="lastName"> Last Name</label><br />  
            </span>

            <InputText id="lastName" placeholder={selectedCustomer.lastName} 
              onKeyUp={e => e.code==="Enter" && setSelectedCustomer(setValue(e, selectedCustomer))} 
              onBlur={e => setSelectedCustomer(fixValue(e, selectedCustomer))}/>

        </div><br />
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="email"> Email</label><br />
            </span>

            <InputText id="email" placeholder={selectedCustomer.email} 
              onKeyUp={e => e.code==="Enter" && setSelectedCustomer(setValue(e, selectedCustomer))} 
              onBlur={e => setSelectedCustomer(fixValue(e, selectedCustomer))}/>

        </div><br />
    
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <label htmlFor="phone"> Phone</label><br />    
            </span>

            <InputMask mask="999-999-9999" id="phone" placeholder={selectedCustomer.phone} 
              onKeyUp={e => e.code==="Enter" && setSelectedCustomer(setValue(e, selectedCustomer))} 
              onBlur={e => setSelectedCustomer(fixValue(e, selectedCustomer))}/>
              
        </div><br />

    </React.Fragment>         
  );
}

export default Contact;
